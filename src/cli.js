#! /usr/bin/env node

var program = require('commander');

// defines the commands you can run from the command line, each command has a
// corresponding file named with the command name prefixed with carbon.

program
  .version('0.0.0')
  .command('app [name]', 'Builds the basic structure for a Carbon based application.')
  .command('standalone [name]', 'Builds the basic structure for standalone Carbon assets.')
  .command('component [name]', 'Builds a React component.')
  .parse(process.argv);
