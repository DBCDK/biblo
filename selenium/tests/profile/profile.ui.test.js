var expect = require('expect');
var bibloconfig = require('@dbcdk/biblo-config');
var crypto = require('crypto');

export function frontPageTests({driverCaps, webdriver, BASE_URL, driverTimeout}) {
  describe('Test profiles', function() {
    var driver;

    beforeEach(() => {
      driver = driverCaps.build();
    });

    afterEach(() => {
      driver.quit();
    });

    it('Test a user can login', (done) => {
      var uniloginSecret = bibloconfig.biblo.getConfig().unilogin.secret;
      var date = new Date();
      var timestamp = `${date.getFullYear()}${date.getMonth()+1}${date.getUTCDate()}${date.getUTCHours()+1}${date.getUTCMinutes()}${date.getSeconds()}`;
      var user = 'bobby_hansen';
      var auth = crypto
        .createHash('md5')
        .update(timestamp + uniloginSecret + user)
        .digest('hex');
      var ltoken = 'ac8b69252151a7f42e898a54257f935ea80611a6';
      var url = `${BASE_URL}/login?auth=${auth}&timestamp=${timestamp}&user=${user}&ltoken=${ltoken}`;

      driver.get(url);
      driver.findElement({tagName: 'body'}).then((bodyElement) => {
        bodyElement.getText().then((text) => {
          expect(text).toContain('Opret Profil');
          done();
        });
      });
    });
  });
}
