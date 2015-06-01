'use strict';

var webpack = require('webpack');
var path = require('path');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var noErrorsPlugin = new webpack.NoErrorsPlugin();

module.exports = {
  entry: {
    logo: './src/components/logo/index.js',
    autocomplete: './src/components/autocomplete/index.js'
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    commonsPlugin,
    noErrorsPlugin
  ]
};
