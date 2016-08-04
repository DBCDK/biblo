'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon'],
    files: [
      'tests.actions.webpack.js',
      'tests.components.webpack.js',
      'tests.reducers.webpack.js',
      'tests.utils.webpack.js',
      'tests.server.webpack.js'
    ],
    proxies: {
    },
    exclude: [],
    preprocessors: {
      'tests.actions.webpack.js': ['webpack'],
      'tests.components.webpack.js': ['webpack'],
      'tests.reducers.webpack.js': ['webpack'],
      'tests.utils.webpack.js': ['webpack'],
      'tests.server.webpack.js': ['webpack']
    },
    reporters: ['mocha', 'junit'],
    junitReporter: {
      outputDir: 'output'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['jsdom'],
    singleRun: false,
    webpack: require('./webpack.test.config'),
    webpackMiddleware: {
      noInfo: true,
      quiet: true
    }
  });
};
