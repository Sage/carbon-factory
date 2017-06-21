var gulp = require('gulp');
var watch = require('gulp-watch');
var exec = require('child_process').exec;

//recompiles assets from src to lib on file changes
gulp.task('default', function () {
  return watch('src/**/*', function () {
    exec("npm run prepublish")
  });
});
