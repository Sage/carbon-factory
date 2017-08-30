# Debugging Tests

There are a number of ways to debug your code, please see the following links for more information:

* https://facebook.github.io/jest/docs/troubleshooting.html
* https://nodejs.org/en/docs/inspector/

Unfortunately debugging tests in the browser via Node is not great, but they are working on it (we have some guides below on how to do this). Please refer to the following issues to learn more and keep track on progress:

* https://github.com/facebook/jest/issues/1652
* https://github.com/nodejs/node/issues/7593

## Debugging in RubyMine

* Open your JavaScript application.
* Create a new debugging configuration by selecting `Run` > `Edit Configurations...`.
  * Add a `Jest` configuration using the `+` in the top left.
  * Give it a name after your project.
  * Add the configuration file (the path to `jest.conf.json` in your project).
  * Add the "Jest package" (the path to `node_modules/jest` in your project).
  * Add the following "Jest options" - `--onlyChanged --watch`.
  * Click `Apply` and `OK`.
* Add a `debugger;` statement into the file and line you want to trigger a breakpoint.
* Run the debugger by selecting `Run` > `Debug...` and selecting your configuration.
* Once you hit breakpoints in your code you can evaluate expressions by right clicking and selecting `Evaluate Expression...`.

## Debugging in VisualStudioCode

* Open your JavaScript project (either the folder, or go straight for the file you want to debug and open that).
* Add a `debugger;` statement into the file and line you want to trigger a breakpoint (or add a red check on the line number).
* Open the debugger panel by clicking on the debugger icon on the left.
* Select add a configuration at the top of the debugger panel.
* Click on the cog to select this option and create a config file.
* Add the following config to the `launch.json` replacing the contents of the `configurations` array:

```
{
  "type": "node",
  "request": "launch",
  "name": "Run Current Spec",
  "program": "${workspaceRoot}/node_modules/.bin/jest",
  "args": [
    "--runInBand",
    "--config=./jest.conf.json"
    "${file}"
  ],
  "runtimeArgs": [
    "--nolazy"
  ],
  "stopOnEntry": false,
  "cwd": "${workspaceRoot}",
  "sourceMaps": true,
  "console": "internalConsole"
}

```

* Save `launch.json`.
* Focus on the __spec__ file by selecting it's tab.
* Run the debugger by pressing the play button which will run the currently focused file.

## Debugging in the Browser

### Setup

If you application has not yet been set up to debug, you will need to add the following scripts to your application's `package.json`:

```
"scripts": {
  "debug:listen": "node --debug-brk ./node_modules/.bin/jest --runInBand --config=./jest.conf.json",
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

## Debugging in the Terminal

Debugging in the terminal can be a quick way to debug your tests.

### Setup

If you application has not yet been set up to debug, you will need to add the following scripts to your application's `package.json`:

```
"scripts": {
  "debug:terminal": "node debug ./node_modules/.bin/jest --runInBand --config=./jest.conf.json"
}
```

### Debugging

Add a `debugger;` statement to the test you’d like to debug

In the terminal run the `debug:terminal` script (you can also pass additional options such as the file we want to test):

```bash
npm run debug:terminal relative/path/to/spec
```

Once it boots, execute the character `c` to continue past the initial breakpoint. The code will then continue to execute until it reaches your breakpoint. To inspect and run commands execute `repl`, this will allow you to inspect your code as you like.
