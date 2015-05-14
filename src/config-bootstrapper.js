/*!
 * Config Bootstrapper v0.0.0 <https://github.com/carsdotcom>
 * @license Apache 2.0
 * @copyright 2015 Cars.com <http://www.cars.com/>
 * @author Mac Heller-Ogden <mheller-ogden@cars.com>
 * @summary A simple configuration bootstrapper
 */
(function () {

    function ConfigBootstrapper(options) {
        this.options = options;
    }

    ConfigBootstrapper.prototype.ready = function (callback) {
        var configBootstrapper = this;
        this._getJson(this.options.baseUrl, callback);

        // setup refresh interval
        setTimeout(function refreshHandler() {
            configBootstrapper._getJson(configBootstrapper.options.baseUrl, function () {});
            setTimeout(refreshHandler, configBootstrapper.options.refreshRate);
        }, this.options.refreshRate);
    };

    ConfigBootstrapper.prototype._getJson = function(url, callback) {
        var bootstrap, xhr;
        bootstrap = this;
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) { // `DONE`
                if (xhr.status === 200) {
                    window.localStorage.setItem(bootstrap.options.storageKey, xhr.responseText);
                }
                callback();
            }
        };
        xhr.send();
    };

    window.ConfigBootstrapper = ConfigBootstrapper;

}());
