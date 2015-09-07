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
  }

  if (value) {
    fs.readFile(__dirname + '/prep-tasks/tpl/component.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      parsedName = name.charAt(0).toUpperCase() + name.slice(1);

      var result = data.replace(/TMPNAME/g, parsedName);

      fs.writeFile('./src/components/' + name + '.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('Built a component!');
      });
    });
  }
});
