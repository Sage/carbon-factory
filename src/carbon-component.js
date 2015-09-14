#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var promptly = require('promptly');
var S = require('string');

program.parse(process.argv);

var name = program.args[0];

if (!name) {
  console.error('Please provide a name for your component.');
  process.exit(1);
}

var moduleName = S(name).capitalize().camelize().s;
var className = S(name).dasherize().s;

promptly.confirm('This will create a component at \'' + process.cwd() + '/src/components/' + moduleName + '.js\'. Do you want to continue?', function (err, value) {
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

    // create file
    fs.readFile(__dirname + '/prep-tasks/tpl/component.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      var result = data
          .replace(/MODULENAME/g, moduleName)
          .replace(/CLASSNAME/g, className);

      fs.writeFile('./src/components/' + moduleName + '.js', result, 'utf8', function (err) {
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

      fs.writeFile('./spec/components/' + moduleName + '.spec.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
});
