# Webpack

Webpack is fast and provides additional features to help development, including hot reloading and code splitting.

To support Webpack you will need to do the following:

## Adding Webpack Support

### Create Config File

Create a `webpack.config.js` in the root of your project with the following code:

```js
module.exports = require('carbon-factory/webpack.config')();
```

This example uses the default config supplied by Carbon Factory. You can send an object of additional options to the function, please see the [config file](../webpack.config.js) to learn more about what options are available.

Alternatively, this function returns a simple JavaScript object which you can manipulate in any way you want:

```js
const config = require('carbon-factory/webpack.config')();
config.additionalOption = true;
module.exports = config;
```

### Tasks

To more easily run commands, add the following two scripts to your `package.json`:

```json
"start": "node_modules/.bin/webpack-dev-server",
"build": "NODE_ENV=production node_modules/.bin/webpack"
```

These will allow you to do the following:

```
npm start
```

This will initialize a dev environment, running webpack-dev-server.

```
npm run build
```

This will precompile assets for production.

#### Webpack Stats

The Webpack tasks can also be ran with `--stats` to show analytics on the bundled code.

### Enabled Hot Reloading

Hot reloading enables faster development, without losing any state in the application. To enable it in your app you need to add the following code, preferably in the entrypoint of your app:

```js
if (module.hot) {
  module.hot.accept();
}
```

You can find out more on the [official documentation](https://webpack.js.org/guides/hot-module-replacement/).

### Jest

There are a couple of additions needed for webpack to work with Jest.

Firstly you will need to have css and scss files handled by the `identity-obj-proxy` module. This is already set up in Carbon Factory's Jest config.

Secondly, you will need to have other file types handled. We recommend using a file transformer. Add the following config to your Jest config:

```
transform: {
  "^.+\\.js$": "babel-jest",
  "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
    "./fileTransformer.js"
}
```

Then create the `fileTransformer.js` file:

```
const path = require('path');

module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  },
};
```

For more information on enabling Webpack for Jest, please see the [official documentation](https://facebook.github.io/jest/docs/en/webpack.html).

## Upgrading from Carbon Factory

If you were using a previous version of Carbon Factory, you will need to do the following additional steps.

### Remove Old Code

We no longer use the gulp build task, you can safely remove this from the your `gulpfile.js`.

### Additional Assets

We no longer support loading assets through `package.json` files using [Parcelify Loader](https://www.npmjs.com/package/parcelify-loader).

Instead use Webpack to import these assets in the JavaScript file itself.

For example, given the following `package.json`:

```json
{
  "style": [
    "./stylesheet-one.scss",
    "./stylesheet-two.scss"
  ],
  fonts: "./my-font.woff"
}
```

You can remove your `package.json` and add these imports to your JavaScript file:

```js
import './stylesheet-one.scss';
import './stylesheet-two.scss';
```

The font or image file will be picked up automatically by the reference to it in the CSS file.

We would recommend not relying on using `package.json` files any more, as we would like to deprecate this loader entirely from the build process.

### CSS Error

Are you getting an error like this:

```
Invalid CSS after "*/": expected 1 selector or at-rule, was 'exports.mode = "con'
```

This is due to a new node module called `colors` interfering with Sass imports of the file also called `colors`.

To resolve this we recommend a mass find and replace in your app to change:

```
@import 'colors';
```

to:

```
@import 'colors.scss';
```

