var webpack = require('webpack');
var path = require('path');
var extractTextPlugin = require('extract-text-webpack-plugin');

var noErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();
var extractCss = new extractTextPlugin({filename: '../css/[name].css', allChunks: true});

module.exports = [
  {
    name: 'browser',

    entry: {
      profileedit: './src/client/components/Profile/Edit/index.js',
      profileeditlibrary: './src/client/components/Profile/LibraryEdit/index.js',
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
      campaigncertificate: './src/client/components/CampaignCertificate/CampaignCertificate.component.js'
    },
    output: {
      path: path.join(__dirname, 'public/js'),
      filename: '[name].js'
    },
    cache: true,

    resolve: {
      modules: [path.resolve(__dirname, 'src/client/components'), path.resolve(__dirname, 'node_modules')]
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015'],
            plugins: ['transform-runtime', 'transform-async-to-generator']
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'css-loader?sourceMap',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, // @see https://github.com/webpack-contrib/sass-loader#source-maps
                includePaths: [
                  path.resolve(__dirname, './src/client/scss/'),
                  path.resolve(__dirname, './node_modules/compass-sass-mixins/lib'),
                  path.resolve(__dirname, './node_modules/sass-mediaqueries')
                ]
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: () => [require('autoprefixer')()] // @see https://github.com/postcss/postcss-loader#plugins
              }
            }
          ]
        },
        {
          test: /\.svg$/,
          loader:
            'svg-sprite-loader?' +
            JSON.stringify({
              name: '[pathhash]',
              prefixize: true
            })
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
