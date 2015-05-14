/* global ConfigBootstrapper */
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
        baseUrl: "http://static-config.cars.example.com",
        refreshRate: 300,
        dataStorageKey: 'cars.configData'
    };

    beforeEach(function () {
        var data = {};
        spyOn(window.localStorage, 'setItem').and.callFake(function(key, val){
            data[key] = val;
        });
        spyOn(window.localStorage, 'getItem').and.callFake(function(key){
            return data[key];
        });
    });

    describe("when instantiated", function() {
        beforeEach(function () {
            configBootstrapper = new ConfigBootstrapper(options);
            timeValues = {
                now: 1431630398530,
                fiveMinutes: 300 * 1000,
                almostFiveMinutes: 300 * 1000 - 1
            };
        });

        describe('given a 5 minute refresh rate', function () {
            describe('when a timestamp exists and is less than or equal to 5 minutes old', function () {
                it("should not load the config from the api", function () {
                    var callback,
                        request;

                    spyOn(window.Date, 'now').and.returnValue(timeValues.now + timeValues.almostFiveMinutes);

                    window.localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));
                    window.localStorage.setItem(options.timestampStorageKey, timeValues.now);

                    callback = jasmine.createSpy("callback");
                    configBootstrapper.ready(callback);
                    request = jasmine.Ajax.requests.mostRecent();

                    expect(request).toBeUndefined();
                    expect(JSON.parse(window.localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
                });
            });

            describe('when a timestamp exists and is older than 5 minutes old', function () {
                it("should load the config from the api", function () {
                    var callback,
                        request;

                    spyOn(window.Date, 'now').and.returnValue(timeValues.now + timeValues.almostFiveMinutes);

                    window.localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));
                    window.localStorage.setItem(options.timestampStorageKey, timeValues.now - 1);

                    callback = jasmine.createSpy("callback");
                    configBootstrapper.ready(callback);
                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: false }) });

                    expect(callback).toHaveBeenCalled();
                    expect(JSON.parse(window.localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: false });
                });
            });

            describe('when a timestamp does not exist or if the timestamp is older than 5 minutes', function () {

                describe("when the GET request is successful", function () {
                    it("loads the config from the api", function () {
                        var callback,
                            request;

                        callback = jasmine.createSpy("callback");
                        configBootstrapper.ready(callback);

                        expect(callback).not.toHaveBeenCalled();

                        request = jasmine.Ajax.requests.mostRecent();

                        expect(request.url).toBe("http://static-config.cars.example.com");
                        expect(request.method).toBe("GET");

                        request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

                        expect(callback).toHaveBeenCalled();
                        expect(JSON.parse(window.localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
                    });

                });

                describe('when the GET request fails', function () {
                    it("the existing configuration data in local storage does not get overwritten", function () {
                        var callback, request;

                        callback = jasmine.createSpy("callback");
                        configBootstrapper.ready(callback);

                        expect(callback).not.toHaveBeenCalled();

                        window.localStorage.setItem(options.dataStorageKey, JSON.stringify({ myFlag: true }));
                        request = jasmine.Ajax.requests.mostRecent();

                        expect(request.url).toBe('http://static-config.cars.example.com');
                        expect(request.method).toBe('GET');

                        request.respondWith({ status: 500, responseText:""});

                        expect(callback).toHaveBeenCalled();
                        expect(JSON.parse(window.localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });
                    });
                });
            });

            describe("refreshing the config", function () {
                it("every 5 minutes config data will be refreshed from the server", function () {
                    var request;

                    spyOn(window.Date, 'now').and.callFake((function () {
                        var now = timeValues.now;
                        return function () {
                            now = now + options.refreshRate * 1000;
                            return now;
                        };
                    }()));

                    configBootstrapper.ready(function () {});

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

                    expect(JSON.parse(window.localStorage.getItem(options.dataStorageKey))).toEqual({ myFlag: true });

                    jasmine.clock().tick(options.refreshRate - 1);

                    expect(function () {
                        request = jasmine.Ajax.requests.mostRecent();
                        request.respondWith({ status: 200, responseText: JSON.stringify({ myNewFlag: true }) });
                    }).toThrowError("FakeXMLHttpRequest already completed");

                    jasmine.clock().tick(1);

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith({ status: 200, responseText: JSON.stringify({ myNewFlag: true }) });

                    expect(JSON.parse(window.localStorage.getItem(options.dataStorageKey))).toEqual({ myNewFlag: true });

                    jasmine.clock().tick(options.refreshRate);

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith({ status: 200, responseText: JSON.stringify({ myNewestFlag: true }) });

                    expect(JSON.parse(window.localStorage.getItem(options.dataStorageKey))).toEqual({ myNewestFlag: true });
                });
            });
        });

    });

});
