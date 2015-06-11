(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ConfigBootstrapper = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Config Bootstrapper v0.1.0 <https://github.com/carsdotcom/config-bootstrapper>
 * @license Apache 2.0
 * @copyright 2015 Cars.com <http://www.cars.com/>
 * @author Mac Heller-Ogden <mheller-ogden@cars.com>
 * @summary A simple configuration bootstrapper
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = ConfigBootstrapper;

function ConfigBootstrapper(options) {
    var cbs = this;

    options = typeof options == 'object' ? options : {};
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
module.exports = exports['default'];

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMva2V2aW5waGlsbGlwcy9kZXYvcHJvamVjdHMvb3NzL2NvbmZpZy1ib290c3RyYXBwZXIvc3JjL2NvbmZpZy1ib290c3RyYXBwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7cUJDT3dCLGtCQUFrQjs7QUFBM0IsU0FBUyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7QUFDaEQsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVmLFdBQU8sR0FBRyxBQUFDLE9BQU8sT0FBTyxJQUFJLFFBQVEsR0FBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3RELFdBQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUM7QUFDakQsV0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUNuRCxXQUFPLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLElBQUkseUJBQXlCLENBQUM7QUFDN0UsV0FBTyxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsSUFBSSw4QkFBOEIsQ0FBQztBQUM1RixXQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDOztBQUUxQyxPQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdEIsT0FBRyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDcEIsT0FBRyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDdkIsT0FBRyxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7O0FBRXZCLE9BQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFaEIsY0FBVSxDQUFDLFNBQVMsY0FBYyxHQUFHO0FBQ2pDLFdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoQixrQkFBVSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDckQsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7Q0FDN0I7O0FBRUQsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxZQUFZO0FBQ25ELFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0NBQ3ZCLENBQUM7O0FBRUYsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLFFBQVEsRUFBRTtBQUNyRCxRQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixRQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7QUFDYixnQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQzNCLE1BQU0sSUFBSSxHQUFHLENBQUMsY0FBYyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ2xELFdBQUcsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO0FBQzVELGtCQUFVLENBQUMsWUFBWTtBQUNuQixlQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZCLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ3pCLE1BQU07QUFDSCxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQzNCO0NBQ0osQ0FBQzs7QUFFRixrQkFBa0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFlBQVk7QUFDL0MsUUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsUUFBSTtBQUNBLFlBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM5RSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7QUFDZCxXQUFPLElBQUksQ0FBQztDQUNmLENBQUM7O0FBRUYsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFZO0FBQ2pELFFBQUksR0FBRyxFQUNILEVBQUUsRUFDRixHQUFHLEVBQ0gsR0FBRyxDQUFDOztBQUVSLE9BQUcsR0FBRyxJQUFJLENBQUM7O0FBRVgsTUFBRSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RSxPQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVqQixRQUFJLENBQUMsRUFBRSxJQUFLLEdBQUcsSUFBSyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEFBQUMsQUFBQyxFQUFFO0FBQ2xELFdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQzNCLFdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxZQUFZO0FBQ2pDLGdCQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFOztBQUNyQixvQkFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNuQixnQ0FBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbkUsZ0NBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDOUQ7QUFDRCxtQkFBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3JCO1NBQ0osQ0FBQztBQUNGLFdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNkLE1BQU07QUFDSCxXQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDckI7Q0FDSixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIVxuICogQ29uZmlnIEJvb3RzdHJhcHBlciB2MC4xLjAgPGh0dHBzOi8vZ2l0aHViLmNvbS9jYXJzZG90Y29tL2NvbmZpZy1ib290c3RyYXBwZXI+XG4gKiBAbGljZW5zZSBBcGFjaGUgMi4wXG4gKiBAY29weXJpZ2h0IDIwMTUgQ2Fycy5jb20gPGh0dHA6Ly93d3cuY2Fycy5jb20vPlxuICogQGF1dGhvciBNYWMgSGVsbGVyLU9nZGVuIDxtaGVsbGVyLW9nZGVuQGNhcnMuY29tPlxuICogQHN1bW1hcnkgQSBzaW1wbGUgY29uZmlndXJhdGlvbiBib290c3RyYXBwZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29uZmlnQm9vdHN0cmFwcGVyKG9wdGlvbnMpIHtcbiAgICB2YXIgY2JzID0gdGhpcztcblxuICAgIG9wdGlvbnMgPSAodHlwZW9mIG9wdGlvbnMgPT0gXCJvYmplY3RcIikgPyBvcHRpb25zIDoge307XG4gICAgb3B0aW9ucy5yZWZyZXNoUmF0ZSA9IG9wdGlvbnMucmVmcmVzaFJhdGUgfHwgMzAwO1xuICAgIG9wdGlvbnMucmVmcmVzaFJhdGVNcyA9IG9wdGlvbnMucmVmcmVzaFJhdGUgKiAxMDAwO1xuICAgIG9wdGlvbnMuZGF0YVN0b3JhZ2VLZXkgPSBvcHRpb25zLmRhdGFTdG9yYWdlS2V5IHx8ICdjb25maWdCb290c3RyYXBwZXIuZGF0YSc7XG4gICAgb3B0aW9ucy50aW1lc3RhbXBTdG9yYWdlS2V5ID0gb3B0aW9ucy50aW1lc3RhbXBTdG9yYWdlS2V5IHx8ICdjb25maWdCb290c3RyYXBwZXIudGltZXN0YW1wJztcbiAgICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgNDAwMDtcblxuICAgIGNicy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIGNicy5pc1JlYWR5ID0gZmFsc2U7XG4gICAgY2JzLnRpbWVvdXRDb3VudGVyID0gMDtcbiAgICBjYnMucmVhZHlQb2xsUmF0ZSA9IDUwO1xuXG4gICAgY2JzLl9sb2FkRGF0YSgpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiByZWZyZXNoSGFuZGxlcigpIHtcbiAgICAgICAgY2JzLl9sb2FkRGF0YSgpO1xuICAgICAgICBzZXRUaW1lb3V0KHJlZnJlc2hIYW5kbGVyLCBvcHRpb25zLnJlZnJlc2hSYXRlTXMpO1xuICAgIH0sIG9wdGlvbnMucmVmcmVzaFJhdGVNcyk7XG59XG5cbkNvbmZpZ0Jvb3RzdHJhcHBlci5wcm90b3R5cGUubWFya0FzUmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcbn07XG5cbkNvbmZpZ0Jvb3RzdHJhcHBlci5wcm90b3R5cGUucmVhZHkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgY2JzID0gdGhpcztcbiAgICBpZiAoY2JzLmlzUmVhZHkpIHtcbiAgICAgICAgY2FsbGJhY2soY2JzLmdldERhdGEoKSk7XG4gICAgfSBlbHNlIGlmIChjYnMudGltZW91dENvdW50ZXIgPD0gY2JzLm9wdGlvbnMudGltZW91dCkge1xuICAgICAgICBjYnMudGltZW91dENvdW50ZXIgPSBjYnMudGltZW91dENvdW50ZXIgKyBjYnMucmVhZHlQb2xsUmF0ZTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjYnMucmVhZHkoY2FsbGJhY2spO1xuICAgICAgICB9LCBjYnMucmVhZHlQb2xsUmF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2soY2JzLmdldERhdGEoKSk7XG4gICAgfVxufTtcblxuQ29uZmlnQm9vdHN0cmFwcGVyLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkYXRhID0ge307XG4gICAgdHJ5IHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5vcHRpb25zLmRhdGFTdG9yYWdlS2V5KSkgfHwge307XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbkNvbmZpZ0Jvb3RzdHJhcHBlci5wcm90b3R5cGUuX2xvYWREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYnMsXG4gICAgICAgIHRzLFxuICAgICAgICBub3csXG4gICAgICAgIHhocjtcblxuICAgIGNicyA9IHRoaXM7XG5cbiAgICB0cyA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKGNicy5vcHRpb25zLnRpbWVzdGFtcFN0b3JhZ2VLZXkpLCAxMCk7XG4gICAgbm93ID0gRGF0ZS5ub3coKTtcblxuICAgIGlmICghdHMgfHwgKG5vdyA+PSAodHMgKyBjYnMub3B0aW9ucy5yZWZyZXNoUmF0ZU1zKSkpIHtcbiAgICAgICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBjYnMub3B0aW9ucy51cmwsIHRydWUpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHsgLy8gYERPTkVgXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNicy5vcHRpb25zLmRhdGFTdG9yYWdlS2V5LCB4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oY2JzLm9wdGlvbnMudGltZXN0YW1wU3RvcmFnZUtleSwgbm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2JzLm1hcmtBc1JlYWR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2JzLm1hcmtBc1JlYWR5KCk7XG4gICAgfVxufTtcbiJdfQ==
