/**
 * @file: In this file we bootstrap the processes created by socketcluster, this is to use nock.
 */

// Require the other init controller so the workers are correctly bootstrapped
require('../../../src/init.js');

// Libraries
const nock = require('nock');
const fs = require('fs');

module.exports.run = function(proc) {

  // Only workers communicate with the external APIs
  if (proc.type === 'worker') {

    // We listen for messages from the master process (IE. where socketcluster was started)-
    proc.on('masterMessage', (message) => {

      // We only want to listen for events we recognize, that have correct parameters sent with it.
      if (message && message.event === 'loadMock' && message.mockName) {
        // Where to look for the mock required by the current test.
        const mockPath = `${__dirname}/../../__mocks__/${message.mockName}.mock.js`;

        try {
          // First we clean any existing interceptors to ensure we only get the data we want.
          nock.cleanAll();

          // Next we run the mock to place interceptors on all the required HTTP calls.
          const mockRunnner = require(mockPath);
          mockRunnner();
        }
        catch (er) {
          // If we've reached the catch, it means no mock was found, so we create it.
          console.log('Creating mock for:', message.mockName);

          // We want to listen for the next loadMock, as it's run once the previous scenario is complete.
          // This function doesn't get called until the recording is complete.
          function loadMockListener(msg) {
            // We want to extract the code required to mock the calls we just recorded.
            const nockObject = nock.recorder.play();

            // We clear the recorder so any future recordings aren't contaminated by the current run.
            nock.recorder.clear();

            // And we restore nock (ie. stop letting http requests through, and start using the interceptors we set).
            nock.restore();

            // We want to remove the listener after it's been called to prevent any more calls.
            proc.removeListener('masterMessage', loadMockListener);

            // We now generate the contents of the mock file and write it to disc.
            const mockFileContents = `// Autogenerated!\nconst nock = require('nock'); module.exports = function ${message.mockName} () {${nockObject.join('  ')}};`;
            fs.writeFile(mockPath, mockFileContents, (err) => console.log(err ? `File was not written! ${err}` : 'Mock was created!'));
          }

          // Here we set up the listener to signal the current scenario is complete.
          proc.on('masterMessage', loadMockListener);

          // And finally we setup the recorder
          // If the recorder has already been setup (even if it's been cleared), it'll throw and error, but start recording.
          // It's advisable only to record one mock file at a time to prevent issues with this.
          try {
            nock.recorder.rec({
              dont_print: true
            });
          }
          catch(e) {}
        }

        // Now we signal the master process, that we're done loading the mocks, so it can begin the scenario.
        proc.sendToMaster(`mockWasLoaded-${message.mockName}`);
      }
    });
  }
};
