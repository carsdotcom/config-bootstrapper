/*!
 * Config Bootstrapper v0.0.4 <https://github.com/carsdotcom/config-bootstrapper>
 * @license Apache 2.0
 * @copyright 2015 Cars.com <http://www.cars.com/>
 * @author Mac Heller-Ogden <mheller-ogden@cars.com>
 * @summary A simple configuration bootstrapper
 */
!function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
    else (function () { return this || (0, eval)('this'); }())[name] = definition();
}('ConfigBootstrapper', function () {
    var NodeLocalStorage;

    if (typeof localStorage === 'undefined' || localStorage === null) {
        /* eslint no-undef: 0 */
        NodeLocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new NodeLocalStorage('./localstorage-temp-data');
    }

    if (typeof XMLHttpRequest === 'undefined' || XMLHttpRequest === null) {
        /* eslint no-undef: 0 */
        XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    }

    function ConfigBootstrapper(options) {
        var cbs = this;

        options = (typeof options == "object") ? options : {};
        options.refreshRate = options.refreshRate || 300;
        options.dataStorageKey = options.dataStorageKey || 'configBootstrapper.data';
        options.timestampStorageKey = options.timestampStorageKey || 'configBootstrapper.timestamp';
        options.timeout = options.timeout || 4000;

        cbs.options = options;

        cbs.isReady = false;
        cbs.timeoutCounter = 0;
        cbs.readyPollRate = 100;

        cbs.data = {};

        cbs._loadData();

        setTimeout(function refreshHandler() {
            cbs._loadData();
            setTimeout(refreshHandler, options.refreshRate);
        }, options.refreshRate);
    }

    ConfigBootstrapper.prototype.markAsReady = function () {
        this.isReady = true;
    };

    ConfigBootstrapper.prototype.ready = function (callback) {
        var cbs = this;
        if (cbs.isReady) {
            callback(cbs.data);
        } else if (cbs.timeoutCounter <= cbs.timeout) {
            cbs.timeoutCounter = cbs.timeoutCounter + cbs.readyPollRate;
            setTimeout(function () {
                cbs.ready(callback);
            }, cbs.readyPollRate);
        } else {
            callback(cbs.data);
        }
    };

    ConfigBootstrapper.prototype._loadData = function () {
        var cbs,
            ts,
            now,
            xhr;

        cbs = this;

        ts = parseInt(localStorage.getItem(cbs.options.timestampStorageKey), 10);
        now = Date.now();

        if (!ts || (now >= (ts + cbs.options.refreshRate * 1000))) {
            xhr = new XMLHttpRequest();
            xhr.open('GET', cbs.options.url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) { // `DONE`
                    if (xhr.status == 200) {
                        localStorage.setItem(cbs.options.dataStorageKey, xhr.responseText);
                        localStorage.setItem(cbs.options.timestampStorageKey, now);
                        try {
                            cbs.data = JSON.parse(xhr.responseText);
                        } catch (e) {
                            /* eslint no-console: 0*/
                            console.log(e.message);
                        }
                    }
                    cbs.markAsReady();
                }
            };
            xhr.send();
        } else {
            cbs.markAsReady();
        }
    };

    return ConfigBootstrapper;

});
