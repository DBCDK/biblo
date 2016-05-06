'use strict';

var config = require('./saucelabs.config');
var assert = require('assert');
var expect = require('expect');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var bibloconfig = require('@dbcdk/biblo-config');
var crypto = require('crypto');

var isSauceLabsTest = false;
var sauceLabsCaps = config.saucelabs.browserCaps;

var SAUCE_URL = 'http://ondemand.saucelabs.com:80/wd/hub';
var DBC_URLS = ['http://uxwin7-01:4444/wd/hub', 'http://uxwin81-01:4444/wd/hub', 'http://uxwin10-01:5432/wd/hub'];
var BASE_URL = isSauceLabsTest ? 'https://biblo.demo.dbc.dk' : process.env.SELENIUM_URL || 'http://localhost:8080'; // eslint-disable-line
var driverTimeout = process.env.DRIVER_TIMEOUT || 10000; // eslint-disable-line no-process-env
driverTimeout = parseInt(driverTimeout, 10);

function runAllTests(driverCaps) {
  test.describe('Express endpoint', () => {
    var driver;

    beforeEach(() => {
      driver = driverCaps.build();
    });

    afterEach(() => {
      driver.quit();
    });

    test.it('Frontpage is reachable', () => {
      var endpoint = '/';
      driver.get(BASE_URL + endpoint);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'body'})), driverTimeout);
      var body = driver.findElement({tagName: 'body'});
      var header = body.findElement({tagName: 'h2'});

      header.getText().then((text) => {
        assert.equal(text, 'VELKOMMEN TIL BIBLO');
      });
    });

    test.it('Test a user can login', () => {
      var uniloginSecret = bibloconfig.biblo.getConfig().unilogin.secret;
      var date = new Date();
      var timestamp = `${date.getFullYear()}${date.getMonth()+1}${date.getUTCDate()}${date.getUTCHours()+1}${date.getUTCMinutes()}${date.getSeconds()}`;
      var user = 'bobby_hansen';
      var auth = crypto
        .createHash('md5')
        .update(timestamp + uniloginSecret + user)
        .digest('hex');
      var ltoken = 'ac8b69252151a7f42e898a54257f935ea80611a6';
      var url = `${BASE_URL}/login?auth=${auth}&timestamp=${timestamp}&user=${user}&ltoken=${ltoken}`;

      driver.get(url);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'body'})), driverTimeout);
      var body = driver.findElement({tagName: 'body'});
      body.getText().then((text) => {
        expect(text).toContain('Opret Profil');
      });
    });
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
else if (process.env.JENKINS_TESTING || false) { // eslint-disable-line
  var driver = new webdriver.Builder()
    .forBrowser(process.env.SELENIUM_BROWSER_NAME || 'internet explorer') // eslint-disable-line
    .usingServer(process.env.SELENIUM_TEST_SERVER || DBC_URLS[1]); // eslint-disable-line

  runAllTests(driver);
}
else {
  var chromeCaps = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome());

  runAllTests(chromeCaps);
}
