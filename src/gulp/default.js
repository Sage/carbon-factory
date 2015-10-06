var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('babelify');
var watchify = require('watchify');
var parcelify = require('parcelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sassCssStream = require('sass-css-stream');

module.exports = function (opts) {
  // setup defaults for opts
  var opts =    opts || {},
      src =     opts.src || './src/main.js',
      jsDest =  opts.jsDest || './',
      jsFile =  opts.jsFile || 'ui.js',
      cssDest = opts.cssDest || './',
      cssFile = opts.cssFile || 'app.css';

  function handleError(err) {
    console.error(err.toString());
    process.stdout.write('\x07');
    this.emit('end');
  }

  /**
   * Babel options (for JS/JSX).
   */
  var babelTransform = babel.configure({
    optional: ["es7.classProperties"]
  });

  /**
   * Browserify options (for CommonJS).
   */
  var browserified = browserify({
    entries: [src],
    transform: [babelTransform]
  });

  /**
   * Parcelify options (for Sass/CSS).
   */
  var parcelified = parcelify(browserified, {
    watch: true,
    bundles: {
      style: cssDest + '/' + cssFile
    },
    // if passing options is not necessary this transform should be defined in the package.json like so `"transforms": ["sass-css-stream"]`
    appTransforms : [
      // need an wrapper function to pass options to the stream transformer
      function sassTransformer( file ) {
        // array of include paths allows for overriding entire files
        return sassCssStream( file, { includePaths: [process.cwd() + "/src/carbon_custom", process.cwd() + "/src/components"] } );
      }
    ],
    appTransformDirs: ['./']
  }).on('done', function() {
    // when parcelify is ready
    console.log('built css...');
  }).on('error', function(err) {
    // handle error
    handleError.call(this, err);
  }).on('bundleWritten', function() {
    // write the file
    return gulp.src(cssFile)
      .on('error', handleError)
      .pipe(gulp.dest(cssDest));
  });

  /**
   * The pack we are going to watch and build
   */
  var bundler = watchify(browserified);

  /**
   * The main build task.
   */
  function build(f) {
    if (f) gutil.log('Recompiling ' + f);
    return bundler
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(jsFile))
      .pipe(gulp.dest(jsDest));
  };

  // run the build immediately and whenever the bundler updates
  bundler.on('update', build);
  build();
};
