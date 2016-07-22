const wallabyWebpack = require('wallaby-webpack');

const webpackConfig = require('./webpack.wallaby.config');

const babel = require('babel-core');
const path = require('path');
const fs = require('fs');

const babelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc')));
babelConfig.babel = babel;

module.exports = function(wallaby) {
  return {
    files: [
      {pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false},
      {pattern: 'testlib/phantomPolyfill.js', instrument: false},
      {pattern: 'node_modules/babel-core/browser-polyfill.js', instrument: false}, // seen in this issue: https://github.com/wallabyjs/public/issues/109 -- https://babeljs.io/docs/learn-es2015/#map-set-weak-map-weak-set
      {pattern: 'testlib/Blob.js', instrument: false},
      {pattern: 'src/**/*.scss'},
      {pattern: 'src/**/*.js', load: false},
      {pattern: 'src/**/*.test.js', ignore: true, load: false},
      {pattern: 'src/**/*.svg', load: false, instrument: false},
      {pattern: 'src/**/mocks/*.json', load: false, instrument: false}
    ],

    tests: [
      {pattern: 'src/**/*.test.js', load: false}
    ],

    postprocessor: wallabyWebpack(webpackConfig),

    compilers: {
      '**/*.js': wallaby.compilers.babel(babelConfig)
    },

    env: {
      viewportSize: {
        width: 1024
      }
    },

    testFramework: 'mocha',

    setup: function(wallaby) {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
      // See http://wallabyjs.com/docs/config/bootstrap.html
    }
  };
};
