/**
 * Checks if the window global is set and newrelic is present.
 *
 * @return {boolean}
 */
function newrelicIsPresent() {
  return (typeof window !== 'undefined' && !!window.newrelic); // eslint-disable-line no-undef
}

/**
 * Logs pageAction to newrelic if newrelic is present in DOM
 * @see https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-apis/report-data-events-browser-agent-api#addpageaction
 *
 * @param {string} event
 * @param {Object} params
 */
export function addPageAction(event, params) {
  if (newrelicIsPresent()) {
    try {
      newrelic.addPageAction(event, params); // eslint-disable-line no-undef
    }
    catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }
}
