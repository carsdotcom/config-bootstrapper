/**
 * package
 * Bundles JS as part of build task
 *
 */
var gulp,
    util,
    rename,
    uglify,
    browserify,
    babelify,
    source,
    sourcemaps,
    buffer;

gulp = require('gulp');
util = require('gulp-util');
rename = require('gulp-rename');
uglify = require('gulp-uglify');
browserify = require('browserify');
babelify = require('babelify');
sourcemaps = require('gulp-sourcemaps');
source = require('vinyl-source-stream');
buffer = require('vinyl-buffer');

module.exports = function () {
    var b = browserify({
        entries: 'src/config-bootstrapper.js',
        debug: true,
        standalone: 'ConfigBootstrapper',
        transform: [babelify.configure({ presets: ['babel-preset-es2015'] })]
    });

    return b.bundle()
        .pipe(source('config-bootstrapper.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('dist/'))
        .pipe(rename('config-bootstrapper.min.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'))
        .on('error', util.log);
};
