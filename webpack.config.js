const CompressionPlugin = require("compression-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = process.cwd();
const production = process.env.NODE_ENV == 'production';

module.exports = function(opts) {
  /* Extract Options */
  opts = opts || {};
  const entryPoint = opts.entryPoint || '/src/main.js';
  const outputPath = opts.outputPath || '/assets';
  const serverBase = opts.serverBase || '/';
  const publicPath = opts.publicPath || '/assets/';
  const host = opts.host || '0.0.0.0';
  const port = opts.port || 8080;
  const public = opts.public || `${host}:${port}`;
  const lookupPaths = opts.lookupPaths || [];
  const parcelifyPaths = opts.parcelifyPaths || [];

  /* Parcelify Loader */
  const parcelifyLoader = {
    test: /\.js$/,
    enforce: 'pre',
    use: ['parcelify-loader'],
    include: parcelifyPaths.concat([
      path + '/src'
    ])
  };

  /* Babel Loader */
  const babelLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['env'],
        plugins: ['transform-class-properties']
      }
    }
  };

  /* CSS Loader */
  const cssLoader = {
    test: /\.(scss|css)$/,
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
  };

  /* Webpack Config */
  const config = {
    entry: path + entryPoint,
    output: {
      path: path + outputPath,
      publicPath: publicPath,
      filename: 'javascripts/ui.js'
    },
    resolve: {
      modules: lookupPaths.concat([
        path + '/src',
        path + '/node_modules'
      ])
    },
    module: {
      rules: [parcelifyLoader, babelLoader, cssLoader]
    }
  };

  /* Compilation Mode */
  config.mode = production ? 'production' : 'development';

  /* Dev Server Config */
  config.devServer = production ? {} : {
    contentBase: path + serverBase,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    host: host,
    hot: true,
    port: port,
    public: public,
    publicPath: publicPath
  };

  if (production) {
    /* Production Plugins */
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
    /* Development Plugins */
    config.plugins = [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ];
  }

  return config;
};
