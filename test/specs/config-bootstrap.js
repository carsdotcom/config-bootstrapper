/* global ConfigBootstrap */
describe("Loading config", function() {
    var config, configBootstrap;

    beforeEach(function () {
        jasmine.Ajax.install();
        jasmine.clock().install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
        jasmine.clock().uninstall();
    });

    config = {
        baseUrl: "http://static-config.cars.example.com",
        refreshRate: 300,
        storageKey: 'cars.configData'
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
            configBootstrap = new ConfigBootstrap(config);
        });

        describe('when the config GET request is successful', function () {

            it("loads the config from the api", function () {
                var callback, request;

                callback = jasmine.createSpy("callback");
                configBootstrap.ready(callback);

                expect(callback).not.toHaveBeenCalled();

                request = jasmine.Ajax.requests.mostRecent();

                expect(request.url).toBe('http://static-config.cars.example.com');
                expect(request.method).toBe('GET');

                request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

                expect(callback).toHaveBeenCalled();
                expect(JSON.parse(window.localStorage.getItem(config.storageKey))).toEqual({ myFlag: true });
            });
        });

        describe('when the config GET request fails', function () {

            it("the existing configuration data in local storage does not get overwritten", function () {
                var callback, request;

                callback = jasmine.createSpy("callback");
                configBootstrap.ready(callback);

                expect(callback).not.toHaveBeenCalled();

                window.localStorage.setItem(config.storageKey, JSON.stringify({ myFlag: true }));
                request = jasmine.Ajax.requests.mostRecent();

                expect(request.url).toBe('http://static-config.cars.example.com');
                expect(request.method).toBe('GET');

                request.respondWith({ status: 500, responseText:""});

                expect(callback).toHaveBeenCalled();
                expect(JSON.parse(window.localStorage.getItem(config.storageKey))).toEqual({ myFlag: true });
            });
        });

        describe("refreshing the config", function () {
            it("every 5 minutes config data will be refreshed from the server", function () {
                var request;

                configBootstrap.ready(function () {});

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({ status: 200, responseText: JSON.stringify({ myFlag: true }) });

                expect(JSON.parse(window.localStorage.getItem(config.storageKey))).toEqual({ myFlag: true });

                jasmine.clock().tick(config.refreshRate - 1);

                expect(function () {
                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith({ status: 200, responseText: JSON.stringify({ myNewFlag: true }) });
                }).toThrowError("FakeXMLHttpRequest already completed");

                jasmine.clock().tick(1);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({ status: 200, responseText: JSON.stringify({ myNewFlag: true }) });

                expect(JSON.parse(window.localStorage.getItem(config.storageKey))).toEqual({ myNewFlag: true });

                jasmine.clock().tick(config.refreshRate);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({ status: 200, responseText: JSON.stringify({ myNewestFlag: true }) });

                expect(JSON.parse(window.localStorage.getItem(config.storageKey))).toEqual({ myNewestFlag: true });
            });
        });

    });

});
