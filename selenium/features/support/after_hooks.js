
require('babel-register')();
const path = require('path');
const crypto = require('crypto');

let SocketCluster;

function hooks() {
  this.registerHandler('BeforeFeatures', (ev, cb) => {
    // Start socketcluster and listen for when it's ready.
    SocketCluster = require('../../../src/scaling.js')({
      workers: 1,
      brokers: 1,
      initController: path.join(__dirname, 'mockingInitController.js'),
      logLevel: 1,
      rebootWorkerOnCrash: false
    });
    SocketCluster.on('ready', cb);
  });

  this.registerHandler('AfterFeatures', (ev, cb) => {
    // give the mocks a chance to write.
    SocketCluster.sendToWorker(0, {event: 'shutDown'});

    setTimeout(() => {
      // Clean up everything before exiting.
      if (SocketCluster) {
        SocketCluster.killWorkers();
        SocketCluster.killBrokers();
      }

      cb();
    }, 500);
  });

  this.Before(function (scenario) {
    return new Promise((resolve, reject) => {
      const cancelTimeout = setTimeout(reject, 2000); // Abort after two seconds

      // Create a unique and reproducable name for the mock.
      const pathhash = crypto
        .createHash('md5')
        .update(`${scenario.getUri()}:${scenario.getLine()}`)
        .digest('hex');

      // This is a listener function to start the scenario once the mock is loaded.
      function mockWasLoadedListener(workerId, message) {
        if (message === `mockWasLoaded-${pathhash}`) {
          // Clean up.
          clearTimeout(cancelTimeout);
          SocketCluster.removeListener('workerMessage', mockWasLoadedListener);

          // Start the show
          resolve(message);
        }
      }

      // Enable the listener
      SocketCluster.on('workerMessage', mockWasLoadedListener);

      // Signal the worker to load the mock.
      SocketCluster.sendToWorker(0, {event: 'loadMock', mockName: pathhash});
    });
  });

  this.After(function () { // Use function instead of arrow to get correct scope.
    // Close browser after scenario
    return this.browser.quit();
  });
};

module.exports = hooks;
