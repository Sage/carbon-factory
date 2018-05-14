const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = process.cwd();

module.exports = {
  entry: path + '/src/main.js',
  output: {
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
      include: /^((?!node_modules).|(node_modules\/s1-artefacts-ui))*$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: ['transform-class-properties']
        }
      }
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'style-loader'
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
        }]
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin('stylesheets/ui.css'),
  ]
};
