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
 *      jsFile: "app.js",
 *      additionalSassTransformDirs: ['./node_modules/my-custom-package']
 *    }
 *
 *    gulp.task('default', BuildTask(opts));
 *
 * If you have setup the task using the task name 'default' then you can run it
 * through the command line like this:
 *
 *    gulp
 *
 * The process can also be ran without watch files for changes (useful for running single builds):
 *
 *    gulp --build
 *
 * The process can also be ran with specific handlers:
 *
 *    gulp --handler uki
 *
 * This will include a module named `carbon-handler-uki` in the build process.
 */

import './utils/fs-patch';
import aliasify from 'aliasify';
import browserify from 'browserify';
import gulp from 'gulp';
import gutil from 'gulp-util';
import mkdirp from 'mkdirp';
import notifier from 'node-notifier';
import parcelify from 'parcelify';
import envify from 'envify/custom';
import sassCssStream from 'sass-css-stream';
import source from 'vinyl-source-stream';
import watchify from 'watchify';
import tsify from 'tsify';
import yargs from 'yargs';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify';
import urlAdjuster from 'gulp-css-replace-url';
import cleanCSS from 'gulp-clean-css';
import gulpGzip from 'gulp-gzip';
import streamify from 'gulp-streamify';
import livereactload from 'livereactload';
import { Spinner } from 'cli-spinner';

var argv = yargs.argv;

