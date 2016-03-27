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

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _aliasify = require('aliasify');

var _aliasify2 = _interopRequireDefault(_aliasify);

var _babelify = require('babelify');

var _babelify2 = _interopRequireDefault(_babelify);

var _browserify = require('browserify');

var _browserify2 = _interopRequireDefault(_browserify);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _nodeNotifier = require('node-notifier');

var _nodeNotifier2 = _interopRequireDefault(_nodeNotifier);

var _envifyCustom = require('envify/custom');

var _envifyCustom2 = _interopRequireDefault(_envifyCustom);

var _sassCssStream = require('sass-css-stream');

var _sassCssStream2 = _interopRequireDefault(_sassCssStream);

var _vinylSourceStream = require('vinyl-source-stream');

var _vinylSourceStream2 = _interopRequireDefault(_vinylSourceStream);

var _watchify = require('watchify');

var _watchify2 = _interopRequireDefault(_watchify);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _gulpIf = require('gulp-if');

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _gulpUglify = require('gulp-uglify');

var _gulpUglify2 = _interopRequireDefault(_gulpUglify);

var _gulpStreamify = require('gulp-streamify');

var _gulpStreamify2 = _interopRequireDefault(_gulpStreamify);

var _livereactload = require('livereactload');

var _livereactload2 = _interopRequireDefault(_livereactload);

var argv = _yargs2['default'].argv;

exports['default'] = function (opts) {
  var options = opts;

  return function () {
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

    // define directories in which to apply sass transforms
    additionalSassTransformDirs = ['./node_modules/carbon', './'],

    // a standalone param to expose components globally
    standalone = opts.standalone || null,

    // if single build, or run and watch
    watch = argv.build === undefined,

    // if in production mode
    production = argv.production || false;

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
        var position = "\nLine: " + err.loc.line + "\nColumn: " + err.loc.column;
        notifierMessage += position;
        message += position;
      }

      // if code context available
      if (err.codeFrame) {
        message += "\n" + err.codeFrame;
      }

      // additional toast notification variables
      var title = 'Error: ';

      // format file path
      if (err.filename) {
        var file = err.filename.split('/');
        title += file[file.length - 1];
      }

      // output error messages in toast and in console
      _nodeNotifier2['default'].notify({ title: title, message: notifierMessage });
      _gulpUtil2['default'].log(_gulpUtil2['default'].colors.red(err.name), message);

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
     * Babel options (for JS/JSX).
     */
    var babelTransform = _babelify2['default'].configure({
      // use experimental es7 class properties
      optional: ["es7.classProperties"]
    });

    /**
     * Alias options (to include handler specific JS).
     */
    var aliasTransform = null;

    if (handler) {
      aliasTransform = _aliasify2['default'].configure({
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
    var envifyTransform = (0, _envifyCustom2['default'])({
      global: true,
      _: 'purge',
      NODE_ENV: process.env.NODE_ENV
    });

    /**
     * Browserify options (for CommonJS).
     */
    var browserifyOpts = {
      // the entry points for the application
      entries: [src],
      // which transforms to apply to the code
      transform: [babelTransform, aliasTransform, envifyTransform],
      plugin: [_livereactload2['default']],
      // lookup paths when importing modules
      paths: ['./src'],

      // Caching for watchify see:
      // https://github.com/substack/watchify/blob/v3.7.0/readme.markdown#watchifyb-opts
      cache: {},
      packageCache: {}
    };

    if (standalone) {
      browserifyOpts.standalone = standalone;
    }

    var browserified = (0, _browserify2['default'])(browserifyOpts);

    // create dirs for assets
    (0, _mkdirp2['default'])(fontDest, function (err) {
      if (err) console.error(err);
    });
    (0, _mkdirp2['default'])(cssDest, function (err) {
      if (err) console.error(err);
    });

    /**
     * The pack we are going to watch and build
     */
    var bundler = watch ? (0, _watchify2['default'])(browserified) : browserified;

    /**
     * The main build task.
     */
    function build(f) {
      if (f) _gulpUtil2['default'].log('Recompiling ' + f);
      return bundler.bundle().on('error', function () {
        return _gulpUtil2['default'].log("*** Browserify Error ***");
      }).on('error', handleError).pipe((0, _vinylSourceStream2['default'])(jsFile)).pipe((0, _gulpIf2['default'])(production, (0, _gulpStreamify2['default'])((0, _gulpUglify2['default'])()))).pipe(_gulp2['default'].dest(jsDest));
    };

    // run the build immediately and whenever the bundler updates
    bundler.on('update', build);
    build();
  };
};

;
module.exports = exports['default'];