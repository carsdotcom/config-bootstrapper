describe("Loading config bootstrapper", function() {
    var options,
        configBootstrapper,
        timeValues;

    beforeEach(function () {
        jasmine.Ajax.install();
        jasmine.clock().install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
        jasmine.clock().uninstall();
    });

    options = {
        url: 'http://static-config.cars.example.com',
        refreshRate: 300,
        dataStorageKey: 'cars.configData',
        timestampStorageKey: 'cars.configTimestamp',
        timeout: 4000
    };

    beforeEach(function () {
        var data = {};
        spyOn(localStorage, 'setItem').and.callFake(function(key, val){
            data[key] = val;
        });
        spyOn(localStorage, 'getItem').and.callFake(function(key){
            return data[key];
        });
        timeValues = {
            now: 1431630398530,
            fiveMinutes: 300 * 1000,
            almostFiveMinutes: 300 * 1000 - 1
        };
    });

    describe("when a timestamp is less than or equal to given refresh rate", function () {
        it("should not load the config from the api", function () {
            var callback,
                request;

            spyOn(Date, 'now').and.returnValue(timeValues.now + timeValues.almostFiveMinutes);

            localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));
            localStorage.setItem(options.timestampStorageKey, timeValues.now);

            configBootstrapper = new ConfigBootstrapper(options);

            callback = jasmine.createSpy('callback');
            configBootstrapper.ready(callback);

            request = jasmine.Ajax.requests.mostRecent();

            expect(request).toBeUndefined();
            expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
        });
    });

    describe("when a timestamp is older than given refresh rate", function () {
        it("should load the config from the api", function (done) {
            var request;

            jasmine.clock().uninstall();
            spyOn(Date, 'now').and.returnValue(timeValues.now + timeValues.almostFiveMinutes);

            localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));
            localStorage.setItem(options.timestampStorageKey, timeValues.now - 1);

            configBootstrapper = new ConfigBootstrapper(options);

            configBootstrapper.ready(function () {
                expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: false });
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: false }) });

        });
    });

    describe("when a timestamp does not exist", function () {
        it("should load the config from the api", function (done) {
            var request;

            jasmine.clock().uninstall();

            configBootstrapper = new ConfigBootstrapper(options);

            configBootstrapper.ready(function () {
                expect(request.url).toBe('http://static-config.cars.example.com');
                expect(request.method).toBe('GET');
                expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

        });
    });

    describe("when the GET request fails", function () {
        it("the existing configuration data in local storage does not get overwritten", function (done) {
            var request;

            jasmine.clock().uninstall();

            localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));

            configBootstrapper = new ConfigBootstrapper(options);

            configBootstrapper.ready(function () {
                expect(request.url).toBe('http://static-config.cars.example.com');
                expect(request.method).toBe('GET');
                expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ status: 500, responseText: "" });

        });
    });

    describe("when server takes too long to respond", function () {
        describe("when there is already configuration data stored in local storage", function () {
            it("should call ready callback after given timeout with existing configuration data", function (done) {
                var request, existingConfigData;

                existingConfigData = { foo: 'bar' };

                localStorage.setItem(options.dataStorageKey, JSON.stringify(existingConfigData));

                configBootstrapper = new ConfigBootstrapper(options);

                configBootstrapper.ready(function (data) {
                    expect(data).toEqual(existingConfigData);
                    done();
                });

                jasmine.clock().tick(options.timeout + 50);

                request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

            });
            it("should call ready callback after given timeout with an empty object", function (done) {
                var request;

                configBootstrapper = new ConfigBootstrapper(options);

                configBootstrapper.ready(function (data) {
                    expect(data).toEqual({});
                    done();
                });

                jasmine.clock().tick(options.timeout + 50);
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

            });
        });
    });

    describe("when refreshing the config at given refresh rate ", function () {
        it("the config data should be refreshed from the server", function () {
            var request;

            spyOn(Date, 'now').and.callFake((function () {
                var now = timeValues.now;
                return function () {
                    now = now + options.refreshRate * 1000;
                    return now;
                };
            }()));

            configBootstrapper = new ConfigBootstrapper(options);
            configBootstrapper.ready(function () {});

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

            expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });

            jasmine.clock().tick(options.refreshRate * 1000 - 1);

            expect(function () {
                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({ status: 200, responseText: JSON.stringify({ myNewFlag: true }) });
            }).toThrowError("FakeXMLHttpRequest already completed");

            jasmine.clock().tick(1);

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ status: 200, responseText: JSON.stringify({ myNewFlag: true }) });

            expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myNewFlag: true });

            jasmine.clock().tick(options.refreshRate * 1000);

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ status: 200, responseText: JSON.stringify({ myNewestFlag: true }) });

            expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myNewestFlag: true });
        });
    });

});
