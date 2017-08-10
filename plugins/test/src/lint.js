/**
 * A Gulp task for running ESLint
 *
 * To use this in a gulpfile.js:
 *
 *    import LintTask from 'carbon-factory/lib/gulp/lint';
 *
 *    gulp.task('lint', LintTask());
 *
 * The lint task allows you to specify an errorThreshold (defaulted to 0) where the task will fail if the threshold is exceeded
 * Simply pass the errorThreshold to your gulp task:
 *
 *   gulp.task('lint', LintTask({
 *     errorThreshold: 1
 *   }));
 *
 * Other options:
 *
 *   warningThreshold - fail when warning count is over threshold
 *   eslintThreshold - alias for errorThreshold
 *   format - eslint output format. default 'stylish' http://eslint.org/docs/user-guide/formatters/#output-examples
 *
 * The gulp task assumes that you have a .eslintrc file set up in your repository.
 *
 * A the most basic example of this file would be
 *
 *    {
 *      "extends": "./node_modules/carbon-factory/.eslintrc"
 *    }
 *
 */

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const yargs = require('yargs');
const gutil = require('gulp-util');
const fs = require('fs');

var argv = yargs.argv;

export default function(options) {
  var opts = options;

  return function(done) {
    var options = opts || {};

    var errorThreshold = options.eslintThreshold || options.errorThreshold || 0;
    var warningThreshold = options.warningThreshold || 0;
    // http://eslint.org/docs/user-guide/formatters/#output-examples
    var format = options.format || 'stylish';

    var path = options.path || 'src/**/!(__spec__|__definition__).js';

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
      .pipe(eslint.format(format));

    if (argv.build) {
      eslintTask = eslintTask.pipe(eslint.results((results, callback) => {
        var error, message = '';

        if (errorThreshold < results.errorCount) {
          error = true;
          message += 'Error Count (' + results.errorCount + ') is greater than the threshold (' + errorThreshold + ')\n'
        }

        if (warningThreshold < results.warningCount) {
          error = true;
          message += 'Warning Count (' + results.warningCount + ') is greater than the threshold (' + warningThreshold + ')'
        }

        if (error) {
          gutil.log(gutil.colors.red('ESLint Failed:\n\n' + message));
          process.exit(1);
        }

        gutil.log(gutil.colors.green('ESLint Passed'));
        callback();
      }));
    }

    return eslintTask;
  }
}
