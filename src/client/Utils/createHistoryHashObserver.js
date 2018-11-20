import {debounce, has} from 'lodash';
/**
 * Anchor scroll supporting element to be loaded asynchronous
 * Adaptation of https://gist.githubusercontent.com/gajus/0bbc78135d88a02c18366f12237011a5/raw/454d693e8e2107505ba7b01201bef277de6cd037/createHistoryHashObserver.js
 */
export const asyncAnchorScroll = (timeout = 3000, debounceWait = 500) => {
  if (typeof window === 'undefined' || !window.MutationObserver || !has(document, 'location.hash')) {
    return;
  }
  const elementId = document.location.hash.replace('#', '');
  let observer;
  let timeoutId;

  const scrollToElement = () => {
    const element = document.getElementById(elementId);
    if (element) {
      // reset();
      element.scrollIntoView();
      return true;
    }
    return false;
  };
  const debouncedScrollToElement = debounce(scrollToElement, debounceWait, {
    leading: false,
    trailing: true
  });

  const reset = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (observer) {
      observer.disconnect();
    }
  };

  observer = new MutationObserver(debouncedScrollToElement);
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true
  });
  timeoutId = setTimeout(reset, timeout);
};
