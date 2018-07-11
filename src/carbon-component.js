#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var promptly = require('promptly');
var S = require('string');
var mkdirp = require('mkdirp');
var createDirectory = require('./utils/createDirectory');
var clone = require('./utils/clone');

// parses any arguments passed to the command
program.parse(process.argv);
var name = program.args[0];

if (!name) {
  // a name is required for the command
  console.error('Please provide a name for your component.');
  process.exit(1);
}


async function PromptCreateModule() {
  var moduleName = S(name).capitalize().camelize().s;
  var fileName = S(name).dasherize().s;

  // ensure this will create the module at the correct location before continuing
  var confirmMessage = 'This will create a component at \'' + process.cwd() + '/src/components/' + fileName + '/\'. Do you want to continue?';
  var value = await promptly.confirm(confirmMessage);
  
  if (!value) {
    process.exit(1);
  } else {
    var transform = function(data) {
      data = data.replace(/MODULENAME/g, moduleName);
      data = data.replace(/FILENAME/g, fileName);
      return data
    };

    // create directory
    createDirectory('', 'src/components/' + fileName);

    function writeFiles() {
      var fullPath = fileName + '/' + fileName + '.js';

      clone('', '/../tpl/component.js', 'src/components/' + fullPath, transform);
      clone('', '/../tpl/component.spec.js', 'src/components/' + fileName + '/__spec__.js', transform);
      clone('', '/../tpl/component-package.js', 'src/components/' + fileName + '/package.json', transform);
    };

    // wait 200ms to ensure the directories have finished being built
    // (could use promise instead?)
    setTimeout(writeFiles, 200);
  }
}

PromptCreateModule();

