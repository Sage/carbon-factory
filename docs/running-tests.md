# Running Tests

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

## Additional Options for Running Tests

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
