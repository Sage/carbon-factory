/**
 * A Gulp task for compiling JavaScript through Browserify.
 *
 * To use this in a gulpfile.js:
 *
 *    import BuildTask from 'carbon-factory/lib/gulp/build';
 *    gulp.task('default', BuildTask());
 *
 * You can also pass a hash of options to customise the task:
 *
 *    import BuildTask from 'carbon-factory/lib/gulp/build';
 *
 *    var opts = {
 *      src: "./src/main.js",
 *      jsDest: "./assets/javascripts",
 *      jsFile: "app.js"
 *    }
 *
 *    gulp.task('default', BuildTask(opts));
 *
 * If you have setup the task using the task name 'default' then you can run it
 * through the command line like this:
 *
 *    gulp
 *
 * The process can also be ran with specific handlers:
 *
 *    gulp --handler uki
 *
 * This will include a module named `carbon-handler-uki` in the build process.
 */

import gulp from 'gulp';
import gutil from 'gulp-util';
import babel from 'babelify';
import aliasify from 'aliasify';
import watchify from 'watchify';
import browserify from 'browserify';
import parcelify from 'parcelify';
import sassCssStream from 'sass-css-stream';
import source from 'vinyl-source-stream';
import yargs from 'yargs';
import mkdirp from 'mkdirp';
import notifier from 'node-notifier';

var argv = yargs.argv;

export default function (opts) {
  var opts = opts || {},
      // the entrypoint for the JavaScript application
      src = opts.src || './src/main.js',
      // the destination directory for the generated code
      jsDest = opts.jsDest || './assets/javascripts',
      // the destination file for the generated code
      jsFile = opts.jsFile || 'ui.js',
      // the destination for the css file
      cssDest = opts.cssDest || './assets/stylesheets',
      // the filename to write the css to
      cssFile = opts.cssFile || 'ui.css',
      // the destination for any fonts
      fontDest = opts.fontDest || './assets/fonts',
      // a standalone param to expose components globally
      standalone = opts.standalone || null;

  // handles any errors and exits the task
  function handleError(err) {
    console.error(err.toString());
    process.stdout.write('\x07');
    this.emit('end');
  }

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }
  if(error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber;
  }
  notifier.notify({title: title, message: message});
};


  // a handler argument if supplied one when running the task
  var handler = argv.handler;

  /**
   * Babel options (for JS/JSX).
   */
  var babelTransform = babel.configure({
    // use experimental es7 class properties
    optional: [ "es7.classProperties" ]
  });

  /**
   * Alias options (to include handler specific JS).
   */
  var aliasTransform = null;

  if (handler) {
    aliasTransform = aliasify.configure({
      aliases: {
        // make it possible to import the original handler if `carbon-handler`
        // is aliased to get something else
        "base-handler": "./src/carbon-handler",
        // if using a handler, alias any imports of `carbon-handler` to use
        // the handler instead
        "carbon-handler": "carbon-handler-" + handler
      }
    });
  }

  /**
   * Browserify options (for CommonJS).
   */
  var browserifyOpts = {
    // the entry points for the application
    entries: [ src ],
    // which transforms to apply to the code
    transform: [ babelTransform, aliasTransform ],
    // lookup paths when importing modules
    paths: [ './src' ]
  };

  if (standalone) {
    browserifyOpts.standalone = standalone;
  }

  var browserified = browserify(browserifyOpts);


  // create dirs for assets
  mkdirp(fontDest, function (err) {
    if (err) console.error(err);
  });
  mkdirp(cssDest, function (err) {
    if (err) console.error(err);
  });

  /**
   * Parcelify options (for Sass/CSS).
   */
  var parcelified = parcelify(browserified, {
    // watch scss files to update on any changes
    watch: true,
    // where to bundle the output
    bundles: {
      style: cssDest + '/' + cssFile,
      fonts: null
    },
    appTransforms : [
      // sass transformer
      function sassTransformer( file ) {
        // array of include paths allows for overriding entire files
        return sassCssStream( file, {
          includePaths: [
            process.cwd() + "/src/style-config", // check for overrides in local style-config directory
            process.cwd() + "/node_modules/carbon/lib/style-config", // check for original config files
            process.cwd() + "/node_modules" // generic namespace for any other lookups
          ]
        });
      }
    ],
    // where to apply transforms
    appTransformDirs: ['./node_modules/carbon', './']
  }).on('done', function() {
    // when parcelify is ready
    console.log('assets are compiled!');
  }).on('error', function(err) {
    // handle error
    handleError.call(this, err);
  }).on('bundleWritten', function(path, name, parcel) {
    // copy the fonts to the correct directory
    var fonts = [];
    parcel.parcelAssetsByType.fonts.forEach((font) => {
      fonts.push(font.srcPath);
    });
    gulp.src(fonts)
      .pipe(gulp.dest(fontDest));

    // write the css file
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
      .on('error', notify)
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(jsFile))
      .pipe(gulp.dest(jsDest));
  };

  // run the build immediately and whenever the bundler updates
  bundler.on('update', build);
  build();
};
