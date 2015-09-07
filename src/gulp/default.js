var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

module.exports = function (opts) {
  // setup defaults for opts
  var opts =    opts || {},
      src =     opts.src || './src/main.js',
      dest =    opts.dest || './',
      file =    opts.file || 'ui.js';

  // setup watchify and browserify (transform through babel.js)
  var bundler = watchify(browserify({
    entries: [src],
    transform: [babel]
  }));

  // the main build task
  function build(f) {
    if (f) gutil.log('Recompiling ' + f);
    return bundler
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(file))
      .pipe(gulp.dest(dest));
  };

  // perform initial build
  build();

  // setup watch to rebuild files
  bundler.on('update', build);
};
