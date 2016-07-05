var gulp = require('gulp');
var BuildTask = require('carbon-factory/lib/gulp/build').default;
var SpecTask = require('carbon-factory/lib/gulp/spec').default;

gulp.task('default', BuildTask());

gulp.task('test', SpecTask());
