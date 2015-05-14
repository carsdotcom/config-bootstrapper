/**
 * package
 * Bundles JS as part of build task
 *
 */
var gulp,
    util,
    rename,
    uglify;

gulp = require('gulp');
util = require('gulp-util');
rename = require('gulp-rename');
uglify = require('gulp-uglify');

module.exports = function () {
    return gulp.src('src/config-bootstrapper.js')
        .pipe(gulp.dest('dist/'))
        .pipe(rename('config-bootstrapper.min.js'))
        .pipe(uglify({
            preserveComments: 'some',
            mangle: false
        }))
        .pipe(gulp.dest('dist/'))
        .on('error', util.log);
};
