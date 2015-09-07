#! /usr/bin/env node

var program = require('commander');

program
  .version('0.0.0')
  .command('prepare [name]', 'Builds the basic structure for a Carbon based UI.')
  .command('component [name]', 'Builds a React component.')
  .parse(process.argv);
