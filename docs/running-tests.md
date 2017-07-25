# Running Tests

In development, you can run tests by using Gulp.

```bash
gulp test
```

This is a wrapper for the Jest CLI with the following options:

  * watch - Enters Jest watch interactive CLI
  * onlyChanged - Looks at your git integration for files that have changed and immediately runs the appropriate spec files

The wrapper uses the Carbon Factory jest.conf.json file as a base and merges in any changes passed to the gulp task.

e.g.

The following gulp task will ingnore all __spec__.js and definition.js files in the src directory and turn off watch mode

```js
gulp.task('test', SpecTask({
  jestConfig: {
    path: '/src/***/**/!(__spec__|definition).js',
    watch: false
  }
}));
```

The tests will run with coverage by default as defined by the base jest.config.json file in Carbon Factory.

To open the coverage report can be opened from the top of your ui folder using the following command.

```bash
  open coverage/index.html
```

If we you want to define your own jest.conf.json file you can override the preset value by passing it to your gulp task.

e.g.

```js
const specOpts = {
  babelTransforms,
  eslintThreshold: 4775,
  path: '/src/***/**/*.js',
  rootDir: process.cwd(),
  jestConfig: {
    preset: "<rootDir>/jest.conf.json"
  }
};

gulp.task('test', SpecTask(specOpts));
```

You can also run the tests as a single run.

```bash
gulp test --build
```

After running the tests, it will exit along with a coverage report failing if the coverage threshold is not met or any spec are unsuccessful. This is useful for CI and automated build tasks.

## Running Jest with JestCLI

Jest will be installed when you run npm install in Carbon. You can check it installed correctly by running:

```bash
jest --help
```

This will output the Jest CLI help.

You can also run Jest via the test script in Carbon’s package.json:

```js
// package.json

"scripts": {
  "test": "jest",
}
```

```bash
npm run test
```

To pass additional command line arguments to Jest e.g. to start Jest in watch mode, you need to pass the double-dash -- followed by the command line args:

```bash
npm run test -- -o --watch
```

This tells Jest to run in watch mode, and to only re-run those tests whose files have changed.

See Jest CLI for more options - https://facebook.github.io/jest/docs/cli.html#content

## Additional Options for Running Tests

You can run tests in the browser however this is currently not well supported and often performs slowly.

TODO: VSCode?

## Watch Usage

When running Jest in watch mode, you have a few options to change how watch is running:

```
Watch Usage
 › Press a to run all tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
 ```

Note the options `p` and `t` above. These let you filter tests by filename and test name i.e. the bit in the test or it block, respectively.

So to only run tests on dialog components you hit p, then type dialog:

```bash
Pattern Mode Usage
 › Press Esc to exit pattern mode.
 › Press Enter to apply pattern to all filenames.

 pattern › dialog

 Pattern matches 2 files
 › src/components/dialog/__spec__.js
 › src/components/dialog-full-screen/__spec__.js

To only run tests that test how things get hidden hit t, then type hide:

Pattern Mode Usage
 › Press Esc to exit pattern mode.
 › Press Enter to apply pattern to all tests.

 pattern › hide

 Pattern matches 6 tests from cached test suites
 › immediately hides its message if the input is different from the last
 › sets state to hide message instantly
 › hides additional buttons
 › hides the tooltip
 › hides the tooltip
 › hides the tooltip
```

### Snapshot Testing

https://facebook.github.io/jest/docs/snapshot-testing.html
https://facebook.github.io/jest/docs/tutorial-react.html#snapshot-testing

Snapshot testing a React Component involves creating a JSON representation of the component and saving it. When the component code changes, the new JSON representation is compared to the saved value - if they differ, test fails.

This can be easily done using React’s test renderer.
```js
import React from 'react';
import Button from 'carbon-react/src/components/button';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <Button>Save</Button>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
```
This would create the following snapshot file.

```js
exports[`Button snapshots A basic button renders a button with defaults 1`] = `
<button
  className="carbon-button carbon-button--secondary carbon-button--blue carbon-button--medium"
  data-component="button"
  disabled={false}
>
  Save
</button>
`;
```

This has several advantages over writing specs that examine each prop and className individually. It means writing less code, which in turn means less likelihood of making errors in specs.

#### Use in existing Specs

Snapshot tests can be added to existing component specs or replace existing tests that are testing markup instead of behaviour. We recommend using snapshot tests for all Carbon code. Remember that behaviour (e.g. events) and state cannot be tested via snapshots. You will still need to write regular Enzyme tests for anything other than plain markup.

Please ensure you have read and understood https://facebook.github.io/jest/docs/snapshot-testing.html before writing snapshots tests.

#### Updating Snapshots

If you have made a valid change to component code which means a snapshot test is now failing, you can update the snapshot file with your new code. To do this, use the Jest CLI and hit `u` when in the option menu. Be careful not to update snapshots until you have verified that the diff in the test output is correct.
