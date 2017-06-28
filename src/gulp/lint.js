const gulp = require('gulp');
const eslint = require('gulp-eslint');
const yargs = require('yargs');
const PluginError = require('gulp-util').PluginError;

var argv = yargs.argv;

export default function(opts) {
  var errorThreshold = opts.eslintThreshold || 0;
  var path = opts.path || 'src/**/!(__spec__|definition).js';

  var eslintTask = gulp.src([path], { base: process.cwd() })
    .pipe(eslint({
      configFile:  process.cwd() + '/.eslintrc'
    }))
    .pipe(eslint.format());

  if (argv.build) {
    eslintTask = eslintTask.pipe(eslint.results((results, callback) => {
      if (errorThreshold && errorThreshold < results.errorCount) {
        throw new PluginError('Carbon Factory Lint', {
          name: 'ESLint Threshold Error',
          message: 'Error Count (' + results.errorCount + ') is greater than the threshold (' + errorThreshold + ')'
        });
      }
      callback();
    }));
  }

  return eslintTask;
}
