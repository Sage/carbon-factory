# 1.0.6

* Change order of babelify, envify transforms to fix parsing error with `process.env.NODE_ENV`

# 1.0.5

* Change package used for coverage reporting to babel-plugin-istanbul to allow `istanbul ignore`

# 1.0.4

* Adds option for `babelTransforms` for spec task.

# 1.0.3

* Adds option for `babelTransforms`, which is an array of modules to which you want to apply Babel transforms to during compilation.

# 1.0.2

* Removes the eslint align rule.

# 1.0.1

* Fixes eslint on spec runner.
* Turns off import/extensions rule.

# 1.0.0

* Added multiple ESLint packages to report on recommended syntax. To help updating your codebase to comply to these rules you can set the `eslintThreshold` to allow a certain amount on errors through. You can also modify your own `.eslintrc` file to add/remove rules as you see fit.
* Added the option to skip eslint which you can you use with `--skip-eslint` when running the gulp task.
* Output browserify error detail for easier debugging
* Added `eslintThreshold` option to control failing the build.
* Added support for TypeScript

```javascript
gulp.task('test', SpecTask({
  eslintThreshold: 1000
});
```

* LiveReactLoad has been turned off by default. To turn on live reloading pass `--hot` when running gulp.

# 0.3.5

* Change package used for coverage reporting to babel-plugin-istanbul to allow `istanbul ignore`

# 0.3.4

* Adds option for `babelTransforms` for spec task.

# 0.3.3

* Adds option for `babelTransforms`, which is an array of modules to which you want to apply Babel transforms to during compilation.

# 0.3.2

* Installs and implements the `graceful-fs` patch. This is to resolve any `EMFILE` errors that occur due to the `ulimit` being exhausted.

# 0.3.1

## Bug Fixes

* Makes `uglify` from gulp production command optional, as it conflicts with Rails uglify and breaks code

# 0.3.0

##  Support for Hot Reloading.

Hot reloading will automatically update the UI whenever a developer makes changes to the JavaScript, meaning they will not have to reload the entire page.

You can disable hot-reloading by passing `--cold` as an arg to the build task.

## Enhancements

* Adds Jasmine support to eslint.

# 0.2.0

## Enhancements

### `gulp test` now takes additional optional flags

* Run `gulp test --report-slow` to identify tests taking more than 100ms.
* Run `gulp test --debug` to run Karma in debug mode for additional info.

### configuration added for Enzyme

* Enzyme requires some configuration tweaks to run with Browserify

# 0.1.1

## Bug Fixes

* Reverts [#81](https://github.com/Sage/carbon-factory/pull/81) as it caused builds to pull in spec helpers from `node_modules` directory.

# 0.1.0

* Upgrades most dependencies.
  * Easiest upgrade is to remove all local node_modules and reinstall fresh.
  * ESLint upgrade introduces more accurate ruling.
* Updated path to spec_helper for spec task to remove warning
* Removes istanbul comments from compiled code.

# 0.0.14

* Remove fs dependencies "fs": "0.0.2"
* Added support for image assets

# 0.0.13

* Upgraded to Babel 6

# 0.0.12

 * Increase watchify speed from ~8s to ~300ms

# 0.0.11

* Improve error handling.  Fast fail when running gulp --build.

# 0.0.10

* Locked `es5-shim` to version `4.5.4`.

# 0.0.9

* Added new config param to spec task - `coverageEachFile`. This allows developers to define coverage thresholds file by file (with regex, exclude and override support).
* Added new config param to spec task - `coverageReporters`. An array to specify what kind of reporters type should karma generate.

# 0.0.8

* Added new config param to spec task - `reporters`. This allows developers to choose which reporters they want to use in the spec task.

# 0.0.7

* Fixes coverage bug introduced with `v0.0.6`.
* Locks versions to try and mitigate incompatabilities with third party modules.
* Locks eslint to `v1.10.x` to resolve faulty eslint errors.
* Locks escope to `v3.3.0` to resolve faulty eslint errors.

# 0.0.6

* Added new config param to spec task - `ignoreCoverage`. This allows developers to choose which directories are ignored when coverage reports are generated.

Example:

```
import gulp from 'gulp';
import SpecTask from 'carbon-factory/lib/gulp/spec';

gulp.task('test', SpecTask({
  ignoreCoverage: [ '**/node_modules/**', '**/__spec__.js' ]
}));
```

# 0.0.5

* Added new config param to build task - `additionalSassTransformDirs`. This allows developers to define additional directories in which Sass transforms should be applied, for example:

```
var opts = {
  additionalSassTransformDirs: ['./node_modules/carbon-sageone']
};
```

# 0.0.4

## Minor Changes

* The build task now outputs a more descriptive message when gulp is ready.

# 0.0.3

## Bug Fixes

* Carbon Factory now compiles code to lib, allowing developers to no longer require installing babel on their computer.

# 0.0.2

## Added spec_helper

You can now add `src/__spec_helper__/*.js` files to scaffold any global variables required for your tests.

## Updated CLI

The command line interface generation tools have been updated to better reflect the updates to Carbon. The `app` and `standalone` tasks also no longer run `npm install` automatically for you.

The build task can now be ran as a single run, useful for performing single asset builds. Pass `--build` to your gulp build task.

### Carbon Component

The carbon component task now creates a named javascript file nested within the component directory. It also creates a base `package.json` file containing a relative path to the component file and the name of component.

For example the command `carbon component foo` will create a folder with three files

```
components/foo/
  __spec__.js
  foo.js
  package.json
```

The `package.json` file will contain the following

```
{
  "main": "./foo.js",
  "name": "foo"
}
```

## ESLint

[ESLint](http://eslint.org/) has been added to the `gulp test` task. This introduces 3 new dependencies:

  * "babel-eslint": "^4.1.5",
  * "eslint-plugin-react": "^3.8.0",
  * "karma-eslint": "^2.0.1"

You also need a `.eslintrc` file in the root of your project. When running the spec task for the first time you will get a message with how to set this up.

## Coverage

The spec gulp task can now be configured to alter the coverage threshold.

```js
import gulp from 'gulp';
import SpecTask from 'carbon-factory/lib/gulp/spec';

gulp.task('test', SpecTask({
  coverage: {
    statements: 100,
    branches: 100,
    functions: 100,
    lines: 100
  }
}));
```

## Misc

* No longer makes the code unreadable when running tests and debugging.
* Remembers preferences for console when running tests in Chrome (you may need to add `browser-preferences/` to your `.gitignore` file.

# 0.0.1

Initial prototype release.

Includes:

* Gulp tasks for building the package and running specs.
* CLI for setting up an application and components.
