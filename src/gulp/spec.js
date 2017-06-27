var exec = require('child_process').exec;
var gulp = require('gulp');
var jest = require('jest-cli');
var yargs = require('yargs');
// var jest = require('gulp-jest').default;
// var shell = require('gulp-shell');
// var exec = require('child_process').exec;
// var spawn = require('child_process').spawn;

var jestConfig = {
  testMatch: [ "**/__spec__.js" ],
  moduleDirectories: [ "node_modules", "src" ],
  collectCoverage: true,
  coverageReporters: [ 'text-summary', 'html' ],
  coverageDirectory: process.cwd() + '/coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}

var argv = yargs.argv;

export default function(opts) {
  var options = opts;

  // TODO: get this to run a full build (linting, specs, coverage, etc)
  return function(done) {
    var files = '.' || argv.file

    jest.runCLI({ config : jestConfig }, files, function() {
      done();
    });
  }
}

gulp.task('jest', function() {

});
