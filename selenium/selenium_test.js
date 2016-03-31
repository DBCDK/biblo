'use strict';
let config = require('./saucelabs.config');
let assert = require('assert');
let expect = require('expect');
let test = require('selenium-webdriver/testing');
let webdriver = require('selenium-webdriver');
let bibloconfig = require('@dbcdk/biblo-config');
let crypto = require('crypto');

let isSauceLabsTest = false;
let sauceLabsCaps = config.saucelabs.browserCaps;

let SAUCE_URL = 'http://ondemand.saucelabs.com:80/wd/hub';
let DBC_URLS = ['http://uxwin7-01:4444/wd/hub', 'http://uxwin81-01:4444/wd/hub', 'http://uxwin10-01:5432/wd/hub'];
let BASE_URL = isSauceLabsTest ? 'https://biblo.demo.dbc.dk' : process.env.SELENIUM_URL || 'http://localhost:8080'; // eslint-disable-line
let driverTimeout = process.env.DRIVER_TIMEOUT || 10000; // eslint-disable-line no-process-env
driverTimeout = parseInt(driverTimeout, 10);

function runAllTests(driverCaps) {
  test.describe('Express endpoint', () => {
    let driver;

    beforeEach(() => {
      driver = driverCaps.build();
    });

    afterEach(() => {
      driver.quit();
    });

    test.it('Frontpage is reachable', () => {
      let endpoint = '/';
      driver.get(BASE_URL + endpoint);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'body'})), driverTimeout);
      const body = driver.findElement({tagName: 'body'});
      const header = body.findElement({tagName: 'h2'});

      header.getText().then((text) => {
        assert.equal(text, 'VELKOMMEN TIL BIBLO');
      });
    });

    test.it('Test a user can login', () => {
      const uniloginSecret = bibloconfig.biblo.getConfig().unilogin.secret;
      let date = new Date();
      let timestamp = `${date.getFullYear()}${date.getMonth()+1}${date.getUTCDate()}${date.getUTCHours()+1}${date.getUTCMinutes()}${date.getSeconds()}`;
      let user = 'bobby_hansen';
      let auth = crypto
        .createHash('md5')
        .update(timestamp + uniloginSecret + user)
        .digest('hex');
      let ltoken = 'ac8b69252151a7f42e898a54257f935ea80611a6';
      let url = `${BASE_URL}/login?auth=${auth}&timestamp=${timestamp}&user=${user}&ltoken=${ltoken}`;

      driver.get(url);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'body'})), driverTimeout);
      const body = driver.findElement({tagName: 'body'});
      body.getText().then((text) => {
        expect(text).toContain('Redigér Profil');
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
