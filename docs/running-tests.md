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

## Jest Help

### Watch Usage

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

Snapshot testing a React Component involves creating a JSON representation of the component and saving it. When the component code changes, the new JSON representation is compared to the saved value - if they differ, the test fails.

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

Please note that where possible we should be performing shallow snapshots of UI. We should not be committing snapshots containing HTML from components you are not testing. Also when testing different contexts, focus your snapshots on the area of the UI which is changing. Enzyme should be able to help with this.

#### Use in existing Specs

Snapshot tests can be added to existing component specs or replace existing tests that are testing markup instead of behaviour. We recommend using snapshot tests for all Carbon code. Remember that behaviour (e.g. events) and state cannot be tested via snapshots. You will still need to write regular Enzyme tests for anything other than plain markup.

Please ensure you have read and understood https://facebook.github.io/jest/docs/snapshot-testing.html before writing snapshots tests.

#### Updating Snapshots

If you have made a valid change to component code which means a snapshot test is now failing, you can update the snapshot file with your new code. To do this, use the Jest CLI and hit `u` when in the option menu. Be careful not to update snapshots until you have verified that the diff in the test output is correct.


### Mock Functions

`spyOn` is still supported in Jest, however there is a different way to create new mock objects which is useful to know about. Creating mock functions in Jest can be done using `jest.fn();`

```js
const myMock = jest.fn();
```

The mock object has a mock property attached to it, which lets you track calls, arguments, etc.:

```js
expect(myMock.mock.calls.length).toBe(1);
expect(myMock.mock.calls[0][0]).toBe(‘foo’);
```

You can setup return values using mockReturnValue, and mockReturnValueOnce:

```js
myMock.mockReturnValueOnce(‘moo’)
  .mockReturnValueOnce(‘oink’)
  .mockReturnValue(‘neigh’);
// myMock returns ‘moo’, ‘oink’, then ‘neigh’ for each subsequent call
```

Also, if your mock needs to support method chaining you can use mockReturnThis:

```js
myMock.mockReturnThis();
```

You can find more information on the [official Jest Documentation](https://facebook.github.io/jest/docs/mock-function-api.html).

### Timer Mocks

Where previously you used `jasmine.clock()` to mock `setTimeout` and `setInterval`, in Jest you need to use `jest.useFakeTimers()`. To uninstall the i fake timers you can use `jest.useRealTimers()`.

In your tests, you can control the timers via three methods:

```js
// Runs all timers until they have all been executed
jest.runAllTimers();
// Run only the pending timers
jest.runOnlyPendingTimers();
// Run timers until the elapsed ms
jest.runTimersToTime(1000);
// Clear all outstanding timers
jest.clearAllTimers();
```

You can find more information on the [official Jest Documentation](https://facebook.github.io/jest/docs/jest-object.html).

### Mocking the Date

Jasmine lets you mock specific dates using `jasmine.clock().mockDate()`. Jest doesn’t appear to have any direct replacement for this itself, so we’re using the `MockDate` package as a replacement. You use it like so:

```js
// Import the package
import MockDate from 'mockdate';

// Setup the mock behaviour
const baseTime = new Date('2/2/2000');
MockDate.set(baseTime);
// new Date().toString() => "Wed Feb 02 2000 00:00:00"

// Reset the mock date
MockDate.reset()
```

### Ajax Testing

Now we're using Jest, you can no longer use Jasmine Ajax in your specs. Instead you'll need to mock the appropriate modules and/or functions as required.

For example, if you need to test code that uses `superagent` for Ajax requests, you'll find a handy mock implementation of `superagent` in the `__mocks__` folder. To use this in your specs:

Import `superagent` into your spec:

```js
import Request from 'superagent';
```

Tell Jest to mock superagent:

```js
jest.mock('superagent');
```

You can then mock the `Request` methods you need to and check it was called with the correct arguments:

```js
it('queries for data with the correct page and rows', () => {
  Request.query = jest.fn().mockReturnThis();
  ...
  expect(Request.query).toBeCalledWith('page=1&rows=10');
});
```

Or override the mock response:

```js
Request.__setMockResponse({
  status() {
    return 200;
  },
  ok() {
    return true;
  },
  body: {
    data: ['foo']
  }
});
```

Or the mock error:

```js
Request.__setMockError({
  message: 'Unsuccessful HTTP response'
});
```

Or the mock delay if required:

```js
Request.__setMockDelay(true);
```
