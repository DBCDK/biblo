
require('babel-register')();
const path = require('path');
const crypto = require('crypto');

let SC;

function hooks() {
  this.registerHandler('BeforeFeatures', (ev, cb) => {
    // Start socketcluster and listen for when it's ready.
    SC = require('../../../src/scaling.js')({
      workers: 1,
      brokers: 1,
      initController: path.join(__dirname, 'mockingInitController.js'),
      logLevel: 1,
      rebootWorkerOnCrash: false
    });
    SC.on('ready', cb);
  });

  this.registerHandler('AfterFeatures', (ev, cb) => {
    // give the mocks a chance to write.
    SC.sendToWorker(0, {event: 'shutDown'});

    setTimeout(() => {
      // Clean up everything before exiting.
      if (SC) {
        SC.killWorkers();
        SC.killBrokers();
      }

      cb();
    }, 500);
  });

  this.Before(function (scenario) {
    return new Promise((resolve, reject) => {
      // const cancelTimeout = setTimeout(reject, 2000); // Abort after two seconds
      const pathhash = crypto
        .createHash('md5')
        .update(`${scenario.getUri()}:${scenario.getLine()}`)
        .digest('hex');

      function mockWasLoadedListener(workerId, message) {
        if (message === `mockWasLoaded-${pathhash}`) {
          // clearTimeout(cancelTimeout);
          SC.removeListener('workerMessage', mockWasLoadedListener);
          resolve(message);
        }
        else if (message === 'creatingNewMock') {
          resolve(message);
        }
        else if (message === 'mockWasCreated') {
          // SC.removeListener('workerMessage', mockWasLoadedListener);
        }
      }

      SC.on('workerMessage', mockWasLoadedListener);
      SC.sendToWorker(0, {event: 'loadMock', mockName: pathhash});
    });
  });

  this.After(function () { // Use function instead of arrow to get correct scope.
    // Close browser after scenario
    return this.browser.quit();
  });
};

module.exports = hooks;
