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
