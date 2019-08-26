#!/usr/bin/env node

/**
 * A script which closes all groups in community service
 */
const superagent = require('superagent');
const moment = require('moment');

const csEndPointIndex = process.argv.indexOf('--cs-endpoint');
const csEndPoint = process.argv[csEndPointIndex + 1];

if (csEndPointIndex === -1) {
  console.log('Missing some argument. Need value for --cs-endpoint');
  process.exit(1);
}

const doWork = async () => {
  const timeClosed = moment().format('YYYY-MM-DD');

  (await superagent.get(`${csEndPoint}/api/Groups`)).body
    .filter(group => !group.timeClosed)
    .forEach(async group => {
      console.log('closing group', group.id);
      await superagent.put(`${csEndPoint}/api/Groups/${group.id}`).send({
        timeClosed
      });
    });

  console.log('Done!');
};

doWork();
