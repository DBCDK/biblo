const path = require('path');
const crypto = require('crypto');

/**
 * babelify all workers (ie. out execution entrypoint).
 */
require('babel-register')();

/**
 * This handler is used for SSR, so we can still use imports of scss and svgs in our react components
 */
require('ignore-styles').default(['.scss', '.css', '.svg'], (module, filename) => {
  const base = path.basename(filename);
  if (base.indexOf('.svg') > 0) {
    module.exports = '#' + crypto.createHash('md5').update(filename).digest("hex");
  }
});

module.exports.run = function() {
  require('pmx').init({
    ignore_routes: [/socketcluster/]
  });
};
