'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon', 'phantomjs-shim'],
    files: [
      'tests.components.webpack.js'
    ],
    proxies: {
    },
    exclude: [],
    preprocessors: {
      'tests.components.webpack.js': ['webpack']
    },
    reporters: ['mocha', 'junit', 'coverage'],
    junitReporter: {
      outputDir: 'output'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    webpack: require('./webpack.test.config'),
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      includeAllSources: true,
      dir: 'coverage/',
      reporters: [{
        type: 'html'
      }, {
        type: 'cobertura'
      }, {
        type: 'lcovonly',
        file: 'lcov.info',
        subdir: '.'
      }]
    }
  });
};
