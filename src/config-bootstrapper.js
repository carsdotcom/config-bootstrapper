/*!
 * Config Bootstrapper v0.0.0 <https://github.com/carsdotcom>
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

    function ConfigBootstrapper(options) {
        this.options = options;
    }

    ConfigBootstrapper.prototype.ready = function (callback) {
        var configBootstrapper = this;
        this._getJson(this.options.baseUrl, callback);

        setTimeout(function refreshHandler() {
            configBootstrapper._getJson(configBootstrapper.options.baseUrl, function () {});
            setTimeout(refreshHandler, configBootstrapper.options.refreshRate);
        }, this.options.refreshRate);
    };

    ConfigBootstrapper.prototype._getJson = function(url, callback) {
        var bootstrap,
            ts,
            now,
            xhr;

        bootstrap = this;

        ts = +window.localStorage.getItem(bootstrap.options.timestampStorageKey);
        now = Date.now();

        if (!ts || (now >= (ts + bootstrap.options.refreshRate * 1000))) {
            xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) { // `DONE`
                    if (xhr.status === 200) {
                        window.localStorage.setItem(bootstrap.options.dataStorageKey, xhr.responseText);
                        window.localStorage.setItem(bootstrap.options.timestampStorageKey, now);
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
