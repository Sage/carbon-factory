# Standard Build

## Creating a Standard Build

If you have installed the carbon factory CLI you can run a command to setup a standard project:

```
carbon app myapp
```

After setting up your project, make sure you install its dependencies by running `npm install` from inside the projects root directory.

## Compiling Your Build

Carbon Factory provides [Gulp](http://gulpjs.com/) tasks to help compile assets for your application. If you set up your project using the `app` command, you should already have a `gulpfile.js` using the appropriate Gulp tasks.

To run Gulp, run it from your project directory (this will do an initial build of your assets, and continue watching for any changes):

```bash
gulp
```

### Further Configuration

The following shows how you can modify the Gulp build task provided with Carbon Factory:

```js
// gulpfile.js

import gulp from 'gulp';
import BuildTask from 'carbon-factory/lib/gulp/build';

gulp.task('default', BuildTask());
```

You can also pass options to each task:

```js
// gulpfile.js

import gulp from 'gulp';
import BuildTask from 'carbon-factory/lib/gulp/build';

var opts = {
  src: './src/main.js', // the entry point for your application
  jsDest: './tmp', // the destination directory
  jsFile: 'ui.js', // the file to output to 
  cssDest: './tmp', // the destination directory
  cssFile: 'ui.css' // the file to output to 
};

gulp.task('default', BuildTask(opts));
```
