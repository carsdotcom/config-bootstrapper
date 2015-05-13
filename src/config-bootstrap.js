/*!
 * Config Bootstrap v0.0.0 <https://github.com/carsdotcom>
 * @license Apache 2.0
 * @copyright 2015 Cars.com <http://www.cars.com/>
 * @author Mac Heller-Ogden <mheller-ogden@cars.com>
 * @summary A simple configuration bootstrap
 */
(function () {

    function ConfigBootstrap(options) {
        this.options = options;
    }

    ConfigBootstrap.prototype.ready = function (callback) {
        var configBootstrap = this;
        this._getJson(this.options.baseUrl, callback);

        // setup refresh interval
        setTimeout(function refreshHandler() {
            configBootstrap._getJson(configBootstrap.options.baseUrl, function () {});
            setTimeout(refreshHandler, configBootstrap.options.refreshRate);
        }, this.options.refreshRate);
    };

    ConfigBootstrap.prototype._getJson = function(url, callback) {
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

    window.ConfigBootstrap = ConfigBootstrap;

}());
