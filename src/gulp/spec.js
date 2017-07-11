var gulp = require('gulp');
var jest = require('jest-cli');
var yargs = require('yargs');
var lint = require('./lint').default;
var exec = require('child_process').exec;

gulp.task('lint', lint);

console.log(process.cwd());

// Config Options https://facebook.github.io/jest/docs/configuration.html
var baseJestConfig = {
  preset: __dirname + "/jest.conf.json"
}

var argv = yargs.argv;

export default function(opts) {
  var config = Object.assign({}, baseJestConfig, opts.jestConfig);
  console.log("CONFIG: ----:", config);
  var cliOptions = { watch: true, onlyChanged: true, config: config }

  if (argv.build) {
    gulp.start('lint');
    cliOptions = { config: config }
  }

  // TODO: Can we pass more arguments here to jestCli
  return function(done) {
    // https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js
    jest.runCLI(cliOptions, '.', function() {
      done();
    });
  }
}
