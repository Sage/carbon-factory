# Standard Build

## Creating a Standard Build

### Structure

This is an example skeleton structure for a standard build application:

 ```
my-carbon-app
├── .babelrc
├── .eslintrc
├── .gitignore
├── gulpfile.js
├── index.html
├── package.json
└── src/
    ├── __spec_helper__/
    │     └── index.js
    ├── main.js
    ├── components/
    └── views/
```

#### .babelrc

This points to the default version in `carbon-factory` by default

```json
{
  "extends": "./node_modules/carbon-factory/.babelrc"
}
```

#### .eslintrc

This points to the default version in `carbon-factory` by default

```json
{
  "extends": "./node_modules/carbon-factory/.eslintrc"
}
```

#### gulpfile.js

Extends default config from `carbon-factory`.

```js
const gulp = require('gulp');
const BuildTask = require('carbon-factory/lib/gulp/build').default;
const connect = require('gulp-connect');

gulp.task('build', BuildTask());
gulp.task('serve', function () {
  connect.server({
    root: '.',
    fallback: 'index.html',
    port: 8082
  });
});
gulp.task('default', ['build', 'serve']);
```

#### jest.conf.json

Extends default config in `carbon-factory`.

```json
{
  "preset": "./node_modules/carbon-factory/jest.conf.json",
  "setupFiles": [
    "./src/__spec_helper__/index.js"
  ]
}
```

#### .gitignore

```
node_modules/
assets/
lib/
.browser-preferences/
```

#### index.html

Basic HTML index page to serve app.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Demo</title>
    <link href="/assets/stylesheets/ui.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <div id="app"></div>
    <script src="/assets/javascripts/ui.js"></script>
  </body>
</html>
```

#### package.json

The app dependencies

```json
{
  "name": "demo-app",
  "version": "0.0.1",
  "description": "My App",
  "scripts": {
    "test": "./node_modules/.bin/jest --config=./jest.conf.json --watch"
  },
  "author": "",
  "license": "",
  "dependencies": {
    "flux": "~3.1.1",
    "carbon-react": "^3.2.0",
    "react": "^16.2.0",
    "react-dom": "^16.2.0"
  },
  "devDependencies": {
    "carbon-factory": "4.0.1",
    "enzyme": "3.3.0",
    "enzyme-adapter-react-16": "^1.1.1",
    "gulp-connect": "^4.0.0",
    "react-test-renderer": "^16.2.0"
  }
}
```

### src/

This contains your application code. We have added a demo `view` and demo `component` do you can see these items in situ.

#### src/main.js

This is the default entry point for your code

```js
import React from 'react';
import { Route } from 'react-router';
import { startRouter } from 'carbon-react/lib/utils/router';
import DemoView from 'views/demo-view';

var routes = (
  <Route>
    <Route path='/' />
    <Route path='/demo' component={DemoView} />
  </Route>
);

startRouter(routes);
```

### src/components/demo/

A basic demo component that inherits form `React.component` so you get things like `state` and `lifecycle` functions for free.

#### src/components/demo/demo.js

```js
import React from 'react';

class Demo extends React.Component {

  /**
   * Renders the component.
   *
   * @method render
   */
  render() {
    return (
      <div>Demo</div>
    );
  }
}

export default Demo;
```

#### src/components/demo/__spec\__.js

```js
import React from 'react';
import { shallow } from 'enzyme';
import Demo from './demo';

describe('render', () => {
  const wrapper = shallow(<Demo />);

  it('looks as expected', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
```

#### src/components/demo/packages.json

```json
{
  "main": "./demo.js",
  "name": "Demo"
}
```

### src/views/demo-view/

This demo view is about as basic as you can get. It is called a stateless component. It shows that if you don't need all the extra functionality you component can just be a simple function.

#### src/views/demo-view/demo-view.js

```js
import React from 'react';
import Demo from 'components/demo';

const DemoView = () => (
  <Demo/>
)

export default DemoView;
```

#### src/views/demo-view/__spec\__.js

```js
import React from 'react';
import { shallow } from 'enzyme';
import DemoView from './demo-view';

describe('render', () => {
  const wrapper = shallow(<DemoView />);

  it('looks as expected', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
```

#### src/views/demo-view/package.json

```
{
  "main": "./demo-view.js",
  "name": "DemoView"
}
```

### src/__spec_helper\__/index.js

Spec helpers run before any of the tests

```js
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
```

Once all these files are in place you can install its dependencies by running `npm install` from inside the projects root directory.

## Compiling Your Build

Carbon Factory provides [Gulp](http://gulpjs.com/) tasks to help compile assets for your application.

To run Gulp, run it from your project directory (this will do an initial build of your assets, and continue watching for any changes):

```bash
$ gulp
```

### Further Configuration

The following shows how you can modify the Gulp build task provided with Carbon Factory:

```js
// gulpfile.js

import gulp from 'gulp';
import BuildTask from 'carbon-factory/lib/gulp/build';

gulp.task('default', BuildTask());
```

You can also pass options to each task:

```js
// gulpfile.js

import gulp from 'gulp';
import BuildTask from 'carbon-factory/lib/gulp/build';

var opts = {
  src: './src/main.js', // the entry point for your application
  jsDest: './tmp', // the destination directory
  jsFile: 'ui.js', // the file to output to
  cssDest: './tmp', // the destination directory
  cssFile: 'ui.css' // the file to output to
};

gulp.task('default', BuildTask(opts));
```
