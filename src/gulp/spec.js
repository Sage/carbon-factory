var gulp = require('gulp');
var jest = require('jest-cli');
var yargs = require('yargs');

// TODO: Replace with file load ?
// Config Options https://facebook.github.io/jest/docs/configuration.html
var baseJestConfig = {
  testMatch: [ "**/__spec__.js" ],
  moduleDirectories: [ "node_modules", "src" ],
  collectCoverage: true,
  coverageReporters: [ 'text-summary', 'html' ],
  coverageDirectory: process.cwd() + '/coverage',
  notify: true,
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

// TODO: get this to run a full build (linting, specs, coverage, etc)
export default function(opts) {
  // TODO: Replace with file load ?
  var config = Object.assign({}, baseJestConfig, opts.jestConfig);

  var watch = argv.build ? false : true;

  return function(done) {
    // https://github.com/facebook/jest/blob/master/packages/jest-cli/src/cli/index.js
    jest.runCLI({ watchAll: watch, config: config }, '.', function() {
      done();
    });
  }
}
