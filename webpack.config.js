'use strict';

var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require('extract-text-webpack-plugin');

//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var noErrorsPlugin = new webpack.NoErrorsPlugin();
var extractCss = new extractTextPlugin('../css/[name].css', {allChunks: true});

module.exports = [{
  name: 'browser',

  entry: {
    frontpage: './src/client/components/FrontPage/index.js',
    groups: './src/client/components/Groups/index.js',
    groupcreate: './src/client/components/Groups/Create/index.js',
    groupdetail: './src/client/components/Groups/Detail/index.js',
    groupedit: './src/client/components/Groups/Edit/index.js',
    footer: './src/client/components/Footer/index.js',
    navbar: './src/client/components/Navbar/index.js'
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
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
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

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    lodash: '_',
    newrelic: 'newrelic',
    'normalize.css': 'normalize.css'
  },

  plugins: [
    //commonsPlugin,
    extractCss,
    noErrorsPlugin
  ],

  watchOptions: {
    poll: true
  }
}];
