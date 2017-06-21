var exec = require('child_process').exec;
var gulp = require('gulp');
var jest = require('gulp-jest').default;
var shell = require('gulp-shell');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

export default function(opts) {
  // TODO: get this to run a full build (linting, specs, coverage, etc)
  return function(cb) {
    var bat = spawn('"jest"', [], { shell: true });

    bat.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    bat.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
    });
    // var e = exec('jest --watch', function (err, stdout, stderr) {
    //   console.log(stdout);
    //   console.log(stderr);
    //   cb(err);
    // });

    // e.stdout.on('data', function(data) {
    //     console.log(data); 
    // });
  }
}
