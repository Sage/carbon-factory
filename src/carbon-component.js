#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var promptly = require('promptly');
var S = require('string');
var mkdirp = require('mkdirp');

program.parse(process.argv);

var name = program.args[0];

if (!name) {
  console.error('Please provide a name for your component.');
  process.exit(1);
}

var moduleName = S(name).capitalize().camelize().s;
var className = S(name).dasherize().s;

promptly.confirm('This will create a component at \'' + process.cwd() + '/src/components/' + moduleName + '/\'. Do you want to continue?', function (err, value) {
  if (!value) {
    process.exit(1);
  } else {
    console.log('Creating component...');

    // add to index.js
    fs.readFile('./src/components/index.js', 'utf8', function (err, data) {
      var result = data
          .replace(/};/g, "  " + moduleName + ": require('./" + moduleName + "'),\n};");

      fs.writeFile('./src/components/index.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });

    // create directory
    mkdirp('./src/components/' + moduleName, function (err) {
      if (err) console.error(err);
    });

    // create file
    fs.readFile(__dirname + '/prep-tasks/tpl/component.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      var result = data
          .replace(/MODULENAME/g, moduleName)
          .replace(/CLASSNAME/g, className);

      fs.writeFile('./src/components/' + moduleName + '/index.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });

    // create spec file
    fs.readFile(__dirname + '/prep-tasks/tpl/component.spec.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      var result = data
          .replace(/MODULENAME/g, moduleName);

      fs.writeFile('./src/components/' + moduleName + '/__spec__.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
});
