/**
 * @file: exports function which parses the query parameters from a url.
 */

export default function parseQueryParams(url) {
  let result = {};
  const params = url.split('?');
  const pairs = params && params.length === 2 ? params[1].split('&') : [];
  // eslint-disable-next-line guard-for-in
  for (const i in pairs) {
    const parts = pairs[i].split('=');
    if (parts.length === 2) {
      result[parts[0]] = decodeURIComponent(parts[1]);
    }
  }
  return result;
}