export default function (opts) {
  var options = opts;

  return function() {
    var opts = options || {},
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
        // the destination for any images
        imageDest = opts.imageDest || './assets/images',
        // define directories in which to apply sass transforms
        additionalSassTransformDirs = ['./node_modules/carbon-react', './'],
        // a standalone param to expose components globally
        standalone = opts.standalone || null,
        // if single build, or run and watch
        watch = (argv.build === undefined),
        // if using typescript
        typescript = opts.typescript || false,
        // if in production mode
        production = argv.production || false,
        // if uglify requested
        doUglify = (opts.uglify !== false),
        // if gzip requested
        gzip = (opts.gzip !== false),
        // url to rebase asset paths to in the css file
        assetsUrl = argv.assetsUrl,
        // array of modules to apply babel transforms to
        babelTransforms = opts.babelTransforms || [],
        // array of additional paths/directories to lookup modules from
        additionalLookups = opts.additionalLookups || [],
        // enable sourcemaps (enabled for watch mode by default)
        sourcemaps = watch;

    if (argv.sourcemaps === 'false') {
      sourcemaps = false;
    } else if (argv.sourcemaps) {
      sourcemaps = true;
    }

    if (opts.additionalSassTransformDirs) {
      // define directories in which to apply sass transforms
      additionalSassTransformDirs = additionalSassTransformDirs.concat(opts.additionalSassTransformDirs);
    }

    if (production) {
      process.env.NODE_ENV = 'production';
    }

    // handles any errors and exits the task
    function handleError(err) {
      // placeholder for toast notification message
      var notifierMessage = '';
      var message = err.message;

      // if location in file available
      if (err.loc) {
        var position = "\nLine: "   + err.loc.line
                     + "\nColumn: " + err.loc.column;
        notifierMessage += position;
        message += position;
      }

      // if code context available
      if (err.codeFrame) {
        message += "\n" + err.codeFrame;
      }

      // additional toast notification variables
      var title = 'Error: '

      // format file path
      if (err.filename) {
        var file = err.filename.split('/');
        title += file[file.length-1];
      }

      // output error messages in toast and in console
      notifier.notify({ title: title, message: notifierMessage } );
      gutil.log(gutil.colors.red(err.name), message);

      // exit task
      if (watch) {
        this.emit('end');
      } else {
        process.exit(1);
      }
    }

    // a handler argument if supplied one when running the task
    var handler = argv.handler;

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
     * Envify options (sets env options when compiling code).
     */
    var envifyTransform = envify({
      _: 'purge',
      NODE_ENV: process.env.NODE_ENV
    });

    var lookups = [ './src', process.cwd() + '/node_modules' ].concat(additionalLookups);

    /**
     * Browserify options (for CommonJS).
     */
    var browserifyOpts = {
      // the entry points for the application
      entries: [ src ],
      // which transforms to apply to the code
      transform: [ aliasTransform ],
      // lookup paths when importing modules
      paths: lookups,
      // enable/disable sourcemaps
      debug: sourcemaps,

      // Caching for watchify see:
      // https://github.com/substack/watchify/blob/v3.7.0/readme.markdown#watchifyb-opts
      cache: {},
      packageCache: {}
    };

    var plugins = []

    if (watch && argv.hot) {
      plugins.push(livereactload);
    }

    if (typescript) {
      plugins.push(tsify);
    }

    browserifyOpts.plugin = plugins;

    if (standalone) {
      browserifyOpts.standalone = standalone;
    }

    var babelTransformOptions = {
      extends: process.cwd() + '/node_modules/carbon-factory/.babelrc'
    };

    if (babelTransforms.length) {
      var only = "^((?!node_modules).";

      babelTransforms.forEach((module) => {
        only += "|(node_modules\/" + module + ")";
      });

      only += ")*$";

      babelTransformOptions.global = true;
      babelTransformOptions.only = new RegExp(only);
      babelTransformOptions.babelrc = false;
    }

    var browserified = browserify(browserifyOpts)
                       .transform("babelify", babelTransformOptions)
                       .transform(envifyTransform, { global: true });

    // create dirs for assets
    mkdirp(fontDest, function (err) {
      if (err) console.error(err);
    });
    mkdirp(imageDest, function (err) {
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
      watch: watch,
      // where to bundle the output
      bundles: {
        style: cssDest + '/' + cssFile,
        fonts: null,
        images: null
      },
      appTransforms : [
        // sass transformer
        function sassTransformer( file ) {
          // array of include paths allows for overriding entire files
          return sassCssStream( file, {
            includePaths: [
              process.cwd() + "/src/style-config", // check for overrides in local style-config directory
              process.cwd() + "/node_modules/carbon-react/lib/style-config", // check for original config files
              process.cwd() + "/node_modules" // generic namespace for any other lookups
            ]
          });
        }
      ],
      // where to apply transforms
      appTransformDirs: additionalSassTransformDirs
    }).on('done', function() {
      // when parcelify is ready
      gutil.log(gutil.colors.green("Assets are compiled!"));

      if (watch) {
        gutil.log("Gulp is now watching and will rebuild your code when it detects any file changes...");
      }
    }).on('error', function(err) {
      // handle error
      gutil.log("*** CSS Error ***");
      handleError.call(this, err);
    }).on('bundleWritten', function(path, name, parcel) {
      // copy the fonts to the correct directory
      var fonts = [];
      parcel.parcelAssetsByType.fonts.forEach((font) => {
        fonts.push(font.srcPath);
      });
      gulp.src(fonts)
        .pipe(gulpif(production && gzip, gulpGzip({ append: false })))
        .pipe(gulp.dest(fontDest));

      // copy the images to the correct directory
      var images = [];
      parcel.parcelAssetsByType.images.forEach((image) => {
        images.push(image.srcPath);
      });
      gulp.src(images)
        .pipe(gulp.dest(imageDest));

      // write the css file
      return gulp.src(cssDest + '/' + cssFile)
        .pipe(gulpif(assetsUrl, urlAdjuster({ prepend: assetsUrl })))
        .pipe(cleanCSS())
        .pipe(gulpif(production && gzip, gulpGzip({ append: false })))
        .pipe(gulp.dest(cssDest));
    });

    /**
     * The pack we are going to watch and build
     */
    var bundler = watch ? watchify(browserified) : browserified;

    /**
     * The main build task.
     */
    function build(f) {
      f = f ? f[0].replace(process.cwd(), '') : null;
      var message = f ? 'Recompiling ' : 'Precompiling ';
      message = gutil.colors.green(message);
      message += '(please wait)';
      var spinner = new Spinner('%s ' + message);
      spinner.setSpinnerString(18);

      if (!f) {
        // if on init, use small timeout to give a bit leeway
        setTimeout(() => {
          spinner.start();
        }, 10);
      } else {
        gutil.log(gutil.colors.yellow('File changed: ') + f);
        spinner.start();
      }

      return bundler
        .bundle()
        .on('error', (error) => { gutil.log("*** Browserify Error ***"); console.log(error) })
        .on('error', handleError)
        .pipe(source(jsFile))
        .pipe(gulpif(production && doUglify, streamify(uglify())))
        .pipe(gulpif(production && gzip, gulpGzip({ append: false })))
        .pipe(gulp.dest(jsDest))
        .on('end', () => {
          spinner.stop(true);
          if (f) {
            gutil.log(gutil.colors.green('Recompiled: ') + f);
          }
        });
    };

    // run the build immediately and whenever the bundler updates
    bundler.on('update', build);
    build();
  }
};
