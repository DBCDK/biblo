/**
 * @file
 * Bootstraps the server and initialized babel, so all JSX and ES6 is transpiled
 *
 */

var config = require('@dbcdk/biblo-config').biblo; // eslint-disable-line no-process-env

if (config.getConfig({}).newrelic.enabled) {
  require('newrelic');
}

require('babel-register')();
require('./scaling')();
