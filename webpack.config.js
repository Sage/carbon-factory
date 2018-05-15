const CompressionPlugin = require("compression-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = process.cwd();
const production = process.env.NODE_ENV == 'production';

module.exports = function(opts) {
  opts = opts || {};
  const entryPoint = opts.entryPoint || '/src/main.js';
  const outputPath = opts.outputPath || '/assets';
  const serverBase = opts.serverBase || '/';

  const config = {
    entry: path + entryPoint,
    output: {
      path: path + outputPath,
      publicPath: '/assets/',
      filename: 'javascripts/ui.js'
    },
    resolve: {
      modules: [
        path + '/src',
        path + '/node_modules'
      ]
    },
    module: {
      rules: [{
        test: /\.js$/,
        enforce: 'pre',
        use: ['parcelify-loader'],
        include: [
          path + '/src',
          path + '/demo'
        ]
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-class-properties']
          }
        }
      }, {
        test: /\.scss$/,
        use: [{
          loader: production ? MiniCssExtractPlugin.loader : 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path + '/src/style-config',
              path + '/node_modules/carbon-react/lib/style-config'
            ]
          }
        }],
      }]
    }
  };

  config.mode = production ? 'production' : 'development';
  config.devServer = production ? {} : {
    contentBase: path + serverBase,
    hot: true
  };
  if (production) {
    config.plugins = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({}),
      new MiniCssExtractPlugin({
        filename: "stylesheets/ui.css"
      }),
      new CompressionPlugin({
        asset: '[path][query]'
      })
    ]
  } else {
    config.plugins = [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ];
  }

  return config;
};
