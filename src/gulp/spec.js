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

import gutil from 'gulp-util';
import S from 'string';
import yargs from 'yargs';
import karma from 'karma';
import istanbul from 'browserify-istanbul';
import babelify from 'babelify';

var argv = yargs.argv;
var Server = karma.Server;

export default function(opts) {
  var opts = opts || {};
  // the js files to test
  var path = opts.path || '/src/***/**/*.js';
  // the specs
  var specs = opts.specs || '/src/***/**/__spec__.js';
  // which preprocessors the js files should run through
  var preProcessors = opts.preProcessors || [ 'babel', 'coverage', 'browserify' ];
  // which preprocessors the spec files should run through
  var specpreProcessors = opts.specpreProcessors || [ 'babel', 'browserify' ];
  // where to find the karma config file
  var configFile = opts.configFile || __dirname + '/../spec-helper/karma.conf.js';

  // where the gulp task was ran from
  var originPath = process.cwd();

  // prefix the paths with where the gulp task was ran from so the files can
  // be found from the correct location
  var src = originPath + path,
      specSrc = originPath + specs;

  // default configuration for the spec build
  var config = {
    // all the files that should be included
    files: [ src, specSrc ],
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
        babelify.configure({
          // compile experimental es7 class properties
          optional: [ "es7.classProperties" ],
          // ignore code in the coverage that babelify generates
          auxiliaryCommentBefore: "istanbul ignore next"
        }),
        istanbul({
          // ignore these files from code coverage
          ignore: [ '**/node_modules/**', '**/__spec__.js' ]
        })
      ]
    },
    // what kind of reporters should karma generate
    reporters: ['progress', 'coverage'],
    // auto watch for any changes to rerun specs
    autoWatch: true,
    // only run the specs once
    singleRun: true
  }

  // tie the preprocessors to the relevant sources
  config.preprocessors[src] = preProcessors;
  config.preprocessors[specSrc] = specpreProcessors;

  if (argv.b == 'all') {
    // if `gulp -b all` then run through all browsers
    config.browsers = [ 'PhantomJS', 'Chrome', 'Firefox', 'Safari' ];
  } else if (argv.b) {
    // if `gulp -b [browser]` then use the browser supplied
    config.browsers = [ S(argv.b).capitalize().s ];
  }

  if (argv.build) {
    // if `gulp --build` then use single run mode
    config.autoWatch = false;
  } else {
    // default to watch mode
    config.singleRun = false;

    if (!argv.coverage) {
      // if `--coverage` is not supplied then do not run coverage in watch mode
      config.reporters = [ 'progress' ];
    }
  }

  return function(done) {
    var server = new Server(config, function(status) {
      if (status) {
        gutil.log(gutil.colors.red('UI Tests FAILED'));
      } else {
        gutil.log(gutil.colors.green('UI Tests SUCCEEDED'));
      }

      done();

      // apparently this is not recommended but I'm not sure what else to do
      // https://github.com/karma-runner/karma/issues/1035
      process.exit();
    });

    server.start();
  };
}
