/**
 * @file
 * Fetches opening hours from external source
 */

import {log} from 'dbc-node-logger';
import request from 'superagent';
const openingHoursUrl = process.env.OPENING_HOURS_URL; // eslint-disable-line no-process-env

const TTL_SECONDS = 60 * 5;
let openingHours = {
  opensAtHour: 9,
  closesAtHour: 21,
  closedDays: []
};

let openingHoursFetched = 0;
function validate(res) {
  return (
    typeof res.opensAtHour === 'number' &&
    typeof res.closesAtHour === 'number' &&
    Array.isArray(res.closedDays)
  );
}
export default async function openingHoursMiddleware(req, res, next) {
  try {
    const now = Math.floor(Date.now() / 1000);
    if (now - openingHoursFetched > TTL_SECONDS) {
      log.info('Fetching opening hours', {openingHoursUrl});
      const openingHoursRes = JSON.parse(
        (await request.get(openingHoursUrl)).text
      );
      if (validate(openingHoursRes)) {
        openingHours = openingHoursRes;
        openingHoursFetched = Math.floor(Date.now() / 1000);
      } else {
        log.error('Validation of opening hours failed', {openingHoursUrl});
      }
    }
  } catch (e) {
    log.error('Could not fetch opening hours', {openingHoursUrl});
  }

  res.locals.openingHours = JSON.stringify(openingHours);
  next();
}
