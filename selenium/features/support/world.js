'use strict';

import webdriver, {By, until} from 'selenium-webdriver';

const driverTimeout = 2000;

function World() {
  this.driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome());
  this.browser = this.driver.build();

  this.$ = selector => {
    return this.browser.findElement(By.css(selector));
  };

  this.click = selector => {
    this.browser.wait(until.elementIsVisible(this.$(selector)), driverTimeout);
    return this.$(selector).click();
  };
}

module.exports = function() {
  this.World = World;
};
