/**
 * A Gulp task for running specs with Jest
 *
 * To use this in gulpfile.js
 *
 *    import SpecTask from 'carbon-factory/lib/gulp/spec';
 *    gulp.task('test', SpecTask());
 *
 *
 * You can also pass a hash of options to customise the task:
 *
 *    import SpecTask from 'carbon-factory/lib/gulp/spec';
 *
 *    var opts = {
 *      jestConfig: {
 *        watch: false
 *      }
 *    }
 *
 *    gulp.task('test', SpecTask(opts));
 *
 * If you have setup the task using the task name 'test' then you can run it
 * through the command line like this:
 *
 *    gulp test
 *
 * By default this will automatically run in JestCLI and will watch for any
 * changes. You can supply additional arguments to run in alternative modes:
 *
 * == To perform a single run which fails on coverage and linting (useful for CI)
 *
 *    gulp test --build
 */

var gulp = require('gulp');
var jest = require('jest-cli');
var yargs = require('yargs');
var lint = require('./lint').default;

gulp.task('lint', lint);

// Config Options https://facebook.github.io/jest/docs/configuration.html
var baseJestConfig = {
  preset: __dirname + "./../../jest.conf.json"
}

var argv = yargs.argv;

export default function(opts) {
  var config = Object.assign({}, baseJestConfig, opts.jestConfig);
  var cliOptions = { watch: true, onlyChanged: true, config: config }

  if (argv.build) {
    gulp.start('lint');
    cliOptions = { config: config }
  }

  // TODO: Can we pass more arguments here to jestCli
  return function(done) {
    // https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js
    jest.runCLI(cliOptions, '.', function() {
      done();
    });
  }
}
