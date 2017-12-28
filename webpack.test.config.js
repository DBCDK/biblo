/* eslint-disable */
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
    alias: {
      // when several modules specifies the same module but in different verison webpack are not always able to resolve the correct packages, this is solved by aliasing directly to the failing requirement
      'lodash/array': path.resolve(__dirname, 'node_modules/bill/node_modules/lodash/array'),
      'lodash/object': path.resolve(__dirname, 'node_modules/bill/node_modules/lodash/object'),
      'browserify-aes/browser': path.resolve(
        __dirname,
        'node_modules/browserify-cipher/node_modules/browserify-aes/browser'
      )
    },
    modules: [
      path.resolve(__dirname, 'src/client/components'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src/server')
    ],
    extensions: ['.js', '.json']
  },

  cache: true,

  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'airbnb'],
          plugins: ['transform-runtime', 'transform-async-to-generator', 'transform-class-properties']
        }
      }
    ]
  },

  plugins: [
    new webpack.NormalModuleReplacementPlugin(/\.(gif|svg|scss|css)$/, 'node-noop'), // replace all .scss files with one specific (and small) .scss file. We don't care about sass when testing anyways.
    new webpack.IgnorePlugin(/(ReactContext)/)
  ],

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },

  externals: {
    sinon: 'sinon'
  },

  devtool: '#eval'
};
