var expect = require('chai').expect;
var assert = require('chai').assert;
var config = require('@dbcdk/biblo-config').config;
var crypto = require('crypto');
import {By, Key} from 'selenium-webdriver';

var BASE_URL = process.env.SELENIUM_URL || `http://localhost:${config.get('Biblo.port')}`; // eslint-disable-line
// no-process-env

var myStepDefinitionsWrapper = function() {
  this.Given(/^a user visits the frontpage$/i, function(callback) {
    this.browser.get(BASE_URL)
      .then(() => {
        callback();
      });
  });

  this.Given(/^a user visits material ([\d-]+[a-z]+:\d+)$/i, function(pid) {
    return this.browser.get(`${BASE_URL}/materiale/${pid}`);
  });

  this.Given(/^a user visits the reviews page with review_id (\d+)$/, function(review_id) {
    return this.browser.get(`${BASE_URL}/anmeldelse/${review_id}`);
  });

  this.Given(/^a user visits the peterpedal page$/, function(callback) {
    this.browser.get(`${BASE_URL}/materiale/870970-basis:05074975`)
      .then(() => {
        callback();
      });
  });

  this.Given(/^a user visits the tintin page$/, function(callback) {
    this.browser.get(`${BASE_URL}/materiale/870970-basis:29693544`)
      .then(() => {
        callback();
      });
  });

  this.Given(/^a user visits the krigerkattene page$/, function(callback) {
    this.browser.get(`${BASE_URL}/materiale/870970-basis:29283893`)
      .then(() => {
        callback();
      });
  });

  this.Given(/^a user visits the LegoIndianaJones page$/, function(callback) {
    this.browser.get(`${BASE_URL}/materiale/870970-basis:29186626`)
      .then(() => {
        callback();
      });
  });

  this.Given(/^a user visits the LegoBatmanMovie page$/, function(callback) {
    this.browser.get(`${BASE_URL}/materiale/870970-basis:29992487`)
      .then(() => {
        callback();
      });
  });

  this.Given(/^the cookiewarning has been closed$/i, function() {
    return this.click('.cookie-warning > .rounded-button');
  });

  this.Given(/^a user uses a phone$/, function(callback) {
    this.setViewportWidth({device: 'phone'});
    callback();
  });

  this.Given(/^a user visits the review explorer page$/, function(callback) {
    this.browser.get(`${BASE_URL}/anmeldelser`)
      .then(() => {
        callback();
      });
  });

  this.Given(/^a user visits the review explorer page showing bibelhistorier$/, function(callback) {
    this.browser.get(`${BASE_URL}/anmeldelser?genre=bibelhistorier`)
      .then(() => {
        callback();
      });
  });

  this.Then(/^pagetitle should be Biblo$/i, function(callback) {
    this.browser.getTitle()
      .then((title) => {
        if (title === 'Biblo') {
          callback();
        }
        else {
          callback(new Error('Expected to be on page with title Biblo'));
        }
      });
  });

  this.Then(/^the user can log in/i, function(callback) {
    const uniloginSecret = config.get('UNILogin.secret');
    const date = new Date();
    const timestamp = `${date.getFullYear()}${date.getMonth() + 1}${date.getUTCDate()}${date.getUTCHours() + 1}${date.getUTCMinutes()}${date.getSeconds()}`;
    const ltoken = 'ac8b69252151a7f42e898a54257f935ea80611a6';
    const user = 'bobby_hansen';
    const auth = crypto
      .createHash('md5')
      .update(timestamp + uniloginSecret + user)
      .digest('hex');

    const url = `${BASE_URL}/login?auth=${auth}&timestamp=${timestamp}&user=${user}&ltoken=${ltoken}`;

    this.browser.get(url);
    this.browser.findElement({tagName: 'body'}).then((bodyElement) => {
      bodyElement.getText().then((text) => {
        expect(text).to.contain('Opret Profil');
        callback();
      });
    });
  });

  this.Then(/^the user can log out/i, function() {
    return this.click('.profile-image--icon').then(() => {
      return new Promise(resolve => {
        // Wait for the animation to finish!
        setTimeout(resolve, 400);
      });
    }).then(() => {
      return this.click('.log-out-button');
    }).then(() => {
      this.$('#JSONDATA_USER_PROFILE').then((bodyElement) => {
        return bodyElement.getAttribute('innerHTML');
      }).then(jsonData => {
        const userProfile = JSON.parse(jsonData);
        assert.isFalse(userProfile.profile.userIsLoggedIn);
      });
    });
  });

  this.Then(/^page is not error page$/i, function() {
    return this.browser.getTitle().then(title => {
      expect(title).to.not.contain('Fejl');
    });
  });

  this.Then(/^'Det Sker' menu item should not be visible$/, function() {
    return this.browser.findElement(By.className('navbar-mobile-menu is-active menu')).then((menu) => {
      menu.getText().then((text) => {
        assert.notInclude(text, 'DET SKER');
      });
    });
  });

  this.Then(/^a cookiewarning should be shown$/, function() {
    return this.present('.cookie-warning').then(isPresent => {
      assert.isTrue(isPresent);
    });
  });

  this.Then(/^the cookiewarning should not be displayed$/, function() {
    return this.present('.cookie-warning').then(isPresent => {
      assert.isFalse(isPresent);
    });
  });

  this.Then(/^text on loan button should be ([a-zæøåA-ZÆØÅ. -]+)/, function(buttonText) {
    return this.browser.findElement(By.className('button-text')).then((element) => {
      element.getText().then((text) => {
        assert.strictEqual(text, buttonText);
      });
    });
  });

  this.When(/^mock ([a-zA-Z-]+) is loaded (\d+) times$/i, function(mockName, times) {
    return this.loadMock(mockName, times);
  });

  this.When(/^mock ([a-zA-Z\-_]+) is loaded$/i, function(mockName) {
    return this.loadMock(mockName);
  });

  this.When(/^the user clicks the menu$/, function() {
    return this.click('.navbar--toggle').then(() => {
      return new Promise(resolve => {
        // Wait for the animation to finish!
        setTimeout(resolve, 400);
      });
    });
  });

  this.Given(/^PreviewPage is loaded with widgetConfig: (.*)$/, function(widgetConfig) {
    return this.previewWidget(widgetConfig);
  });

  this.Then(/^Take a screenshot with filename: (.*)$/i, function(filename) {
    return this.takeScreenshot(filename);
  });

  this.Then(/^wait (\d+) ms$/i, function(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  });

  this.Then(/^the page contains: (.*)$/i, function(contained) {
    return this.browser.findElement({tagName: 'body'})
      .then(bodyElement => bodyElement.getText())
      .then(bodyText => expect(bodyText).to.contain(contained));
  });

  this.Then(/^the page does not contain: (.*)$/i, function(contained) {
    return this.browser.findElement({tagName: 'body'})
      .then(bodyElement => bodyElement.getText())
      .then(bodyText => expect(bodyText).to.not.contain(contained));
  });

  this.When(/^a user visits the aboutpage$/, function() {
    return this.browser.get(`${BASE_URL}/indhold/om-biblo`);
  });

  this.When(/^a user visits group (\d+)$/, function(groupId) {
    return this.browser.get(`${BASE_URL}/grupper/${groupId}`);
  });

  this.Then(/^the page contains a post with a campaign logo$/, function() {
    return this.$('.post--campaign--logo > span > img')
      .then(logo => logo.getAttribute('src'))
      .then(src => expect(src).to.contain('/sommerbogen-logo.svg'));
  });

  this.Then(/^the MoreInfo box should be present$/, function() {
    return this.$('.work--moreinfo > .more-info > .more-info--header')
      .then(header => header.getText())
      .then(headerText => assert.equal(headerText, 'Mere info'));
  });

  this.Then(/^when I click the (.*) selector$/, function(selector) {
    return this.click(`.${selector}`);
  });

  this.Then(/^the (.*) selector should count (\d+) elements$/, function(selector, elements) {
    return this.browser.findElements(By.css(`.${selector}`))
      .then(found => {
        return assert.equal(found.length, elements);
      });
  });

  this.Then(/^the (.*) selector should contain the following items$/, function(selector, data) {
    const items = data.raw()[0];
    return this.$('.' + selector)
      .then(element => element.getText())
      .then(text => {
        return items.forEach((item) => {
          assert.include(text, item);
        });
      });
  });

  this.Then(/^the (.*) selector should not contain the following items$/, function(selector, data) {
    const items = data.raw()[0];
    return this.$('.' + selector)
      .then(element => element.getText())
      .then(text => {
        return items.forEach((item) => {
          assert.notInclude(text, item);
        });
      });
  });

  this.Then(/^the (.+) should be visible$/, function(selector) {
    return this.present(selector).then(isPresent => assert.isTrue(isPresent));
  });

  this.Then(/^the (.+) should not be visible$/, function(selector) {
    return this.present(selector).then(isPresent => assert.isFalse(isPresent));
  });

  this.When(/^the page is scrolled (\d+) times$/, function(times) {
    times = parseInt(times, 10);
    const keys = Array(times * 2).fill(1).map((i, idx) => (idx % 2 === 0) ? Key.PAGE_DOWN : Key.NULL);
    return this.$('body').sendKeys(...keys);
  });

  this.Given(/^A user visits review (\d+)$/i, function(reviewId) {
    return this.browser.get(`${BASE_URL}/anmeldelse/${reviewId}`);
  });

  this.Then(/^the highlight header contains (.+)$/, function(contained) {
    return this.$('.highlight-section > .review-list--header').getText().then(text => assert.equal(contained, text));
  });
};

module.exports = myStepDefinitionsWrapper;
