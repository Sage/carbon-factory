var gulp = require('gulp');
var Factory = require('carbon-factory');

gulp.task('default', Factory.gulp.default());
gulp.task('test', Factory.gulp.spec());
