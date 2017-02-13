import webdriver, {By, until} from 'selenium-webdriver';
import fs from 'fs';
import * as path from 'path';

const driverTimeout = 2000;

function postToPreview(widgetConfig) {
  const callback = arguments[arguments.length - 1];

  const f = document.createElement('form');
  f.setAttribute('method', 'post');
  f.setAttribute('action', '/preview');

  const i = document.createElement('input');
  i.setAttribute('type', 'hidden');
  i.setAttribute('name', 'widgets');
  i.setAttribute('value', widgetConfig);
  f.appendChild(i);

  document.body.appendChild(f);

  callback();
  f.submit();
}

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

  this.present = selector => {
    return this.$(selector).then(result => {
      return !!result;
    }).catch(() => {
      return false;
    });
  };

  this.setViewportWidth = ({device = null, width = 1024, height = 768}) => {
    if (device) {
      switch (device) { // eslint-disable-line default-case
        case 'phone': {
          width = 400;
          height = 768;
          break;
        }
        case 'tablet': {
          width = 600;
          height = 768;
          break;
        }
        case 'desktop': {
          width = 800;
          height = 768;
          break;
        }
      }
    }

    this.browser.manage().window().setSize(width, height);
  };

  this.takeScreenshot = (filename) => {
    const _filename = path.join('./selenium/features', `/${filename}`);
    return this.browser.takeScreenshot().then(function(data) {
      fs.writeFile(_filename, data.replace(/^data:image\/png;base64,/, ''), 'base64', function(err) {
        if (err) {
          throw err;
        }
      });
    });
  };

  this.previewWidget = widgetConfig => {
    return this.browser.executeAsyncScript(postToPreview, widgetConfig);
  };
}

module.exports = function() {
  this.World = World;
};
