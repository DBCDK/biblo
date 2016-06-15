'use strict';

module.exports = function() {
  this.Given(/^at en vilkårlig bruger besøger forsiden på biblo\.dk$/, function(callback) {
    this.browser.get('http://biblo.dk')
      .then(() => {
        callback();
      });
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
};
