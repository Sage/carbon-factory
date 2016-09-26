// Karma configuration
import yargs from 'yargs';
var argv = yargs.argv;

module.exports = function(config) {
    var logLevel = '';
    // Set logger level for console output
    if (argv.debug) {
      logLevel = config.LOG_DEBUG
    } else {
      logLevel = config.LOG_INFO
    }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine-ajax', 'jasmine', 'es5-shim'],


    // list of files to exclude
    exclude: [
    ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: logLevel
  })
}
