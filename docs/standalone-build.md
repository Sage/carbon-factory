# Standalone Packages (globally available components)

The default configuration is for the application to compile in a modular format - CommonJS. This is a format used by Node.js, and we compile our code for the browser using Browserify. This is great for compiling encapsulated modules, but there may be cases where you want to use Carbon components globally. For example you may want to access them in JavaScript like this:

```js
Carbon.ReactDOM.render(
  Carbon.React.createElement(Carbon.Date, {
    name: 'foo',
    defaultValue: '2015-12-01'
  }),
  document.getElementById('app')
);
```

## Using the Carbon CLI

If you have installed the carbon factory CLI you can run a command to setup a standalone project for you:

```
carbon standalone myapp
```

## Setting this up manually

To manually create a 'standalone' package, you need to do two things. First of all create an entrypoint which will define which components you want to expose to the browser:

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

```js
// gulpfile.js

var gulp = require('gulp');
var BuildTask = require('carbon-factory/lib/gulp/build');

var opts = {
  src: './entry.js', // point the src to your entry file
  standalone: 'Carbon' // define the globally accessible namespace
};

gulp.task('default', BuildTask(opts));
```

Once you have updated your Gulp task, when you run `gulp` it will compile your assets. You can then access the components you exposed using the `Carbon` namespace.
