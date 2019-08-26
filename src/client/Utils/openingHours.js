/**
 * @file Write a short description here.
 */
import moment from 'moment';

let openingHours = {
  opensAtHour: 9,
  closesAtHour: 21,
  closedDays: ['']
};
try {
  openingHours = JSON.parse(document.getElementById('OPENING_HOURS').innerHTML);
} catch (e) {
  console.error('could not parse opening hours');
}

export default function isSiteOpen() {
  const {opensAtHour, closesAtHour, closedDays} = openingHours;
  const hour = new Date().getHours();
  const date = moment().format('DD-MM-YYYY');
  if (closedDays.includes(date)) {
    return false;
  }
  return hour >= opensAtHour && hour < closesAtHour;
}
