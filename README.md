# Carbon Factory

Tools to help create user interfaces with [Carbon](https://github.com/sage/carbon) and [React](http://facebook.github.io/react/).

## Installation

* Install [Node.js](https://nodejs.org/).
* Install Carbon Factory globally

```bash
npm install sage/carbon-factory -g
```

## Command Line Interface

Carbon Factory provides a CLI to generate files.

### Prepare Application

* Create a directory for your UI in the root of your application.
* From your UI directory, run the `prepare` command with the name of your application.

```bash
carbon prepare myapp
```

### Create a Component

* From your UI directory, run the `component` command with the name of your component.

```bash
carbon component textbox
```

## Gulp

Carbon Factory provides [Gulp](http://gulpjs.com/) tasks to help compile assets for your application. If you set up your application using the `prepare` command, you should already have a `gulpfile.js` using the appropriate Gulp tasks.

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
  dest: './public/javascripts', // the destination directory
  output: 'application.js' // the file to output to 
};

// Tasks are available on the `Factory.gulp` object
gulp.task('default', Factory.gulp.default(opts));
```
