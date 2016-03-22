'use strict';

/**
 * babelify all workers (ie. out execution entrypoint).
 */
require('babel-register')({
  presets: ['react', 'es2015'],
  plugins: ['transform-runtime', 'transform-async-to-generator', 'array-includes']
});

module.exports.run = function() {
};
