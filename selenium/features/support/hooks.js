
require('babel-register')();
const path = require('path');

let SocketCluster;

/**
 * dispatches a message to a worker, and awaits a responding message.
 * @param {String || PlainObject} requestEvent
 * @param {String} responseEvent
 * @param {Number} timeout
 * @returns {Promise}
 */
function askSocketClusterWithTimeout(requestEvent, responseEvent, timeout) {
  // First we want to check that everything is defined
  if (!requestEvent || !responseEvent || !SocketCluster) {
    return Promise.reject('Missing properties.');
  }

  // We return a promise and let cucumber handle it.
  return new Promise((resolve, reject) => {
    // Enable timeout, default timeout is 2 seconds
    timeout = timeout || 5000;
    const cancelTimeout = setTimeout(reject, timeout);

    /**
     * This is a generic listener for SocketCluster events
     * @param {Int} worker
     * @param {String || PlainObject} message
     */
    function listenForSocketClusterResponseEvent(worker, message) {
      // Only respond to the event we want.
      if (message === responseEvent) {
        // We got a response within the timeout, so just clear it.
        clearTimeout(cancelTimeout);

        // Remove the listener to prevent method firing after we are interested in it.
        SocketCluster.removeListener('workerMessage', listenForSocketClusterResponseEvent);

        // Resolve the function, the event has been correctly handled.
        resolve(responseEvent);
      }
    }

    // Start listening for the response
    SocketCluster.on('workerMessage', listenForSocketClusterResponseEvent);

    // Send a request to the worker.
    SocketCluster.sendToWorker(0, requestEvent);
  });
}

function hooks() {
  this.registerHandler('BeforeFeatures', (ev, cb) => {
    // Start socketcluster and listen for when it's ready.
    SocketCluster = require('../../../src/scaling.js')({
      initController: path.join(__dirname, 'mockingInitController.js'),
      workers: 1,
      brokers: 1,
      logLevel: process.env.SC_LOGLEVEL || 1, // eslint-disable-line no-process-env
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

  this.Before(function () {
    /**
     * cleanMocks removes all interceptors and resets recording.
     */
    this.cleanMocks = () => askSocketClusterWithTimeout('cleanMocks', 'mocksWereCleaned');

    /**
     * disableNetConnect instruct nock to disable all net connections.
     */
    this.disableNetConnect = () => askSocketClusterWithTimeout('disableNetConnect', 'netConnectDisabled');

    /**
     * loadMock loads a mock by name.
     * @param mockName
     */
    this.loadMock = (mockName, times = 1) => askSocketClusterWithTimeout({event: 'loadMock', mockName: mockName, times}, `mockWasLoaded-${mockName}`);

    // We start every scenario by cleaning any interceptors.
    return this.disableNetConnect();
  });

  this.After(function () { // Use function instead of arrow to get correct scope.
    // Tell socketcluster our scenario finished
    SocketCluster.sendToWorker(0, 'scenarioDidFinish');

    // Close browser after scenario
    return Promise.all([this.browser.quit(), this.cleanMocks()]);
  });
}

module.exports = hooks;
