#!/usr/bin/env node

var promptly = require('promptly');
var program = require('commander');

var CreatePackage = require('./prep-tasks/create-package');
var CreateGulpfile = require('./prep-tasks/create-gulpfile');
var CreateAppStructure = require('./prep-tasks/create-app-structure');
var CreateMain = require('./prep-tasks/create-main');
var InstallNodeModules = require('./prep-tasks/install-node-modules');

program.parse(process.argv);

var name = program.args[0];

if (!name) {
  console.error('Please provide a name for your application.');
  process.exit(1);
}

var confirmMessage = 'This will override any existing files that may be in this directory. Do you want to continue?';

promptly.confirm(confirmMessage, function (err, value) {
  if (!value) {
    process.exit(1);
  }

  if (value) {
    CreatePackage(name);
    CreateGulpfile();
    CreateAppStructure();
    CreateMain();
    InstallNodeModules();
  }
});
