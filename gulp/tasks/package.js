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
    buffer;

gulp = require('gulp');
util = require('gulp-util');
rename = require('gulp-rename');
uglify = require('gulp-uglify');
browserify = require('browserify');
babelify = require('babelify');
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
        .pipe(gulp.dest('dist/'))
        .pipe(rename('config-bootstrapper.min.js'))
        .pipe(uglify({
            preserveComments: 'some',
            mangle: false
        }))
        .pipe(gulp.dest('dist/'))
        .on('error', util.log);
};
