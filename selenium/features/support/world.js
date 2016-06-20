var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;

var driverTimeout = 2000;

function World() {
  this.driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome());
  this.browser = this.driver.build();

  this.click = selector => {
    this.browser.wait(until.elementIsVisible(this.browser.findElement(By.css(selector))), driverTimeout);
    return this.browser.findElement(By.css(selector)).click();
  }

  this.$ = selector => {
    return this.browser.findElement(By.css(selector));
  }
}

module.exports = function() {
  this.World = World;
};
