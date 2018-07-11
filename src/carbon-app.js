#!/usr/bin/env node

var promptly = require('promptly');
var program = require('commander');

// script to build the app structure
var CreateAppStructure = require('./prep-tasks/create-app-structure');

// parses any arguments passed to the command
program.parse(process.argv);
var name = program.args[0];

if (!name) {
  // a name is required for the command
  console.error('Please provide a name for your application.');
  process.exit(1);
}

async function PromptCreateDirectory() {
  // ensure this will create the module at the correct location before continuing
  var confirmMessage = 'This will prepare your project at \'' + process.cwd() + '/' + name + '\'. Do you want to continue?';

  var value = await promptly.confirm(confirmMessage, )

  console.log('About to check value');

  if (!value) {
    console.error('About to exit');
    process.exit(1);
  }

  if (value) {
    console.log('CreateAppStructure');
    // if confirmed, build the module step by step
    CreateAppStructure(name);
  }
}

PromptCreateDirectory();



