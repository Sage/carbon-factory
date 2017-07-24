const gulp = require('gulp');
const eslint = require('gulp-eslint');
const yargs = require('yargs');
const PluginError = require('gulp-util').PluginError;
const gutil = require('gulp-util');
const fs = require('fs');

var argv = yargs.argv;

export default function(opts) {
  var options = opts || {};

  var errorThreshold = options.eslintThreshold || 0;
  var path = options.path || 'src/**/!(__spec__|definition).js';

  fs.stat(process.cwd() + '/.eslintrc', function(err, stat) {
    if (err == null) { return }
    if (err.code == 'ENOENT') {
      gutil.log(gutil.colors.red("Cannot find '.eslintrc' file"));
      gutil.log(gutil.colors.white("Create an '.eslintrc' file in the root of your project and add the following code:\n{\n  \"extends\": \"./node_modules/carbon-factory/.eslintrc\"\n}"));
      process.exit();
    }
  });

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
