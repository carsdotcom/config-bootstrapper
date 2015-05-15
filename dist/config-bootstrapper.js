/*!
 * Config Bootstrapper v0.0.1 <https://github.com/carsdotcom>
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
        options = (typeof options == "object") ? options : {};
        options.refreshRate = options.refreshRate || 300;
        options.dataStorageKey = options.dataStorageKey || 'configBootstrapper.data';
        options.timestampStorageKey = options.timestampStorageKey || 'configBootstrapper.timestamp';
        this.options = options;
    }

    ConfigBootstrapper.prototype.ready = function (callback) {
        var cbs = this;
        this._getJson(this.options.url, callback);

        setTimeout(function refreshHandler() {
            cbs._getJson(cbs.options.url, function () {});
            setTimeout(refreshHandler, cbs.options.refreshRate);
        }, this.options.refreshRate);
    };

    ConfigBootstrapper.prototype._getJson = function(callback) {
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
                    if (xhr.status === 200) {
                        console.log('boom');
                        localStorage.setItem(cbs.options.dataStorageKey, xhr.responseText);
                        localStorage.setItem(cbs.options.timestampStorageKey, now);
                    }
                    callback();
                }
            };
            xhr.send();
        } else {
            callback();
        }
    };

    return ConfigBootstrapper;

});
