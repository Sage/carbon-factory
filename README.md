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

* From your project directory, run the `component` command with the name of your component.

```bash
carbon component textbox
```

## Gulp

Carbon Factory provides [Gulp](http://gulpjs.com/) tasks to help compile assets for your application. If you set up your project using the `prepare` command, you should already have a `gulpfile.js` using the appropriate Gulp tasks.

To run Gulp, run it from your project directory (this will do an initial build of your assets, and continue watching for any changes):

```bash
gulp
```

## See if it works

With gulp compiling your assets, you should be able to run a simple web server from your project (`python -m SimpleHTTPServer`) and navigate to [http://localhost:8000/](http://localhost:8000/) in your browser. You can add additional routes to your project in `/src/main.js` using any new components you build.

## Running Tests

In development, you can run tests by using Gulp.

```bash
gulp test
```

This will run the tests using PhantomJS and automatically watch for any file changes to run the tests again.

You can also run the tests as a single run.

```bash
gulp test --build
```

After running the tests, it will exit along with a coverage report. This is useful for CI and automated build tasks.

### Additional Options for Running Tests

You can run tests in the browser by passing the `-b` param to the Gulp task.

```bash
gulp test -b chrome
```

We currently support Chrome, Safari and Firefox. Alternatively you can run the tests across all browsers at once.

```bash
gulp test -b all
```

You may also want to run coverage tests while in development mode. This is possible, but it compiles the code differently meaning it is more difficult to debug.

```bash
gulp test --coverage
```

## Further Configuration

The following shows how you can use the Gulp tasks provided with Carbon Factory:

```js
// gulpfile.js

import gulp from 'gulp';
import BuildTask from 'carbon-factory/lib/gulp/build';
import SpecTask from 'carbon-factory/lib/gulp/spec';

gulp.task('default', BuildTask());
gulp.task('test', SpecTask());
```

You can also pass options to each task:

```js
// gulpfile.js

import gulp from 'gulp';
import BuildTask from 'carbon-factory/lib/gulp/build';

var opts = {
  src: './src/main.js', // the entry point for your application
  dest: './tmp', // the destination directory
  file: 'ui.js' // the file to output to 
};

// Tasks are available on the `Factory.gulp` object
gulp.task('default', BuildTask(opts));
```

## Standalone Packages (globally available components)

The default configuration is for the application to compile in a modular format - CommonJS. This is a format used by Node.js, and we compile our code for the browser using Browserify. This is great for compiling encapsulated modules, but there may be cases where you want to use Carbon components globally. For example you may want to access them in the web console like this:

```
Carbon.Textbox
```

To create a 'standalone' package, you need to do two things. First of all create an entrypoint which will define which components you want to expose to the browser:

```js
// entry.js

var expose = {
  React: require('react'),
  ReactDOM: require('react-dom'),
  Textbox: require('carbon/lib/components/textbox'),
  Date: require('carbon/lib/components/date')
}

export default expose;
```

This file requires all of the modules you want, and makes them available on a JavaScript object (we recommend you also expose React and ReactDOM).

The second step is to modify the Gulp build task to compile a standalone package:

```
// gulpfile.js

import gulp from 'gulp';
import BuildTask from 'carbon-factory/lib/gulp/build';

var opts = {
  src: './entry.js', // point the src to your entry file
  standalone: 'Carbon' // define the globally accessible namespace
};

gulp.task('default', BuildTask(opts));
```

Once you have updated your Gulp task, when you run `gulp` it will compile your assets. You can then access the components you exposed using the `Carbon` namespace.

The following is an example of how to use the standalone package to render a component on the page:

```js
Carbon.ReactDOM.render(
  Carbon.React.createElement(Carbon.Date, {
    name: 'foo',
    defaultValue: '2015-12-01'
  }),
  document.getElementById('app')
);
```
