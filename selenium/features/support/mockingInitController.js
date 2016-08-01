/**
 * @file: In this file we bootstrap the processes created by socketcluster, this is to use nock.
 */

// Require the other init controller so the workers are correctly bootstrapped
require('../../../src/init.js');

// Libraries
const nock = require('nock');
const fs = require('fs');
const urlParse = require('url').parse;
const querystringParser = require('querystring').parse;

// This regex is used to inject the times parameter into the generated nock code.
const autogeneratedNockModifierRegex = /(post|get)(\(.+\))(\n  \.)/gi;

module.exports.run = function(proc) {

  // Only workers communicate with the external APIs
  if (proc.type === 'worker') {

    // We listen for messages from the master process (IE. where socketcluster was started)-
    proc.on('masterMessage', (message) => {

      // We only want to listen for events we recognize, that have correct parameters sent with it.
      if (message && message.event === 'loadMock' && message.mockName && message.times) {
        // Where to look for the mock required by the current test.
        const mockPath = `${__dirname}/../../__mocks__/${message.mockName}.mock.js`;

        try {
          // Next we run the mock to place interceptors on all the required HTTP calls.
          const mockRunnner = require(mockPath);
          mockRunnner(message.times);
        }
        catch (er) {
          // If we've reached the catch, it means no mock was found, so we create it.
          console.log('Creating mock for:', message.mockName);

          function censorResponseObject (response) {
            for (const k in response) {
              if (k === 'owner') {
                response[k] = {};
              }
              else if (typeof response[k] === 'object' && response[k] !== null) {
                censorResponseObject(response[k]);
              }
            }

            return response;
          }

          // We want to listen for the next loadMock, as it's run once the previous scenario is complete.
          // This function doesn't get called until the recording is complete.
          function loadMockListener(msg) {
            if (msg === 'scenarioDidFinish') {
              // We want to extract the code required to mock the calls we just recorded.
              const nockObject = nock.recorder.play().map(reqres => {
                const url = urlParse(reqres.scope + reqres.path, true);

                const censoredResponse = censorResponseObject(reqres.response);

                return `
                nock('${reqres.scope}', {encodedQueryParams: true})
                  .${reqres.method.toLowerCase()}('${url.pathname}')
                  .times(times)
                  ${Object.keys(url.query).length > 0 ? `.query(${JSON.stringify(url.query)})` : ''}
                  .reply(${reqres.status}, ${JSON.stringify(censoredResponse)});`;
              });

              // We want to remove the listener after it's been called to prevent any more calls.
              proc.removeListener('masterMessage', loadMockListener);

              // We now generate the contents of the mock file and write it to disc.
              const mockFileContents = `// Autogenerated!\n/* eslint-disable */\nconst nock = require('nock'); \nmodule.exports = function ${message.mockName} (times) {${nockObject.join('\n')}};\n`;
              fs.writeFile(mockPath, mockFileContents, (err) => console.log(err ? `File was not written! ${err}` : 'Mock was created!'));
            }
          }

          // Here we set up the listener to signal the current scenario is complete.
          proc.on('masterMessage', loadMockListener);

          // And finally we setup the recorder
          // If the recorder has already been setup (even if it's been cleared), it'll throw and error, but start recording.
          // It's advisable only to record one mock file at a time to prevent issues with this.
          try {
            nock.recorder.rec({
              dont_print: true,
              output_objects: true
            });
          }
          catch(e) {}
        }

        // Now we signal the master process, that we're done loading the mocks, so it can begin the scenario.
        setTimeout(() => proc.sendToMaster(`mockWasLoaded-${message.mockName}`), 10);
      }
      else if (message === 'cleanMocks') {
        try {
          nock.enableNetConnect();
          nock.cleanAll();
          nock.recorder.clear();
        }
        catch (e) {}
        finally {
          proc.sendToMaster('mocksWereCleaned');
        }
      }
      else if (message === 'disableNetConnect') {
        nock.disableNetConnect();
        nock.enableNetConnect(`127.0.0.1:${process.env.PORT}`);
        proc.sendToMaster('netConnectDisabled');
      }
    });
  }
};
