'use strict';

var expect = require('expect');
var bibloconfig = require('@dbcdk/biblo-config');
var crypto = require('crypto');

var BASE_URL = process.env.SELENIUM_URL || `http://localhost:${process.env.PORT || 8080}`;

module.exports = function() {
  this.Given(/^at en vilkårlig bruger besøger forsiden på biblo\.dk|a user visits the frontpage$/, function(callback) {
    this.browser.get(BASE_URL)
      .then(() => {
        callback();
      });
  });

  this.Given(/^the cookiewarning has been closed$/, function () {
    return this.click('.cookie-warning > .rounded-button');
  });

  this.Then(/^skal pagetitel være Biblo$/, function(callback) {
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

  this.Then(/^the user can log in/, function (callback) {
    const uniloginSecret = bibloconfig.biblo.getConfig().unilogin.secret;
    const date = new Date();
    const timestamp = `${date.getFullYear()}${date.getMonth()+1}${date.getUTCDate()}${date.getUTCHours()+1}${date.getUTCMinutes()}${date.getSeconds()}`;
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
        expect(text).toContain('Opret Profil');
        callback();
      });
    });
  });

  this.Then(/^the user can log out/, function () {
    return this.click('.profile-image--icon').then(() => {
      return new Promise(resolve => {
        // Wait for the animation to finish!
        setTimeout(resolve, 400);
      });
    }).then(() => {
      return this.click('.log-out-button');
    }).then(() => {
      this.$('#JSONDATA_USER_PROFILE').then((bodyElement) => {
        return bodyElement.getInnerHtml();
      }).then(jsonData => {
        const userProfile = JSON.parse(jsonData);
        expect(userProfile.profile.userIsLoggedIn).toNotExist();
      });
    });
  });

  this.Then(/^page is not error page$/, function () {
    return this.browser.getTitle().then(title => {
      expect(title).toNotContain('Fejl');
    });
  });

  this.When(/^mock ([a-zA-Z\-]+) is loaded$/, function (mockName) {
    return this.loadMock(mockName);
  });
};
