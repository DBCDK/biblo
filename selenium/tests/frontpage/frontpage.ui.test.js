var assert = require('assert');
var expect = require('expect');

export function frontPageTests({driverCaps, webdriver, BASE_URL, driverTimeout}) {
  describe('Front Page tests', function() {
    var driver;

    beforeEach(() => {
      driver = driverCaps.build();
    });

    afterEach(() => {
      driver.quit();
    });

    it('Frontpage is reachable', (done) => {
      var endpoint = '/';
      driver.get(BASE_URL + endpoint);
      driver.wait(webdriver.until.elementIsVisible(driver.findElement({tagName: 'body'})), driverTimeout);
      var body = driver.findElement({tagName: 'body'});
      var header = body.findElement({tagName: 'h2'});

      header.getText().then((text) => {
        assert.equal(text, 'Velkommen til biblo.dk');
        done();
      });
    });

    it('Cookie warning is shown, and functions', (done) => {
      driver.get(BASE_URL + '/');
      driver
        .findElement({className: 'modal-window--window'})
        .getText()
        .then((modalWindowText) => {
          expect(modalWindowText).toContain('For at gøre siden så let at bruge som muligt gemmer vi det du laver på sitet i noget, der hedder en cookie.');
          done();
        });
    });
  });
}
