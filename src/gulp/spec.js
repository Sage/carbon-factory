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
 *      preProcessors: [ 'eslint', 'browserify' ],
 *      specPreProcessors: [ 'browserify' ],
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

import './utils/fs-patch';
import gutil from 'gulp-util';
import S from 'string';
import yargs from 'yargs';
import karma from 'karma';
import istanbul from 'browserify-istanbul';
import babelify from 'babelify';
import tsify from 'tsify';
import fs from 'fs';

var argv = yargs.argv;
var Server = karma.Server;

export default function(opts) {
  var options = opts;

  return function(done) {
    var opts = options || {};
    // the js files to test (everything except __spec__ files)
    var path = opts.path || '/src/***/**/!(__spec__).js';
    // the specs
    var specs = opts.specs || '/src/***/**/__spec__.js';
    // an array of paths to ignore from coverage reports
    var ignoreCoverage = opts.ignoreCoverage || [ '**/node_modules/**', '**/__spec__.js' ];
    // an array to specify what kind of reporters should karma generate
    var reporters = opts.reporters || ['progress'];
    // an array to specify what kind of reporters type should karma generate
    var coverageReporters = opts.coverageReporters || [{ type: 'text-summary' }, { type: 'html' }];
    // which preprocessors the js files should run through
    var preProcessors = opts.preProcessors || [ 'browserify' ];
    // which preprocessors the spec files should run through
    var specpreProcessors = opts.specpreProcessors || [ 'browserify' ];
    // Options to configure karma spec reporter
    var specReporterOpts = opts.specReporterOpts || { suppressSkipped: true };
    // where to find the karma config file
    var configFile = opts.configFile || __dirname + '/karma.conf.js';
    // defaults the coverage thresholds
    var coverageThreshold = Object.assign({}, {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }, opts.coverage);
    // eslintThreshold for failing build
    var eslintThreshold = opts.eslintThreshold || null;
    // Stop build if above eslintThreshold
    var stopAboveEslintThreshold = !!eslintThreshold;
    // coverage thresholds for each file
    var coverageThresholdEachFile = opts.coverageEachFile || {};
    // if using typescript
    var typescript = opts.typescript || false;
    // where the gulp task was ran from
    var originPath = process.cwd();
    // array of modules to apply babel transforms to
    var babelTransforms = opts.babelTransforms || [];

    // check if eslintrc file exists, if not then prompt dev to create one
    fs.stat(originPath + '/.eslintrc', function(err, stat) {
      if (err == null) { return }
      if (err.code == 'ENOENT') {
        gutil.log(gutil.colors.red("Cannot find '.eslintrc' file"));
        gutil.log(gutil.colors.white("Create an '.eslintrc' file in the root of your project and add the following code:\n{\n  \"extends\": \"./node_modules/carbon-factory/.eslintrc\"\n}"));
        process.exit();
      }
    });

    if (!argv['skip-eslint']) {
      preProcessors.unshift('eslint');
    }

    // prefix the paths with where the gulp task was ran from so the files can
    // be found from the correct location
    var src = originPath + path,
        specSrc = originPath + specs,
        babelOptions = {
          babelrc: false, // do not use babelrc files in gulp task
          extends: originPath + '/node_modules/carbon-factory/.babelrc', // manually set babelrc for gulp task
          env: {
            test: {
              auxiliaryCommentBefore: "istanbul ignore next",
              plugins: [ [ "istanbul", { exclude: ignoreCoverage } ] ]
            }
          }
        };

    if (babelTransforms.length) {
      var only = "^((?!node_modules).";

      babelTransforms.forEach((module) => {
        only += "|(node_modules\/" + module + ")";
      });

      only += ")*$";

      babelOptions.global = true;
      babelOptions.only = new RegExp(only);
    } else {
      // only babelify files in the src directory
      babelOptions.ignore = /node_modules/;
    }

    // default configuration for the spec build
    var config = {
      // all the files that should be included
      files: [ '__spec_helper__/*.js', src, { pattern: specSrc, watched: false, included: true, served: true } ],
      // the karma config file
      configFile: configFile,
      // the preprocessors to run the files through
      preprocessors: {},
      // which browsers to run the specs through
      browsers: [ 'PhantomJS' ],
      // options for browserify
      browserify: {
        debug: true,
        // lookup paths for any imported files
        paths: [ originPath + '/src' ],
        // configure any transforms for browserify
        transform: [
          babelify.configure(babelOptions)
        ],
        configure: function(bundle) {
          bundle.on('prebundle', function() {
            bundle.external('react/addons');
            bundle.external('react/lib/ReactContext');
            bundle.external('react/lib/ExecutionEnvironment');
          });
        },
        cache: {},
        packageCache: {}
      },
      // what kind of reporters should karma generate
      reporters: reporters,
      // auto watch for any changes to rerun specs
      autoWatch: true,
      // only run the specs once
      singleRun: true,

      specReporter: specReporterOpts,

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

    // Report tests slower than value
    if (argv['report-slow']) {
      config.reportSlowerThan = 100;
    }

    if (typescript) {
      config.browserify.plugin = [ tsify ];
    }

    // tie the preprocessors to the relevant sources
    config.preprocessors[src] = preProcessors;
    config.preprocessors[specSrc] = specpreProcessors;

    if (argv.b == 'all') {
      // if `gulp -b all` then run through all browsers
      config.browsers = [ 'PhantomJS', 'Chrome_dev', 'Firefox', 'Safari' ];
    } else if (argv.b) {
      // if `gulp -b [browser]` then use the browser supplied
      config.browsers = [ S(argv.b).capitalize().s ];

      // use the custom chrome launcher
      if (config.browsers[0] === 'Chrome') {
        config.browsers = [ config.browsers[0] + '_dev' ];
      }
    }

    // if coverage is enabled
    if (argv.build || argv.coverage) {
      process.env.NODE_ENV = 'test';

      config.reporters.push('coverage');
      config.browserify.transform.push(
        istanbul({
          ignore: ignoreCoverage
        })
      );
    }

    if (argv.build) {
      // if `gulp --build` then use single run mode
      config.autoWatch = false;
      // stop on lint failures in build mode
      config.eslint.stopOnError = !stopAboveEslintThreshold;
      // error threshold above which build fails
      config.eslint.errorThreshold = eslintThreshold;
      // Fail build above error threshold
      config.eslint.stopAboveErrorThreshold = stopAboveEslintThreshold;
      // disable source maps in build mode
      config.browserify.debug = false;
    } else {
      // default to watch mode
      config.singleRun = false;
    }

    var server = new Server(config, function(status) {
      if (status) {
        gutil.log(gutil.colors.red('UI Tests FAILED'));
      } else {
        gutil.log(gutil.colors.green('UI Tests SUCCEEDED'));
      }

      done();

      process.exit(status);
    });

    server.start();
  };
}
