Add a `webpack.config.js`:

```js
module.exports = require('carbon-factory/webpack.config')({
  entryPoint: '/demo/main.js',
  outputPath: '/deploy/assets',
  serverBase: '/deploy'
});
```

Add the following two scripts to `package.json`:

```json
"start": "node_modules/.bin/webpack-dev-server",
"build": "NODE_ENV=production node_modules/.bin/webpack"
```

Update any scss file imports to include the extension:

```
@import 'colors.scss';
```

Add the following to enable hot reloading:

```js
if (module.hot) {
  module.hot.accept();
}
```
