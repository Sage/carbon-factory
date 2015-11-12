# 0.0.2-beta

## ESLint

[ESLint](http://eslint.org/) has been added to the `gulp test` task. This introduces 3 new dependencies:

  * "babel-eslint": "^4.1.5",
  * "eslint-plugin-react": "^3.8.0",
  * "karma-eslint": "^2.0.1"

You also need a `.eslintrc` file in the root of your project. When running the spec task for the first time you will get a message with how to set this up.

## Misc

* Added `es7.decorators` to the gulp tasks.

# 0.0.1

Initial prototype release.

Includes:

* Gulp tasks for building the package and running specs.
* CLI for setting up an application and components.
