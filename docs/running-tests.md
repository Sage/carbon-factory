# Running Tests

In development, you can run tests by using Gulp.

```bash
gulp test
```

This is a wrapper for the JestCLI with a configuration preset by Carbon Factory, including the following:

  * watch - Enters Jest watch interactive CLI
  * onlyChanged - Looks at your git integration for files that have changed and immediately runs the appropriate spec files

You can also run the command in build mode:

```bash
gulp test --build
```

This will run the test suite once, and will pass or fail (useful for continuous integration).

Both commands will run coverage reports, but only the `--build` task will perform a lint check as well.

## Running with JestCLI

While `gulp test` will give you the basic command for running Jest, the JestCLI instead [supports many additional options](https://facebook.github.io/jest/docs/cli.html). Therefore it is useful to set this up in your application. Please see the [Setting up the JestCLI]('https://github.com/Sage/carbon-factory/blob/master/docs/setting-up-jest-cli.md') guide for more information.

## Advanced Configuration

For more complicated setups where you are defining your own coverage limit, spec helpers or additional modules to run babel on you will need to provide extra configuration via your `jest.conf.json` file (if you have not already, please complete the [Setting up the JestCLI]('https://github.com/Sage/carbon-factory/blob/master/docs/setting-up-jest-cli.md') guide).

Firstly you need to ensure that gulp is using the same custom configuration as the JestCLI. For this you need to update your `gulpfile.js` task to require the custom config:

```js
gulp.task('test', SpecTask({
  jestConfig: require('./jest.conf.json')
}));
```

You can now add additional config to your config file. You can see what configuration can be set from the [official Jest documentation](https://facebook.github.io/jest/docs/configuration.html). An example of using the preset from Carbon Factory and overriding some options may look like this:

```js
{
  "preset": "./node_modules/carbon-factory/jest.conf.json",
  "coverageThreshold": {
    "global": {
      "branches": 90,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
}
```

## Coverage

Jest will generate coverage reports by default unless told otherwise, you can open a coverage report from the root of your application folder using the following command.

```bash
  open coverage/index.html
```
