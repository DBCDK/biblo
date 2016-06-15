
var hooks = function() {
  this.After(function(scenario) {
    this.browser.quit();
  });
};

module.exports = hooks;
