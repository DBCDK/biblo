'use strict';
/**
 * Config file for webpack used by wallaby
 */

var webpack = require('webpack');
var path = require('path');

/**
 * Setup webpack to transpile ES6 and jsx + handle scss files
 *
 * @type {{entry: {app: string}, output: {path: string, filename: string}, module: {loaders: *[]}, plugins: *[]}}
 */
module.exports = {
  resolve: {
    root: [path.resolve(__dirname, 'src/client/components'), path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src/server')],
    extensions: ['', '.js']
  },

  cache: true,

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(gif|svg|scss|css)$/, 'node-noop'), // replace all .scss files with one specific (and small) .scss file. We don't care about sass when testing anyways.
    new webpack.IgnorePlugin(/(ReactContext)/)
  ],

  node: {
    fs: 'empty'
  },

  externals: {
    sinon: 'sinon',
    React: 'react',
    ReactDOM: 'react-dom'
  },

  devtool: 'source-map'
};
