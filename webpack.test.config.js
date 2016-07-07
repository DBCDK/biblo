'use strict';
/**
 * Config file for webpack
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
    root: [path.resolve(__dirname, 'src/client/components'), path.resolve(__dirname, 'node_modules')],
    extensions: ['', '.js']
  },

  cache: true,

  loaders: [
    {
      test: /\.json$/,
      loader: 'json',
      include: [
        /node_modules/
      ]
    }
  ],

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
    ]
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(gif|svg|scss|css)$/, 'node-noop'), // replace all .scss files with one specific (and small) .scss file. We don't care about sass when testing anyways.
    new webpack.IgnorePlugin(/(ReactContext)/)
  ],

  node: {
    fs: 'empty'
  },

  externals: {
    sinon: 'sinon'
  },

  devtool: '#eval'
};
