# Help with Jest

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

## Snapshot Testing

https://facebook.github.io/jest/docs/snapshot-testing.html
https://facebook.github.io/jest/docs/tutorial-react.html#snapshot-testing

Snapshot testing a React Component involves creating a JSON representation of the component and saving it. When the component code changes, the new JSON representation is compared to the saved value - if they differ, the test fails.

For testing components it is best practice to use a shallow renderer, this ensures that we are just taking snapshots of the component we are testing - and not the composition of it's child components!

For example, given the following component:

```
import React from 'react';
import Form from 'carbon/lib/components/form';

class MyComponent extends React.Component {
  render() {
    return (
      <Form saveText="Submit!">
        My children!
      </Form>
    );
  }
};
```

This could be tested like this:

```
import React from 'react';
import { shallow } from 'enzyme';

describe('MyComponent', () => {
  it('renders with a form', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper).toMatchSnapshot();
  });
});
```

This would take the following snapshot:

```
exports[`MyComponent snapshot renders with a form 1`] = `
<Form
  activeInput={null}
  buttonAlign="right"
  cancel={true}
  customSaveButton={null}
  save={true}
  saveText="Submit!"
  saving={false}
  showSummary={true}
  validateOnMount={false}
>
  My children
</Form>
`;
```

It does not tell us what a `Form` renders, it only saves the props that are set (including the defaults), and the children I have defined.

This has several advantages over writing specs that examine each prop and className individually. It means writing less code, which in turn means less likelihood of making errors in specs.

It is also important to try and focus snapshots on specific areas if you're testing different contexts/scenarios. For example if when a certain prop is `true` the only change is that a button becomes disabled, I should snapshot the area with that button rather than the entire component tree - otherwise we'll need to update a lot more specs when we make code change in the future. See https://github.com/adriantoine/enzyme-to-json#focused-tests

### Use in existing Specs

Snapshot tests can be added to existing component specs or replace existing tests that are testing markup instead of behaviour. We recommend using snapshot tests for all Carbon code. Remember that behaviour (e.g. events) and state cannot be tested via snapshots. You will still need to write regular Enzyme tests for anything other than plain markup.

Please ensure you have read and understood https://facebook.github.io/jest/docs/snapshot-testing.html before writing snapshots tests.

### Updating Snapshots

If you have made a valid change to component code which means a snapshot test is now failing, you can update the snapshot file with your new code. To do this, use the Jest CLI and hit `u` when in the option menu. Be careful not to update snapshots until you have verified that the diff in the test output is correct.


## Mock Functions

`spyOn` is still supported in Jest, however there is a different way to create new mock objects which is useful to know about. Creating mock functions in Jest can be done using `jest.fn();`

```js
const myMock = jest.fn();
```

In order to apply your mock to the right part of your code, just set the property to equal the mock, `MyComp.func = mock`. This is the equivalent of `spyOn(MyComp, 'func')`.

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

NOTE: `jasmine.createSpyObj` is no longer supported. You will need to redefine these:

Previously you would write:

```js
const obj = jasmine.createSpyObj('obj', ['foo', 'bar']);
```

Now you would write:

```js
const obj = {
  foo: jest.fn(),
  bar: jest.fn()
};
```

## Timer Mocks

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

## Mocking the Date

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

## Ajax Testing

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

For example, let's consider the following code:

```js
export default {
  makeRequest: () => {
    Request
      .get('/my-endpoint?abc=123')
      .set('X-CSRF-TOKEN', 'my-token')
      .type('json')
      .end((err, response) => {
        if (err) {
          Dispatcher.dispatch({
            actionType: ERROR
          });
        } else {
          Dispatcher.dispatch({
            actionType: SUCCESS,
            message: response.body
          });
        }
      });
  }
};
```

You could test it with the following:

```js
import Actions from './actions';
import Request from 'superagent';

jest.mock('superagent');

describe('superagent example', () => {
  beforeEach(() => {
    spyOn(Dispatcher, 'dispatch');
  });
  
  describe('on success', () => {
    beforeEach(() => {
      Request.get = jest.fn().mockReturnThis();
      Request.set = jest.fn().mockReturnThis();
      Request.type = jest.fn().mockReturnThis();
      Request.__setMockResponse({
        status() {
          return 200;
        },
        ok() {
          return true;
        },
        body: 'success!'
      });
      Actions.makeRequest();
    });
    
    it('queries the correct endpoint', () => {
      expect(Request.get).toHaveBeenCalledWith('/my-endpoint?abc=123');
    });
    
    it('sets the correct header', () => {
      expect(Request.set).toHaveBeenCalledWith('X-CSRF-TOKEN', 'my-token');
    });
    
    it('sets the correct type', () => {
      expect(Request.type).toHaveBeenCalledWith('json');
    });
    
    it('dispatches a successful event', () => {
      expect(Dispatcher.dispatch).toHaveBeenCalledWith({
        actionType: SUCCESS,
        message: 'success!'
      });
    });
  });
  
  describe('on error', () => {
    beforeEach(() => {
      Request.__setMockError(true);
      Actions.makeRequest();
    });
    
    it('dispatches an erroneous event', () => {
      expect(Dispatcher.dispatch).toHaveBeenCalledWith({
        actionType: ERROR
      });
    });
  });
});
```
