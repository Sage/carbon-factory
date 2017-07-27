# Debugging Tests

There are a number of ways to debug your code, please see the following links for more information:

* https://facebook.github.io/jest/docs/troubleshooting.html
* https://nodejs.org/en/docs/inspector/

Unfortunately debugging tests in the browser via Node is not great, but they are working on it (we have some guides below on how to do this). Please refer to the following issues to learn more and keep track on progress:

* https://github.com/facebook/jest/issues/1652
* https://github.com/nodejs/node/issues/7593

## Debugging in RubyMine

* Open your JavaScript application.
* Add a `debugger;` statement into the file and line you want to trigger a breakpoint.
* From the top menu, choose `Run` > `Debug...`.
  * RubyMine may automatically detect that you want to debug a Jest test and will suggest a debug configuration for you to run on the line you have highlighted automatically.
  * If not you can add a new configuration for Jest, and select `Debug`.

## Debugging in the Browser

### Setup

If you application has not yet been set up to debug, you will need to add the following scripts to your application's `package.json`:

```
"scripts": {
  "debug:listen": "node --debug-brk ./node_modules/.bin/jest --runInBand",
  "debug:start": "node-inspector"
}
```

### Debugging

Add a `debugger;` statement to the test you’d like to debug

In the terminal run the `debug:listen` script (you can also pass additional options such as the file we want to test):

```bash
npm run debug:listen relative/path/to/spec
```

In another terminal window/pane run:

```
npm run debug:start
```

This outputs a URL e.g. http://127.0.0.1:8080?port=5858

Open the URL in Chrome. This will open the Chrome Developer Tools and a breakpoint will be set at the first line of the Jest CLI script.

Hit the play button to continue running the test. The script should pause when it hits your debugger statement you placed in the code.
