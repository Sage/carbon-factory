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

import aliasify from 'aliasify';
import babel from 'babelify';
import browserify from 'browserify';
import gulp from 'gulp';
import gutil from 'gulp-util';
import mkdirp from 'mkdirp';
import notifier from 'node-notifier';
import envify from 'envify/custom';
import sassCssStream from 'sass-css-stream';
import source from 'vinyl-source-stream';
import watchify from 'watchify';
import yargs from 'yargs';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify';
import streamify from 'gulp-streamify';
import lrload from 'livereactload';

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
        // a standalone param to expose components globally
        standalone = opts.standalone || null,
        // if single build, or run and watch
        watch = (argv.build === undefined),
        // if in production mode
        production = argv.production || false;

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
      this.emit('end');
    }

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
     * Envify options (sets env options when compiling code).
     */
    var envifyTransform = envify({
      global: true,
      _: 'purge',
      NODE_ENV: process.env.NODE_ENV
    });

    /**
     * Browserify options (for CommonJS).
     */
    var browserifyOpts = {
      // the entry points for the application
      entries: [ src ],
      // which transforms to apply to the code
      transform: [ babelTransform, aliasTransform, envifyTransform ],
      plugin: [ lrload ],
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
     * The pack we are going to watch and build
     */
    var bundler = watch ? watchify(browserified) : browserified;

    /**
     * The main build task.
     */
    function build(f) {
      if (f) gutil.log('Recompiling ' + f);
      return bundler
        .bundle()
        .on('error', () => gutil.log("*** Browserify Error ***"))
        .on('error', handleError)
        .pipe(source(jsFile))
        .pipe(gulpif(production, streamify(uglify())))
        .pipe(gulp.dest(jsDest));
    };

    // run the build immediately and whenever the bundler updates
    bundler.on('update', build);
    build();
  }
};
