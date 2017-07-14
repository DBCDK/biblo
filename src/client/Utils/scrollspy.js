/**
 * @file: Scrollspy is used when we need to know what elements are visible.
 */

import {debounce} from 'lodash';

const spies = [];
const isBrowser = typeof window !== 'undefined';

function isElementInViewport (element) {
  if (!isBrowser) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.top >= 0;
}

function onVisibilityChange(element, callback) {
  let oldVisible;
  return function() {
    const visible = isElementInViewport(element);
    if (visible !== oldVisible) {
      oldVisible = visible;
      if (typeof callback === 'function') {
        callback(visible);
      }
    }
  };
}

export function registerScrollSpy(element, callback) {
  const index = spies.push(onVisibilityChange(element, callback));
  return () => spies.slice(index, 1);
}

const handleScroll = debounce(() => spies.forEach(f => f()), 50);
if (isBrowser && window.addEventListener) {
  window.addEventListener('DOMContentLoaded', handleScroll, false);
  window.addEventListener('load', handleScroll, false);
  window.addEventListener('scroll', handleScroll, false);
  window.addEventListener('resize', handleScroll, false);
}
else if (isBrowser && window.attachEvent) {
  window.attachEvent('onDOMContentLoaded', handleScroll);
  window.attachEvent('onload', handleScroll);
  window.attachEvent('onscroll', handleScroll);
  window.attachEvent('onresize', handleScroll);
}
