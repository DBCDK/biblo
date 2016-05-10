'use strict';
/**
 * Config file for webpack
 */

var webpack = require('webpack');
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

  cache: true,

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
        test: /\.(scss)$/,
        loader: extractTextPlugin.extract(
          'css!' +
          'sass'
        )
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline'
      }
    ]
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(scss|css|svg)$/, path.resolve(__dirname, 'src/client/scss/settings/colors.scss')), // replace all .scss files with one specific (and small) .scss file. We don't care about sass when testing anyways.
    new webpack.NormalModuleReplacementPlugin(/\.(svg)$/, path.resolve(__dirname, 'src/client/components/General/Icon/svg/functions/apple.svg')), // replace all .svg files with one specific .svg file. We don't care about svg's when testing anyways.
    extractCss,
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
