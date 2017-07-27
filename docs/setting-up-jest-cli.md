# Setting up the JestCLI

While `gulp test` will give you the basic command for running Jest, the JestCLI instead [supports many additional options](https://facebook.github.io/jest/docs/cli.html). Therefore it is useful to set this up in your application.

You need to create a `jest.conf.json` file in the root of your application (alongside your `gulpfile.js`), and insert the following:

```
{
  "preset": "./node_modules/carbon-factory/jest.conf.json"
}
```

This ensures that you inherit the base configuration we supply from Carbon Factory.

Secondly, you need to update or add the `test` script to your main `package.json`:

```
"scripts": {
  "test": "jest --config=./jest.conf.json"
}
```

You should now be able to run `npm test` in your terminal to execute the JestCLI. You can pass additional options to the command by inserting a `--` between `npm test` and the Jest arguments. For example:

```
npm test -- --watch --onlyChanged
```

For more details on running tests see the [Running Specs Document](https://github.com/Sage/carbon-factory/blob/master/docs/running-tests.md)
