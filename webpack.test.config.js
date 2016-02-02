'use strict';
/**
 * Config file for webpack
 */

require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');

/**
 * Extracts css to a separate file
 *
 * @type {ExtractTextPlugin|exports|module.exports}
 */
var extractCss = new extractTextPlugin('style.css');

/**
 * Setup webpack to transpile ES6 and jsx + handle scss files
 *
 * @type {{entry: {app: string}, output: {path: string, filename: string}, module: {loaders: *[]}, plugins: *[]}}
 */
module.exports = {
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.js$/,
        exclude: /(test|node_modules|bower|__tests__)\//,
        loader: 'isparta'
      }
    ],
    loaders: [
      {
        test: /\.(scss|css)$/,
        loader: extractTextPlugin.extract(
          // activate source maps via loader query
          'css?sourceMap!' +
          'sass?sourceMap'
        )
      }
    ]
  },

  plugins: [
    extractCss
  ],

  node: {
    fs: 'empty'
  }
};
