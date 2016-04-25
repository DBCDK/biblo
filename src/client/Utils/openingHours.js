'use strict';

/**
 * @file Write a short description here.
 */

export default function isSiteOpen() {
  // check if site is open (09:00 - 21:00)
  const opensAtHour = 9;
  const closesAtHour = 14;
  const hour = (new Date()).getHours();
  const isSiteOpen = hour >= opensAtHour && hour < closesAtHour;
  return isSiteOpen;
}
