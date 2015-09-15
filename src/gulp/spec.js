var S = require('string');
var argv = require('yargs').argv;
var Server = require('karma').Server;
var istanbul = require('browserify-istanbul');

module.exports = function(opts) {
  // users defined opts
  var opts = opts || {};
  var path = opts.path || '/src/**/*.js';
  var specs = opts.specs || '/spec/**/*.js';
  var preProcessors = opts.preProcessors || [ 'babel', 'coverage', 'browserify' ];
  var specpreProcessors = opts.specpreProcessors || [ 'babel', 'browserify' ];
  var configFile = opts.configFile || __dirname + '/../spec-helper/karma.conf.js';

  // internal opts
  var src = process.cwd() + path;
  var specSrc = process.cwd() + specs;

  var pp = {};
  pp[src] = preProcessors;
  pp[specSrc] = specpreProcessors;

  var browsers = ['PhantomJS'];

  if (argv.b == 'all') {
    browsers = ['PhantomJS', 'Chrome', 'Firefox', 'Safari'];
  } else if (argv.b) {
    browsers = [S(argv.b).capitalize().s];
  }

  if (argv.build) {
    // single run mode
    var singleRun = true;
    var autoWatch = false;
    var reporters = ['progress', 'coverage'];
    var browserifyOpts = {
      debug: true,
      transform: [
        'babelify',
        istanbul({
          ignore: ['**/node_modules/**', '**/spec/**']
        })
      ]
    };
  } else {
    // watch mode
    var singleRun = false;
    var autoWatch = true;
    if (argv.coverage) {
      // coverage in watch mode
      var reporters = ['progress', 'coverage'];
      var browserifyOpts = {
        debug: true,
        transform: [
          'babelify',
          istanbul({
            ignore: ['**/node_modules/**', '**/spec/**']
          })
        ]
      };
    } else {
      // no coverage in watch mode
      var reporters = ['progress'];
      var browserifyOpts = {
        debug: true,
        transform: [
          'babelify'
        ]
      };
    }
  }

  return function(done) {
    var config = {
      files: [src, specSrc],
      configFile: configFile,
      preprocessors: pp,
      browsers: browsers,
      browserify: browserifyOpts,
      reporters: reporters,
      autoWatch: autoWatch,
      singleRun: singleRun
    };
    server = new Server(config, function(status) {
      if (status) {
        console.log("UI Tests FAILED");
      } else {
        console.log("UI Tests SUCCEEDED");
      }

      done();

      // apparently this is not recommended but I'm not sure what else to do
      // https://github.com/karma-runner/karma/issues/1035
      process.exit();
    });
    server.start();
  };
}
