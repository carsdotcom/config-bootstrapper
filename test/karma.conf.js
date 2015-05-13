module.exports = function (config) {
    config.set({
        basePath: '..',
        files: [
            'src/config-bootstrap.js',
            'test/specs/config-bootstrap.js'
        ],
        frameworks: [ 'jasmine-ajax', 'jasmine' ],
        exclude: [],
        port: 9876,
        colors: true,

        // possible values: DISABLE || ERROR || WARN || INFO || DEBUG
        logLevel: 'INFO',
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: [ 'PhantomJS' ],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode - true = capture browsers, run tests and exit
        singleRun: true,

        preprocessors: {
          'src/featureflags.js': [ 'coverage' ]
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: 'test/coverage_report/'
        }

    });
};
