'use strict';
let wallabyWebpack = require('wallaby-webpack');
let webpackConfig = require('./webpack.test.config');
let babel = require('babel-core');
let path = require('path');

module.exports = function(wallaby) {
  webpackConfig.resolve = {
    root: [
      wallaby.projectCacheDir,
      path.join(wallaby.projectCacheDir, 'src/client/components'),
      path.join(wallaby.projectCacheDir, 'node_modules')
    ],
      extensions: ['', '.js', '.svg']
  };

  let webpackPostprocessor = wallabyWebpack(webpackConfig);

  return {
    files: [
      {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
      {pattern: 'testlib/phantomPolyfill.js', instrument: false},
      {pattern: 'node_modules/babel-core/browser-polyfill.js', instrument: false}, // seen in this issue: https://github.com/wallabyjs/public/issues/109 -- https://babeljs.io/docs/learn-es2015/#map-set-weak-map-weak-set
      {pattern: 'testlib/Blob.js', instrument: false},
      {pattern: 'src/**/*.scss', instrument: false, load: false},
      {pattern: 'src/**/*.js', load: false},
      {pattern: 'src/**/*.test.js', ignore: true},
      {pattern: 'src/**/*.svg', load: false}
    ],

    tests: [
      {pattern: 'src/**/*.test.js', load: false}
    ],

    postprocessor: webpackPostprocessor,

    bootstrap: function() {
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    },

    testFramework: 'mocha@2.2.4',

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  };
};
