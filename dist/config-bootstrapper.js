(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ConfigBootstrapper = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = ConfigBootstrapper;
/*!
 * Config Bootstrapper v0.1.1 <https://github.com/carsdotcom/config-bootstrapper>
 * @license Apache 2.0
 * @copyright 2015 Cars.com <http://www.cars.com/>
 * @author Mac Heller-Ogden <mheller-ogden@cars.com>
 * @summary A simple configuration bootstrapper
 */
function ConfigBootstrapper(options) {
    var cbs = this;

    options = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) == "object" ? options : {};
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
    var cbs, ts, now, xhr;

    cbs = this;

    ts = parseInt(localStorage.getItem(cbs.options.timestampStorageKey), 10);
    now = Date.now();

    if (!ts || now >= ts + cbs.options.refreshRateMs) {
        xhr = new XMLHttpRequest();
        xhr.open('GET', cbs.options.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // `DONE`
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

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZmlnLWJvb3RzdHJhcHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O2tCQ093QixrQjtBQVB4Qjs7Ozs7OztBQU9lLFNBQVMsa0JBQVQsQ0FBNEIsT0FBNUIsRUFBcUM7QUFDaEQsUUFBSSxNQUFNLElBQVY7O0FBRUEsY0FBVyxRQUFPLE9BQVAseUNBQU8sT0FBUCxNQUFrQixRQUFuQixHQUErQixPQUEvQixHQUF5QyxFQUFuRDtBQUNBLFlBQVEsV0FBUixHQUFzQixRQUFRLFdBQVIsSUFBdUIsR0FBN0M7QUFDQSxZQUFRLGFBQVIsR0FBd0IsUUFBUSxXQUFSLEdBQXNCLElBQTlDO0FBQ0EsWUFBUSxjQUFSLEdBQXlCLFFBQVEsY0FBUixJQUEwQix5QkFBbkQ7QUFDQSxZQUFRLG1CQUFSLEdBQThCLFFBQVEsbUJBQVIsSUFBK0IsOEJBQTdEO0FBQ0EsWUFBUSxPQUFSLEdBQWtCLFFBQVEsT0FBUixJQUFtQixJQUFyQzs7QUFFQSxRQUFJLE9BQUosR0FBYyxPQUFkOztBQUVBLFFBQUksT0FBSixHQUFjLEtBQWQ7QUFDQSxRQUFJLGNBQUosR0FBcUIsQ0FBckI7QUFDQSxRQUFJLGFBQUosR0FBb0IsRUFBcEI7O0FBRUEsUUFBSSxTQUFKOztBQUVBLGVBQVcsU0FBUyxjQUFULEdBQTBCO0FBQ2pDLFlBQUksU0FBSjtBQUNBLG1CQUFXLGNBQVgsRUFBMkIsUUFBUSxhQUFuQztBQUNILEtBSEQsRUFHRyxRQUFRLGFBSFg7QUFJSDs7QUFFRCxtQkFBbUIsU0FBbkIsQ0FBNkIsV0FBN0IsR0FBMkMsWUFBWTtBQUNuRCxTQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0gsQ0FGRDs7QUFJQSxtQkFBbUIsU0FBbkIsQ0FBNkIsS0FBN0IsR0FBcUMsVUFBVSxRQUFWLEVBQW9CO0FBQ3JELFFBQUksTUFBTSxJQUFWO0FBQ0EsUUFBSSxJQUFJLE9BQVIsRUFBaUI7QUFDYixpQkFBUyxJQUFJLE9BQUosRUFBVDtBQUNILEtBRkQsTUFFTyxJQUFJLElBQUksY0FBSixJQUFzQixJQUFJLE9BQUosQ0FBWSxPQUF0QyxFQUErQztBQUNsRCxZQUFJLGNBQUosR0FBcUIsSUFBSSxjQUFKLEdBQXFCLElBQUksYUFBOUM7QUFDQSxtQkFBVyxZQUFZO0FBQ25CLGdCQUFJLEtBQUosQ0FBVSxRQUFWO0FBQ0gsU0FGRCxFQUVHLElBQUksYUFGUDtBQUdILEtBTE0sTUFLQTtBQUNILGlCQUFTLElBQUksT0FBSixFQUFUO0FBQ0g7QUFDSixDQVpEOztBQWNBLG1CQUFtQixTQUFuQixDQUE2QixPQUE3QixHQUF1QyxZQUFZO0FBQy9DLFFBQUksT0FBTyxFQUFYO0FBQ0EsUUFBSTtBQUNBLGVBQU8sS0FBSyxLQUFMLENBQVcsYUFBYSxPQUFiLENBQXFCLEtBQUssT0FBTCxDQUFhLGNBQWxDLENBQVgsS0FBaUUsRUFBeEU7QUFDSCxLQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FBRTtBQUNkLFdBQU8sSUFBUDtBQUNILENBTkQ7O0FBUUEsbUJBQW1CLFNBQW5CLENBQTZCLFNBQTdCLEdBQXlDLFlBQVk7QUFDakQsUUFBSSxHQUFKLEVBQ0ksRUFESixFQUVJLEdBRkosRUFHSSxHQUhKOztBQUtBLFVBQU0sSUFBTjs7QUFFQSxTQUFLLFNBQVMsYUFBYSxPQUFiLENBQXFCLElBQUksT0FBSixDQUFZLG1CQUFqQyxDQUFULEVBQWdFLEVBQWhFLENBQUw7QUFDQSxVQUFNLEtBQUssR0FBTCxFQUFOOztBQUVBLFFBQUksQ0FBQyxFQUFELElBQVEsT0FBUSxLQUFLLElBQUksT0FBSixDQUFZLGFBQXJDLEVBQXNEO0FBQ2xELGNBQU0sSUFBSSxjQUFKLEVBQU47QUFDQSxZQUFJLElBQUosQ0FBUyxLQUFULEVBQWdCLElBQUksT0FBSixDQUFZLEdBQTVCLEVBQWlDLElBQWpDO0FBQ0EsWUFBSSxrQkFBSixHQUF5QixZQUFZO0FBQ2pDLGdCQUFJLElBQUksVUFBSixJQUFrQixDQUF0QixFQUF5QjtBQUFFO0FBQ3ZCLG9CQUFJLElBQUksTUFBSixJQUFjLEdBQWxCLEVBQXVCO0FBQ25CLGlDQUFhLE9BQWIsQ0FBcUIsSUFBSSxPQUFKLENBQVksY0FBakMsRUFBaUQsSUFBSSxZQUFyRDtBQUNBLGlDQUFhLE9BQWIsQ0FBcUIsSUFBSSxPQUFKLENBQVksbUJBQWpDLEVBQXNELEdBQXREO0FBQ0g7QUFDRCxvQkFBSSxXQUFKO0FBQ0g7QUFDSixTQVJEO0FBU0EsWUFBSSxJQUFKO0FBQ0gsS0FiRCxNQWFPO0FBQ0gsWUFBSSxXQUFKO0FBQ0g7QUFDSixDQTNCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIVxuICogQ29uZmlnIEJvb3RzdHJhcHBlciB2MC4xLjEgPGh0dHBzOi8vZ2l0aHViLmNvbS9jYXJzZG90Y29tL2NvbmZpZy1ib290c3RyYXBwZXI+XG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKiBAY29weXJpZ2h0IDIwMTUgQ2Fycy5jb20gPGh0dHA6Ly93d3cuY2Fycy5jb20vPlxuICogQGF1dGhvciBNYWMgSGVsbGVyLU9nZGVuIDxtaGVsbGVyLW9nZGVuQGNhcnMuY29tPlxuICogQHN1bW1hcnkgQSBzaW1wbGUgY29uZmlndXJhdGlvbiBib290c3RyYXBwZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlnQm9vdHN0cmFwcGVyKG9wdGlvbnMpIHtcbiAgICB2YXIgY2JzID0gdGhpcztcblxuICAgIG9wdGlvbnMgPSAodHlwZW9mIG9wdGlvbnMgPT0gXCJvYmplY3RcIikgPyBvcHRpb25zIDoge307XG4gICAgb3B0aW9ucy5yZWZyZXNoUmF0ZSA9IG9wdGlvbnMucmVmcmVzaFJhdGUgfHwgMzAwO1xuICAgIG9wdGlvbnMucmVmcmVzaFJhdGVNcyA9IG9wdGlvbnMucmVmcmVzaFJhdGUgKiAxMDAwO1xuICAgIG9wdGlvbnMuZGF0YVN0b3JhZ2VLZXkgPSBvcHRpb25zLmRhdGFTdG9yYWdlS2V5IHx8ICdjb25maWdCb290c3RyYXBwZXIuZGF0YSc7XG4gICAgb3B0aW9ucy50aW1lc3RhbXBTdG9yYWdlS2V5ID0gb3B0aW9ucy50aW1lc3RhbXBTdG9yYWdlS2V5IHx8ICdjb25maWdCb290c3RyYXBwZXIudGltZXN0YW1wJztcbiAgICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgNDAwMDtcblxuICAgIGNicy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIGNicy5pc1JlYWR5ID0gZmFsc2U7XG4gICAgY2JzLnRpbWVvdXRDb3VudGVyID0gMDtcbiAgICBjYnMucmVhZHlQb2xsUmF0ZSA9IDUwO1xuXG4gICAgY2JzLl9sb2FkRGF0YSgpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiByZWZyZXNoSGFuZGxlcigpIHtcbiAgICAgICAgY2JzLl9sb2FkRGF0YSgpO1xuICAgICAgICBzZXRUaW1lb3V0KHJlZnJlc2hIYW5kbGVyLCBvcHRpb25zLnJlZnJlc2hSYXRlTXMpO1xuICAgIH0sIG9wdGlvbnMucmVmcmVzaFJhdGVNcyk7XG59XG5cbkNvbmZpZ0Jvb3RzdHJhcHBlci5wcm90b3R5cGUubWFya0FzUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcbn07XG5cbkNvbmZpZ0Jvb3RzdHJhcHBlci5wcm90b3R5cGUucmVhZHkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgY2JzID0gdGhpcztcbiAgICBpZiAoY2JzLmlzUmVhZHkpIHtcbiAgICAgICAgY2FsbGJhY2soY2JzLmdldERhdGEoKSk7XG4gICAgfSBlbHNlIGlmIChjYnMudGltZW91dENvdW50ZXIgPD0gY2JzLm9wdGlvbnMudGltZW91dCkge1xuICAgICAgICBjYnMudGltZW91dENvdW50ZXIgPSBjYnMudGltZW91dENvdW50ZXIgKyBjYnMucmVhZHlQb2xsUmF0ZTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYnMucmVhZHkoY2FsbGJhY2spO1xuICAgICAgICB9LCBjYnMucmVhZHlQb2xsUmF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2soY2JzLmdldERhdGEoKSk7XG4gICAgfVxufTtcblxuQ29uZmlnQm9vdHN0cmFwcGVyLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhID0ge307XG4gICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5vcHRpb25zLmRhdGFTdG9yYWdlS2V5KSkgfHwge307XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbkNvbmZpZ0Jvb3RzdHJhcHBlci5wcm90b3R5cGUuX2xvYWREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYnMsXG4gICAgICAgIHRzLFxuICAgICAgICBub3csXG4gICAgICAgIHhocjtcblxuICAgIGNicyA9IHRoaXM7XG5cbiAgICB0cyA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKGNicy5vcHRpb25zLnRpbWVzdGFtcFN0b3JhZ2VLZXkpLCAxMCk7XG4gICAgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgIGlmICghdHMgfHwgKG5vdyA+PSAodHMgKyBjYnMub3B0aW9ucy5yZWZyZXNoUmF0ZU1zKSkpIHtcbiAgICAgICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBjYnMub3B0aW9ucy51cmwsIHRydWUpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHsgLy8gYERPTkVgXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNicy5vcHRpb25zLmRhdGFTdG9yYWdlS2V5LCB4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oY2JzLm9wdGlvbnMudGltZXN0YW1wU3RvcmFnZUtleSwgbm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2JzLm1hcmtBc1JlYWR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2JzLm1hcmtBc1JlYWR5KCk7XG4gICAgfVxufTtcbiJdfQ==
