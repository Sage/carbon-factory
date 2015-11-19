# Command Line Interface

Carbon Factory provides a CLI to generate files.

You can get more information such as your currently installed version and what commands are available by running:

```
carbon --help
```

## Upgrading the CLI

To upgrade to the latest version of the CLI, run:

```
npm install sage/carbon-factory -g
```

## Available Commands

### Prepare Project

Carbon Factory supplies a command to scaffold a new project. Run the command with the name of your application and it will create the directory for the application as well as everything it needs within it:

```bash
carbon app myapp
```

NOTE: Carbon Factory supplies two kinds of projects out of the box:

* [Standard Build](standard-build.md) - for Flux based applications.
* [Standalone Build](standalone-build.md) - for generating components available in the global namespace of the DOM.

After setting up your project, make sure you install its dependencies by running `npm install` from inside the projects route directory.

### Create a Component

To create a component, you can run the following command from within the root directory of your project:

```bash
carbon component textbox
```
