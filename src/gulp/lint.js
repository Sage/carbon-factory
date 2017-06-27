const gulp = require('gulp');
const eslint = require('gulp-eslint');

export default function(opts) {
  console.log('FOOOOOOOOO', process.cwd());
  console.log('__dirname', __dirname);
  return gulp.src([
      process.cwd() + '/src/components/**/*.js',
      process.cwd() + '/src/utils/**/*.js',
      process.cwd() + '!/node_modules/**',
      process.cwd() + '/**/!(__spec__.js)',
    ])
    .pipe(eslint({
      configFile:  process.cwd() + '/.eslintrc'
    }))
    .pipe(eslint.format());
}
