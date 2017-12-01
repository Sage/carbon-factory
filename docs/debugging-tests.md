# Debugging Tests

There are a number of ways to debug your code, please see the following links for more information:

* https://facebook.github.io/jest/docs/troubleshooting.html
* https://nodejs.org/en/docs/inspector/

## Debugging in Browser with Node v8

This will only work using Node v8 or higher.

### Setup

* Install [NiM (Node Inspector Manager)](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj). This will allow Chrome to automatically connect when a debugger is detected.
* Add the following script to your `package.json` to make running the test easier in the future:

```
"scripts": {
  "debug": "node --inspect ./node_modules/.bin/jest --watch --config=./jest.conf.json"
}
```

### Running Tests

You can now run the following command to run your tests:

```
npm run debug
```

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
    "--config=./jest.conf.json",
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
