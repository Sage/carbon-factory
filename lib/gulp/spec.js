/**
 * A Gulp task for running specs using Karma.
 *
 * To use this in a gulpfile.js:
 *
 *    import SpecTask from 'carbon-factory/lib/gulp/spec';
 *    gulp.task('test', SpecTask());
 *
 * You can also pass a hash of options to customise the task:
 *
 *    import SpecTask from 'carbon-factory/lib/gulp/spec';
 *
 *    var opts = {
 *      path: "/src/*.js",
 *      specs: "/src/*.spec.js",
 *      preProcessors: [ 'babel', 'coverage', 'browserify' ],
 *      specPreProcessors: [ 'babel', 'browserify' ],
 *      ignoreCoverage: [ '/path/to/ignore' ],
 *      reporters: ['progress'],
 *      coverageReporters: [{ type: 'text-summary' }, { type: 'html' }],
 *      coverage: {
 *        statements: 100,
 *        branches: 100,
 *        functions: 100,
 *        lines: 100
 *      },
 *      configFile: 'karma.conf.js'
 *    }
 *
 *    gulp.task('test', SpecTask(opts));
 *
 * If you have setup the task using the task name 'test' then you can run it
 * through the command line like this:
 *
 *    gulp test
 *
 * By default this will automatically run in PhantomJS and will watch for any
 * changes. You can supply additional arguments to run in alternative modes:
 *
 * == To run in watch mode with coverage reports:
 *
 *    gulp test --coverage
 *
 * == To perform a single run with coverage:
 *
 *    gulp test --build
 *
 * == To run the tests in a specific browser:
 *
 *    gulp test -b chrome
 *
 * == To run the test across all browsers:
 *
 *    gulp test -b all
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _karma = require('karma');

var _karma2 = _interopRequireDefault(_karma);

var _browserifyIstanbul = require('browserify-istanbul');

var _browserifyIstanbul2 = _interopRequireDefault(_browserifyIstanbul);

var _babelify = require('babelify');

var _babelify2 = _interopRequireDefault(_babelify);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var argv = _yargs2['default'].argv;
var Server = _karma2['default'].Server;

exports['default'] = function (opts) {
  var options = opts;

  return function (done) {
    var opts = options || {};
    // the js files to test (everything except __spec__ files)
    var path = opts.path || '/src/***/**/!(__spec__).js';
    // the specs
    var specs = opts.specs || '/src/***/**/__spec__.js';
    // an array of paths to ignore from coverage reports
    var ignoreCoverage = opts.ignoreCoverage || ['**/node_modules/**', '**/__spec__.js'];
    // an array to specify what kind of reporters should karma generate
    var reporters = opts.reporters || ['progress'];
    // an array to specify what kind of reporters type should karma generate
    var coverageReporters = opts.coverageReporters || [{ type: 'text-summary' }, { type: 'html' }];
    // which preprocessors the js files should run through
    var preProcessors = opts.preProcessors || ['eslint', 'babel', 'coverage', 'browserify'];
    // which preprocessors the spec files should run through
    var specpreProcessors = opts.specpreProcessors || ['babel', 'browserify'];
    // where to find the karma config file
    var configFile = opts.configFile || __dirname + '/karma.conf.js';
    // defaults the coverage thresholds
    var coverageThreshold = Object.assign({}, {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }, opts.coverage);
    // coverage thresholds for each file
    var coverageThresholdEachFile = opts.coverageEachFile || {};
    // where the gulp task was ran from
    var originPath = process.cwd();

    // check if eslintrc file exists, if not then prompt dev to create one
    _fs2['default'].stat(originPath + '/.eslintrc', function (err, stat) {
      if (err == null) {
        return;
      }
      if (err.code == 'ENOENT') {
        _gulpUtil2['default'].log(_gulpUtil2['default'].colors.red("Cannot find '.eslintrc' file"));
        _gulpUtil2['default'].log(_gulpUtil2['default'].colors.white("Create an '.eslintrc' file in the root of your project and add the following code:\n{\n  \"extends\": \"./node_modules/carbon-factory/.eslintrc\"\n}"));
        process.exit();
      }
    });

    // prefix the paths with where the gulp task was ran from so the files can
    // be found from the correct location
    var src = originPath + path,
        specSrc = originPath + specs;

    // default configuration for the spec build
    var config = {
      // all the files that should be included
      files: [originPath + '/node_modules/babel-polyfill/dist/polyfill.js', '__spec_helper__/*.js', src, { pattern: specSrc, watched: false, included: true, served: true }],
      // the karma config file
      configFile: configFile,
      // the preprocessors to run the files through
      preprocessors: {},
      // which browsers to run the specs through
      browsers: ['PhantomJS'],
      // options for browserify
      browserify: {
        debug: true,
        // lookup paths for any imported files
        paths: [originPath + '/src'],
        // configure any transforms for browserify
        transform: [_babelify2['default'].configure({
          // only babelify files in the src directory
          ignore: /node_modules/,
          // compile experimental es7 class properties
          optional: ["es7.classProperties"],
          // ignore code in the coverage that babelify generates
          auxiliaryCommentBefore: "istanbul ignore next"
        })]
      },
      // what kind of reporters should karma generate
      reporters: reporters,
      // auto watch for any changes to rerun specs
      autoWatch: true,
      // only run the specs once
      singleRun: true,
      // setup config for coverage
      coverageReporter: {
        dir: originPath + '/coverage',
        reporters: coverageReporters,
        check: {
          global: coverageThreshold,
          each: coverageThresholdEachFile
        }
      },
      // config for eslint
      eslint: {
        stopOnError: false,
        stopOnWarning: false
      },
      // adds additional opts for chrome browser - remembers prefs for console
      customLaunchers: {
        Chrome_dev: {
          base: 'Chrome',
          flags: ['--user-data-dir=./.browser-preferences']
        }
      }
    };

    // tie the preprocessors to the relevant sources
    config.preprocessors[src] = preProcessors;
    config.preprocessors[specSrc] = specpreProcessors;

    if (argv.b == 'all') {
      // if `gulp -b all` then run through all browsers
      config.browsers = ['PhantomJS', 'Chrome_dev', 'Firefox', 'Safari'];
    } else if (argv.b) {
      // if `gulp -b [browser]` then use the browser supplied
      config.browsers = [(0, _string2['default'])(argv.b).capitalize().s];

      // use the custom chrome launcher
      if (config.browsers[0] === 'Chrome') {
        config.browsers = [config.browsers[0] + '_dev'];
      }
    }

    // if coverage is enabled
    if (argv.build || argv.coverage) {
      config.reporters.push('coverage');
      config.browserify.transform.push((0, _browserifyIstanbul2['default'])({
        // ignore these files from code coverage
        ignore: ignoreCoverage
      }));
    }

    if (argv.build) {
      // if `gulp --build` then use single run mode
      config.autoWatch = false;
      // stop on lint failures in build mode
      config.eslint.stopOnError = true;
      // disable source maps in build mode
      config.browserify.debug = false;
    } else {
      // default to watch mode
      config.singleRun = false;
    }

    var server = new Server(config, function (status) {
      if (status) {
        _gulpUtil2['default'].log(_gulpUtil2['default'].colors.red('UI Tests FAILED'));
      } else {
        _gulpUtil2['default'].log(_gulpUtil2['default'].colors.green('UI Tests SUCCEEDED'));
      }

      done();

      process.exit(status);
    });

    server.start();
  };
};

module.exports = exports['default'];