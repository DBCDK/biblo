var webdriver = require('selenium-webdriver');

function World() {
  this.driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome());
  this.browser = this.driver.build();
}

module.exports = function() {
  this.World = World;
};
