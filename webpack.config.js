const CompressionPlugin = require("compression-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = process.cwd();
const _p = require('path');
const production = process.env.NODE_ENV == 'production';

const imageFormats = 'png|svg|jpg|gif';

module.exports = function(opts) {
  /***********
   * OPTIONS *
   ***********/

  opts = opts || {};
  const entryPoint = opts.entryPoint || './src/main.js';
  const outputPath = opts.outputPath || './assets';
  const serverBase = opts.serverBase || './';
  const publicPath = opts.publicPath || '/assets/';
  const host = opts.host || '0.0.0.0';
  const port = opts.port || 8080;
  const public = opts.public || `${host}:${port}`;
  const lookupPaths = opts.lookupPaths || [];
  const gzip = (opts.gzip === false) ? false : true;
  const singlePageApp = opts.singlePageApp || false;
  const showStats = process.argv.includes('--stats');
  const statsOptions = opts.statsOptions;
  const productionSourcemaps = opts.productionSourcemaps || false;

  /******************
   * WEBPACK CONFIG *
   ******************/

  const config = {
    mode: production ? 'production' : 'development',
    entry: _p.resolve(path, entryPoint),
    output: {
      path: _p.resolve(path, outputPath),
      publicPath: publicPath,
      filename: 'javascripts/ui.js',
      chunkFilename: 'javascripts/[name].bundle.js'
    },
    resolve: {
      modules: lookupPaths.concat([
        _p.resolve(path, './src'),
        _p.resolve(path, './node_modules')
      ])
    }
  };

  // Enable sourcemaps, different kinds depending on environment
  if (production && productionSourcemaps) config.devtool = 'source-map'
  if (!production) config.devtool = 'eval-source-maps';


  /***********
   * LOADERS *
   ***********/

  // Awesome Typescript Loader
  const awesomeTypescriptLoader = {
    test: /\.(t|j)sx?$/,
    use: {
      loader: 'awesome-typescript-loader'
    },
    options: {
      presets: ['env'],
      plugins: [
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    }
  }

  //SourceMapLoader
  const sourceMapLoader = {
    enforce: "pre",
    test: /\.js$/,
    loader: "source-map-loader"
  }


  // Babel Loader
  const babelLoader = {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              targets: {
                browsers: 'IE 11'
              }
            }
          ],
          "@babel/preset-react"
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-syntax-dynamic-import'
        ]
      }
    }
  };

  // CSS Loader
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
          _p.resolve(path, './src/style-config'),
          _p.resolve(path, './node_modules/carbon-react/lib/style-config')
        ]
      }
    }],
  };

  // Image Loader
  const imageLoader = {
    test: new RegExp(`\.(${imageFormats})$`, 'i'),
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'images/'
      }
    }]
  };

  // Font Loader
  const fontLoader = {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/'
      }
    }]
  };

  config.module = {
    rules: [
      babelLoader,
      awesomeTypescriptLoader,
      sourceMapLoader,
      cssLoader,
      imageLoader,
      fontLoader
    ]
  };

  /**************
   * DEV SERVER *
   **************/

  config.devServer = production ? {} : {
    contentBase: _p.resolve(path, serverBase),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    host: host,
    hot: true,
    port: port,
    public: public,
    publicPath: publicPath,
    historyApiFallback: singlePageApp,
    before(app) {
      app.get(/stylesheets\/ui.css/, (req, res) => {
        res.sendFile(_p.resolve(path, './node_modules/carbon-factory/fake.css'));
      });
    }
  };

  /***********
   * PLUGINS *
   ***********/

  // Clean Webpack Plugin
  const clean = new CleanWebpackPlugin([_p.resolve(path, outputPath)], {
    root: _p.resolve(path)
  });

  if (production) {
    // Production Plugins
    config.plugins = [
      clean,
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      new MiniCssExtractPlugin({
        filename: 'stylesheets/ui.css'
      })
    ]

    if (gzip) {
      config.plugins.push(
        new CompressionPlugin({
          asset: '[path][query]',
          exclude: new RegExp(`\.(${imageFormats})$`, 'i'),
          minRatio: Infinity
        })
      );
    }
  } else {
    // Development Plugins
    config.plugins = [
      clean,
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ];
  }

  // Bundle stats
  if (showStats) config.plugins.push(new BundleAnalyzerPlugin(statsOptions));

  return config;
};
