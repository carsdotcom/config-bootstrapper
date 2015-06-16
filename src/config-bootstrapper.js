/*!
 * Config Bootstrapper v0.1.1 <https://github.com/carsdotcom/config-bootstrapper>
 * @license Apache 2.0
 * @copyright 2015 Cars.com <http://www.cars.com/>
 * @author Mac Heller-Ogden <mheller-ogden@cars.com>
 * @summary A simple configuration bootstrapper
 */
export default function ConfigBootstrapper(options) {
    var cbs = this;

    options = (typeof options == "object") ? options : {};
    options.refreshRate = options.refreshRate || 300;
    options.refreshRateMs = options.refreshRate * 1000;
    options.dataStorageKey = options.dataStorageKey || 'configBootstrapper.data';
    options.timestampStorageKey = options.timestampStorageKey || 'configBootstrapper.timestamp';
    options.timeout = options.timeout || 4000;

    cbs.options = options;

    cbs.isReady = false;
    cbs.timeoutCounter = 0;
    cbs.readyPollRate = 50;

    cbs._loadData();

    setTimeout(function refreshHandler() {
        cbs._loadData();
        setTimeout(refreshHandler, options.refreshRateMs);
    }, options.refreshRateMs);
}

ConfigBootstrapper.prototype.markAsReady = function () {
    this.isReady = true;
};

ConfigBootstrapper.prototype.ready = function (callback) {
    var cbs = this;
    if (cbs.isReady) {
        callback(cbs.getData());
    } else if (cbs.timeoutCounter <= cbs.options.timeout) {
        cbs.timeoutCounter = cbs.timeoutCounter + cbs.readyPollRate;
        setTimeout(function () {
            cbs.ready(callback);
        }, cbs.readyPollRate);
    } else {
        callback(cbs.getData());
    }
};

ConfigBootstrapper.prototype.getData = function () {
    var data = {};
    try {
        data = JSON.parse(localStorage.getItem(this.options.dataStorageKey)) || {};
    } catch (e) {}
    return data;
};

ConfigBootstrapper.prototype._loadData = function () {
    var cbs,
        ts,
        now,
        xhr;

    cbs = this;

    ts = parseInt(localStorage.getItem(cbs.options.timestampStorageKey), 10);
    now = Date.now();

    if (!ts || (now >= (ts + cbs.options.refreshRateMs))) {
        xhr = new XMLHttpRequest();
        xhr.open('GET', cbs.options.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) { // `DONE`
                if (xhr.status == 200) {
                    localStorage.setItem(cbs.options.dataStorageKey, xhr.responseText);
                    localStorage.setItem(cbs.options.timestampStorageKey, now);
                }
                cbs.markAsReady();
            }
        };
        xhr.send();
    } else {
        cbs.markAsReady();
    }
};
