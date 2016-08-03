/**
 * @file
 * Bootstraps the server and initialized babel, so all JSX and ES6 is transpiled
 *
 */

const config = require('@dbcdk/biblo-config').config;

if (config.get('NewRelic.enabled')) {
  require('newrelic');
}

require('babel-register')();
require('./scaling')();
