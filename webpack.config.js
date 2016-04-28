'use strict';

var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var noErrorsPlugin = new webpack.NoErrorsPlugin();
var extractCss = new extractTextPlugin('../css/[name].css', {allChunks: true});

module.exports = [{
  name: 'browser',

  entry: {
    profileedit: './src/client/components/Profile/Edit/index.js',
    profiledetail: './src/client/components/Profile/Detail/index.js',
    frontpage: './src/client/components/FrontPage/index.js',
    article: './src/client/components/Article/index.js',
    groups: './src/client/components/Groups/index.js',
    search: './src/client/components/Search/index.js',
    error: './src/client/components/ErrorPage/index.js',
    groupcreate: './src/client/components/Groups/Create/index.js',
    groupdetail: './src/client/components/Groups/View/index.js',
    groupedit: './src/client/components/Groups/Edit/index.js',
    work: './src/client/components/Work/index.js'
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: '[name].js'
  },
  resolve: {
    root: [path.resolve(__dirname, 'src/client/components'), path.resolve(__dirname, 'node_modules')],
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-runtime', 'transform-async-to-generator']
        }
      },
      {
        test: /\.(scss|css)$/,
        loader: extractTextPlugin.extract(
          // activate source maps via loader query
          'css?sourceMap' +
          '!sass?sourceMap' +
          "&includePaths[]=" + path.resolve(__dirname, "./src/client/scss/") +
          "&includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib") +
          "&includePaths[]=" + path.resolve(__dirname, "./node_modules/sass-mediaqueries") +
          '!postcss-loader'
        )
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite?' + JSON.stringify({
          name: '[name]_[hash]',
          prefixize: true
        })
      }
    ]
  },

  postcss: [autoprefixer({browsers: ['last 2 versions'] }) ],

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    lodash: '_',
    newrelic: 'newrelic'
  },

  plugins: [
    //commonsPlugin,
    extractCss,
    noErrorsPlugin
  ]
}];
