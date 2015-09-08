# Carbon Factory

Tools to help create user interfaces with [Carbon](https://github.com/sage/carbon) and [React](http://facebook.github.io/react/).

## Installation

Follow the instructions in the wiki for [First Time System Setup](https://github.com/Sage/carbon-factory/wiki/First-Time-System-Setup).

## Command Line Interface

Carbon Factory provides a CLI to generate files.

### Prepare Project

* To create a project run the `prepare` command with the name of your project.

```bash
carbon prepare myapp
```

### Create a Component

* From your UI directory, run the `component` command with the name of your component.

```bash
carbon component textbox
```

## Gulp

Carbon Factory provides [Gulp](http://gulpjs.com/) tasks to help compile assets for your application. If you set up your project using the `prepare` command, you should already have a `gulpfile.js` using the appropriate Gulp tasks.

To run Gulp, run it from your UI directory:

```bash
gulp
```

The following shows how you can use the Gulp tasks provided with Carbon Factory:

```js
// gulpfile.js

var gulp = require('gulp');
var Factory = require('carbon-factory');

// Tasks are available on the `Factory.gulp` object
gulp.task('default', Factory.gulp.default());
```

You can also pass options to each task:

```js
// gulpfile.js

var gulp = require('gulp');
var Factory = require('carbon-factory');

var opts = {
  src: './src/main.js', // the entry point for your application
  dest: './tmp', // the destination directory
  file: 'ui.js' // the file to output to 
};

// Tasks are available on the `Factory.gulp` object
gulp.task('default', Factory.gulp.default(opts));
```
