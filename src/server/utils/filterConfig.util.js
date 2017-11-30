/**
 * Filters away sensitive and unwanted information from given config object
 *
 * @param {object} bibloConfig
 * @return {object}
 */
export function filterConfig(bibloConfig) {
  const filtered = Object.assign({}, bibloConfig);
  const keys = ['endpoint', 'port', 'host', 'wsdl', 'smaug', 'uniloginBasePath'];
  const excludedKeys = ['Email', 'elasticSearch', 'datasources'];

  Object.keys(filtered).forEach(item => {
    if ((typeof filtered[item] !== 'object' && !keys.includes(item)) || !filtered[item] || excludedKeys.includes(item)) {
      delete filtered[item];
    }
    else if (filtered[item] && typeof filtered[item] === 'object') {
      const _filtered = filterConfig(filtered[item]);
      if (Object.keys(_filtered).length === 0) {
        delete filtered[item];
      }
      else {
        filtered[item] = _filtered;
      }
    }
  });

  return filtered;
}
