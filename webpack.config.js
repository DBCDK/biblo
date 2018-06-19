var webpack = require('webpack');
var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
var noErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();
var extractCss = new MiniCssExtractPlugin({
  filename: '../css/[name].css',
  allChunks: true
});

module.exports = [
  {
    name: 'browser',

    entry: {
      profileedit: './src/client/components/Profile/Edit/index.js',
      profileeditlibrary:
        './src/client/components/Profile/LibraryEdit/index.js',
      profiledetail: './src/client/components/Profile/Detail/index.js',
      contentpage: './src/client/components/ContentPage/index.js',
      groups: './src/client/components/Groups/index.js',
      search: './src/client/components/Search/index.js',
      error: './src/client/components/ErrorPage/index.js',
      groupcreate: './src/client/components/Groups/Create/index.js',
      groupdetail: './src/client/components/Groups/View/index.js',
      groupedit: './src/client/components/Groups/Edit/index.js',
      work: './src/client/components/Work/index.js',
      review: './src/client/components/Review/index.js',
      reviewexplorer: './src/client/components/ReviewExplorer/index.js',
      preview: './src/client/components/WidgetContainer/index.js',
      campaigncertificate:
        './src/client/components/CampaignCertificate/CampaignCertificate.component.js'
    },
    output: {
      path: path.join(__dirname, 'public/js'),
      filename: '[name].js'
    },

    resolve: {
      modules: [
        path.resolve(__dirname, 'src/client/components'),
        path.resolve(__dirname, 'node_modules')
      ]
    },

    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015'],
            plugins: [
              'transform-runtime',
              'transform-async-to-generator',
              'transform-class-properties'
            ]
          }
        },

        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, // @see https://github.com/webpack-contrib/sass-loader#source-maps
              }
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  path.resolve(__dirname, './node_modules/susy/sass/_susy.scss'),
                  path.resolve(__dirname, './node_modules/compass-mixins/lib/_compass.scss'),
                  path.resolve(__dirname, './node_modules/sass-mediaqueries/_media-queries.scss'),
                  path.resolve(__dirname, './src/client/scss/global.scss'),
                ]
              }
            },

            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [require('autoprefixer')()] // @see https://github.com/postcss/postcss-loader#plugins
              }
            },           
          ]
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          loader: 'svg-sprite-loader'
        }
      ]
    },

    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      lodash: '_',
      newrelic: 'newrelic',
      twemoji: 'twemoji'
    },

    plugins: [
      new HardSourceWebpackPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          sassLoader: {
            includePaths: [path.resolve(__dirname, 'src', 'scss')]
          },
          context: '/'
        }
      }),
      extractCss,
      noErrorsPlugin
    ]
  }
];
