'use strict';

require("babel-register");
var glob = require('glob');
var config = require('./saucelabs.config');
var webdriver = require('selenium-webdriver');

var isSauceLabsTest = false;
var sauceLabsCaps = config.saucelabs.browserCaps;

var SAUCE_URL = 'http://ondemand.saucelabs.com:80/wd/hub';
var BASE_URL = isSauceLabsTest ? 'https://biblo.demo.dbc.dk' : process.env.SELENIUM_URL || 'http://localhost:8080'; // eslint-disable-line
var driverTimeout = process.env.DRIVER_TIMEOUT || 10000; // eslint-disable-line no-process-env
driverTimeout = parseInt(driverTimeout, 10);

function runAllTests(driverCaps) {
  glob.sync('**/*.ui.test.js', {cwd: __dirname}).forEach((file) => {
    let currentTest = require(`${__dirname}/${file}`);
    Object.keys(currentTest).forEach((testName) => {
      currentTest[testName]({
        driverCaps,
        webdriver,
        BASE_URL,
        driverTimeout
      });
    })
  });
}

if (isSauceLabsTest) {
  for (var k in sauceLabsCaps) {
    if (sauceLabsCaps.hasOwnProperty(k)) {
      var caps = sauceLabsCaps[k];
      caps.username = config.saucelabs.username;
      caps.accessKey = config.saucelabs.accessKey;
      var sauceDriverCaps = new webdriver.Builder().
        usingServer(SAUCE_URL).
        withCapabilities(caps);

      runAllTests(sauceDriverCaps);
    }
  }
}
else {
  var chromeCaps = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome());

  runAllTests(chromeCaps);
}
