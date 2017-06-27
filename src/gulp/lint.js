const gulp = require('gulp');
const eslint = require('gulp-eslint');
const yargs = require('yargs');
const PluginError = require('gulp-util').PluginError;

var argv = yargs.argv;

export default function(opts) {
  var errorThreshold = opts.eslintThreshold || 1;

  var eslintTask = gulp.src([
      'src/**/!(__spec__|definition).js',
    ], { base: process.cwd() })
    .pipe(eslint({
      configFile:  process.cwd() + '/.eslintrc'
    }))
    .pipe(eslint.format());

  if (argv.build) {
    eslintTask = eslintTask.pipe(eslint.results((results, callback) => {
      console.log(`Total Errors: ${results.errorCount}`);
      if (errorThreshold && errorThreshold < results.errorCount) {
        console.log('Above Threshold Limit');
        throw new PluginError('gulp-eslint', {
          name: 'ESLint THRESHOLD Error',
          message: 'LIMIT'
        });
      }
      callback();
    }));
  }

  return eslintTask;
}
