/**
 * clean
 * Remove dist directory created by build
 *
 */
var gulp,
    del;

gulp = require('gulp');
del = require('del');

module.exports = function (done) {
    del('dist/', done);
};
