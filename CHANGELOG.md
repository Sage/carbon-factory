# 5.3.0

## webpack

Remove the `uglify-webpack-plugin` that we used in production builds. webpack uses this by default for production builds, and with the same options we used, so we don't need to include it here.

# 5.2.1

## Bug Fixes

Bump the version number in `package-lock.json`.

# 5.2.0

## Add Sourcemaps in Development Mode

We now generate sourcemaps when running in development mode.

# 5.1.0

## Bundle Stats

We have added support for analysing your Webpack bundle using the BundleAnalyzerPlugin. To use it pass `--stats` when running Webpack.

# 5.0.0

## Updated Jest Test Matcher

Jest will now automatically pick up test files either called `__spec__.js` or `*.spec.js`.

## Removed gulp Support

We have now officially dropped support for gulp. This includes removing all gulp tasks supplied by carbon-factory as well as any dependencies related to gulp.

For notes on upgrading please see the guide for [setting up Webpack](https://github.com/Sage/carbon-factory/blob/master/docs/webpack.md).

Alternatively take a look at the [create-carbon-app](https://github.com/Sage/create-carbon-app) project to generate a scaffold.

### Linting

We are aware that we have some projects that are not fully compliant with our lint rules, and therefore require support to not fail a build for a error threshold.

To accommodate this we recommend you create an `.eslintrc` file that changes any rules you have outstanding into warnings, for example:

```
{
  "rules": {
    "react/prefer-stateless-function": 1
  }
}
```

You can then use the `--max-warnings` option to set a limit to your number of expected warnings. Over time you can work on reducing this number and returning the warnings back to errors.

## Reduced Dependencies

We have removed any unused dependencies. If you have builds that still require a particular dependency then you may have to install and manage it yourself.

## Updated Dependencies

We have updated various dependencies including babel, Jest, ESLint and Webpack.

### ESLint Upgrade

With the ESLint upgrade it has introduced some new rules. Most should be able to be auto-fixed, others may need some manual intervention.

### babel preset

We have upgraded to use `babel-preset-env` - this should have no effect on your application other than remove a deprecation notice.

# 4.2.4

Turns CSS processor options to safe to fix [compilation issues](https://github.com/NMFR/optimize-css-assets-webpack-plugin/pull/58).

# 4.2.3

Fixes config for `gzip` when it is disabled.

# 4.2.2

## Webpack Windows Support

We have updated how paths are resolved to support multiple environments. For this reason you might have to update your config:

1) Any absolute paths should now be relative paths:

```
entryPoint: '/src/main.js' // bad
entryPoint: './src/main.js' // good
```

2) Parcelify loader does not support paths cross-platform that do not use `path.resolve`. We have fixed our config, but you may need to also fix any you have defined in your local project.

For example change the following:

```
const path = require('path');

parcelifyPaths: [`${process.cwd()}/src`] // bad
parcelifyPaths: [path.resolve(process.cwd(), 'src')] // good
```

# 4.2.1

## Webpack Fix

We no longer gzip images as part of the production build.

# 4.2.0

## npm audit

Updated packages to resolve issues highlighted by `npm audit`.

# 4.1.1

## Webpack Fix

We no longer gzip images as part of the production build.

# 4.1.0

## Webpack Support

We now provide a preconfigured setup for using Webpack to build assets.

Please see the [Webpack guide](docs/webpack.md) for more information on setting up your project or for migrating to using Webpack.

# 4.0.1

Hoists `@import` CSS rules to the top of the CSS file.

# 4.0.0

Updated versions of packages. Please [see commit](https://github.com/Sage/carbon-factory/commit/8afe6ef2f23b4fdea33daf2b10211e5c63f9912f) for all changes. Build tasks should still work, however some tests may need updating.

## Assets URL

You can now prepend the assets URL with a different address.

By default assets are rendered in the CSS file with `/assets/my-file`. You can now pass `gulp build --assetsUrl /custom-url` and the output will be `/custom-url/assets/my-file`.

# 3.3.3

## Bug Fixes:

* Update eslint from 4.16.0 to 4.17.0
* Update gulp-eslint from 3.0.0 to 4.0.2
* Update babel-eslint from 6.1.2 to 8.2.1
* Update eslint-config-airbnb from 13.0.0 to 16.10
* Update eslint-plugin-import from 2.2.0 to 2.8.0
* Update eslint-plugin-jsx-a11y from 2.2.3 to 6.0.3
* Update eslint-plugin-react from 6.8.0 to 7.6.1

:note: Upgrading these dependencies updates some rules and introduces some new ones. You may need to resolve these issues or you can configure your application's `.eslintrc` file to turn them down to warnings. Using `--fix` may be the easiest solution. We do not recommend turning these rules off entirely.

# 3.3.2

The `dir` option for the spec task uses Jest's `rootDir` instead of `roots`.

# 3.3.1

Gzipped assets are no longer created with a `.gz` extension.

# 3.3.0

## Gzip

As part of the build task we will now gzip your assets if using the `--production` flag. You can disable gzip compression by passing `gzip: false` to the config.

## Clean CSS

We now run [Clean CSS](https://github.com/jakubpawlowicz/clean-css) on the compiled stylesheet.

# 3.2.1

## Bug Fixes:

* Update eslint from 4.16.0 to 4.17.0
* Update gulp-eslint from 3.0.0 to 4.0.2
* Update babel-eslint from 6.1.2 to 8.2.1
* Update eslint-config-airbnb from 13.0.0 to 16.10
* Update eslint-plugin-import from 2.2.0 to 2.8.0
* Update eslint-plugin-jsx-a11y from 2.2.3 to 6.0.3
* Update eslint-plugin-react from 6.8.0 to 7.6.1

:note: Upgrading these dependencies updates some rules and introduces some new ones. You may need to resolve these issues or you can configure your application's `.eslintrc` file to turn them down to warnings. Using `--fix` may be the easiest solution. We do not recommend turning these rules off entirely.

# 3.2.0

* `dir` option for Build and Lint tasks. Settings this value allows you to control which directory to search in to run tests.
* Update eslint from 3.19 to 4.16

# 3.1.1

* Fixes multi line issue with build spinner.

# 3.1.0

* Adds a spinner to the build task to indicate when it is busy.

# 3.0.0

* Updated `enzyme-to-json` to `3.1.2` to support [Enzyme 3](https://github.com/adriantoine/enzyme-to-json/issues/67).
* Upgraded `sass-css-stream` to `1.0.0` which includes an upgrade to `node-sass` to `4.7.2`.

# 2.2.0

* Disables `notify` on Jest, as it is causing memory leaks.
* Allows additional lookup paths to be defined for the build task.
* Enabled sourcemaps when running in watch mode. Alternatively you can control if they are enabled/disabled with the `--sourcemaps` flag when running gulp.
* Removes dependency `node-inspector`, allowing use of Node v8.

# 2.1.0

* Updated Carbon CLI for setting up applications based on Carbon v2 and Carbon-Factory v2.

# 2.0.1

## Bug Fixes:

* Envify now runs across all node modules.

# 2.0.0

* Jasmine and Karma have been replaced by Jest. See our [migration document for details](https://github.com/Sage/carbon-factory/blob/master/docs/migrating/v1-v2.md).
* We have added a new gulp task for just running eslint, you can set it up like this:

```
import LintTask from 'carbon-factory/lib/gulp/lint';

gulp.task('lint', LinkTask());
```

You can also pass it additional options to add an error and/or warning threshold:

```
gulp.task('lint', LinkTask({
  errorThreshold: 10,
  warningThreshold: 20
}));
```

# 1.1.8

* Update the `package.json` created when running `carbon app myapp` to use `carbon-react` and `carbon-factory` from npm, and to use the same version of common dependendencies as used in `carbon-react`.

# 1.1.7

* Configures 'no-use-before-define' to skip functions and classes.

# 1.1.6

* Fix overly strict eslint rule to allow object property reassignment

# 1.1.5

* Fixes an issue where the overriding the coverage ignore option was not being used during gulp.

# 1.1.4

* Update branch of karma-eslint package to fix build passing when errors present.

# 1.1.3

* Bump .eslintrc max function params to 5

# 1.1.2

* Resolves the previously broken version, adding the lib directory to the package.

# 1.1.1

* :warning: does not include lib directory

# 1.1.0

* **IMPORTANT**: From this version on you will need to install the Carbon library as `carbon-react`.

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
