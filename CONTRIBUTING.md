# Contributing

## Reporting Issues/Bugs

The [issue tracker](https://github.com/sage/carbon/issues) is the preferred area to report any bugs or issues with the codebase. Once an issue is submitted, it will be reviewed and handled accordingly.

When reporting an issue, please provide as much information and context as possible allowing a developer to replicate and understand the problem. Also ensure you record the version of Carbon-Factory you are using, as well as any console or error logs.

## Requesting Features

For any feature requests, please use the [issue tracker](https://github.com/sage/carbon-factory/issues). When you raise the feature request, please provide as much information as possible to describe the feature required, as well as examples of how you would like the feature to work.

## Submitting Pull Requests

When submitting a pull request, please ensure your branch meets the following criteria:

* The code follows our coding guidelines (TBC).

To be merged, we prefer the pull request to be reviewed by at least two people with merge rights.

## Submitting a Release

* Bump the version in `package.json`.
* Ensure the `CHANGELOG.md` is up to date.
* If releasing a minor version, create a branch from `master`.
* If releasing a patch version, create a branch from `release`.
* Commit and push changes.
* If releasing a minor version, open a PR to `master`.
* If releasing a patch version, open a PR to `release`.

## For Repository Maintainers

* Once merged, create a tag in either the release or master branch. e.g. `git tag v0.1.5`
* Push tag to Github.
* Draft a release in GitHub from the new tag.
* If you have merged into `release`, open a PR to merge back into `master`.

## CLA

To accept any third party contributions we require a Contributor License Agreement to be signed. Please find links to the relevent documents below:

* [Individual CLA](https://github.com/Sage/carbon/blob/master/cla/SAGE-CLA.docx)
* [Corporate CLA](https://github.com/Sage/carbon/blob/master/cla/SAGE-CCLA.docx)
