'use strict';
/**
 * Config file for webpack
 */

require('webpack');
var path = require('path');
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
  resolve: {
    root: [path.resolve(__dirname, 'src/client/components'), path.resolve(__dirname, 'node_modules')],
    extensions: ['', '.js']
  },
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-runtime', 'transform-async-to-generator']
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
          'css?sourceMap!' +
          'sass?sourceMap' +
          "&includePaths[]=" + path.resolve(__dirname, "./src/client/scss/") +
          "&includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib") +
          "&includePaths[]=" + path.resolve(__dirname, "./node_modules/sass-mediaqueries")
        )
      }
    ]
  },

  plugins: [
    extractCss
  ],

  node: {
    fs: 'empty'
  },

  externals: {
    sinon: 'sinon'
  }
};
