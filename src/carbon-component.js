#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var promptly = require('promptly');

program.parse(process.argv);

var name = program.args[0];

if (!name) {
  console.error('Please provide a name for your component.');
  process.exit(1);
}

promptly.confirm('This will create a component at \'' + process.cwd() + '/src/components/' + name + '.js\'. Do you want to continue?', function (err, value) {
  if (!value) {
    process.exit(1);
  } else {
    console.log('Creating component...');

    var parsedName = name.charAt(0).toUpperCase() + name.slice(1);

    // add to index.js
    fs.readFile('./src/components/index.js', 'utf8', function (err, data) {
      var result = data
          .replace(/};/g, "  " + parsedName + ": require('./" + name + "'),\n};");

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
          .replace(/TMPNAME/g, parsedName)
          .replace(/CLASSNAME/g, name);

      fs.writeFile('./src/components/' + name + '.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
});
