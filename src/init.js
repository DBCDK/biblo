'use strict';

/**
 * babelify all workers (ie. out execution entrypoint).
 */
require('babel-register')({
  presets: ['react', 'es2015']
});

module.exports.run = function() {
};
