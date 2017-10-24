var webpack = require('webpack-stream');

export default function (opts) {
  var options = opts;

  return function() {
    var opts = options || {},
        config = require(__dirname + '/../../webpack.config.js');

    return webpack(config);
  }
};
