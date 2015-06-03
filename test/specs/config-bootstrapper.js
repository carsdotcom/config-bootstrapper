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
        timestampStorageKey: 'cars.configTimestamp'
    };

    beforeEach(function () {
        var data = {};
        spyOn(localStorage, 'setItem').and.callFake(function(key, val){
            data[key] = val;
        });
        spyOn(localStorage, 'getItem').and.callFake(function(key){
            return data[key];
        });
    });

    describe("when instantiated", function() {
        beforeEach(function () {
            timeValues = {
                now: 1431630398530,
                fiveMinutes: 300 * 1000,
                almostFiveMinutes: 300 * 1000 - 1
            };
        });

        describe("given a 5 minute refresh rate", function () {
            describe("when a timestamp exists and is less than or equal to 5 minutes old", function () {
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

            describe("when a timestamp exists and is older than 5 minutes old", function () {
                it("should load the config from the api", function (done) {
                    var request;

                    jasmine.clock().uninstall();
                    spyOn(Date, 'now').and.returnValue(timeValues.now + timeValues.almostFiveMinutes);

                    localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));
                    localStorage.setItem(options.timestampStorageKey, timeValues.now - 1);

                    configBootstrapper = new ConfigBootstrapper(options);

                    configBootstrapper.ready(function () {
                        request = jasmine.Ajax.requests.mostRecent();
                        request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: false }) });
                        expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: false });
                        done();
                    });

                });
            });

            describe("when a timestamp does not exist or if the timestamp is older than 5 minutes", function () {

                describe("when the GET request is successful", function () {
                    it("loads the config from the api", function (done) {
                        var request;

                        jasmine.clock().uninstall();

                        configBootstrapper = new ConfigBootstrapper(options);

                        configBootstrapper.ready(function () {
                            request = jasmine.Ajax.requests.mostRecent();

                            expect(request.url).toBe('http://static-config.cars.example.com');
                            expect(request.method).toBe('GET');

                            request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

                            expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
                            done();
                        });

                    });

                });

                describe("when the GET request fails", function () {
                    it("the existing configuration data in local storage does not get overwritten", function (done) {
                        var request;

                        jasmine.clock().uninstall();

                        configBootstrapper = new ConfigBootstrapper(options);

                        configBootstrapper.ready(function () {
                            localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));
                            request = jasmine.Ajax.requests.mostRecent();

                            expect(request.url).toBe('http://static-config.cars.example.com');
                            expect(request.method).toBe('GET');

                            request.respondWith({ status: 500, responseText:""});

                            expect(JSON.parse(localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
                            done();
                        });

                    });
                });
            });

            describe("refreshing the config", function () {
                it("every 5 minutes config data will be refreshed from the server", function () {
                    var request;

                    spyOn(Date, 'now').and.callFake((function () {
                        var now = timeValues.now;
                        return function () {
                            return now = now + options.refreshRate * 1000;
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

    });

});
