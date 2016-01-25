# First Time Installation

## Preparing Your Environment

To use [React](http://facebook.github.io/react/) and [Carbon](https://github.com/sage/carbon) with your local environment, you will need the following installed:

* [Node.js](https://nodejs.org/)
* [Gulp.js](http://gulpjs.com/)
* [Carbon CLI](https://github.com/sage/carbon-factory)

### Installing Node.js

If you are new to Node and npm, we have written a [short introduction](an-introduction-to-node-and-npm.md).

* Download and install Node from [https://nodejs.org/](https://nodejs.org/), or install and use [Node Version Manager](https://github.com/creationix/nvm).
* *Optional:* If you are getting permission issues when you install modules using npm, you may need to change the permission of your npm directory. Follow the instructions on [npm's website](https://docs.npmjs.com/getting-started/fixing-npm-permissions).

### Installing Gulp.js

You need to install Gulp globally.

* You should be able to install [Gulp.js](http://gulpjs.com/) using npm:

```bash
npm install -g gulp
```

### Installing Carbon CLI

You need to install Carbon globally.

* You should be able to install [Carbon CLI](https://github.com/sage/carbon-factory) using npm:

```bash
npm install -g sage/carbon-factory
```

## (optional) Step by Step Getting Started

Now that your environment is setup, let's go step by step to getting a project running.

* Go to a directory where you keep your projects:

```
cd ~/development
```

* Use the CLI to scaffold a Carbon/React/Flux project (this will also install all dependencies for your project):

```
carbon app sampleapp
```

* Go into your new project:

```
cd sampleapp
```

* Install the project's modules:

```
npm install
```

* Run Gulp to recompile assets when file changes are made:

```
gulp
```

* Open a new terminal window, and return to the same directory:

```
cd ~/development/sampleapp
```

* Create a new component:

```
carbon component foobar
```

* Edit the `src/components/foobar/index.js` file for your new component to add some content to the `render` function:

```
render() {
  return (
    <div>Foobar!</div>
  );
}
```

* Edit the `src/main.js` file in your project to import your new component and attach it to your route:

```
import Foobar from 'components/foobar';

var routes = (
  <Route path="/" component={ Foobar } />
);
```

* In the console, start a web server from the root of your project:

```
python -m SimpleHTTPServer
```

* Open http://localhost:8000 in your web browser to view your application.

* Your application is now setup, why not try setting up an application using Flux following our [basic example](https://github.com/Sage/carbon/blob/master/docs/guides/a-basic-example.md)?
