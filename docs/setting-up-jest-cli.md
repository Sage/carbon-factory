# Setting up the Jest CLI

The Jest CLI [supports many options](https://facebook.github.io/jest/docs/cli.html), so it's useful to setup some defaults in your application.

To do this:

1. Create a `jest.conf.json` file in the root of your application, and insert the following:

```
{
  "preset": "./node_modules/carbon-factory/jest.conf.json"
}
```

This ensures you inherit the base configuration from Carbon Factory.

2. Add / update the `test` script to your main `package.json`:

```
"scripts": {
  "test": "jest --config=./jest.conf.json"
}
```

You can now run `npm test` in your terminal to execute the Jest CLI. You can pass additional options to the command by inserting a `--` between `npm test` and the Jest arguments. For example:

```
npm test -- --watch --onlyChanged
```

