# Contributing to TF wrapper

Want to contribute to the TF wrapper? There are a few things you need to know.

## Code of Conduct

GenStackIO has adopted the Contributor Covenant as its Code of Conduct, and we expect project participants to adhere to it. Please read the full text so that you can understand what actions will and will not be tolerated.

## Open Development

All work on GenStackIO happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## Semantic Versioning

This repository follows semantic versioning. We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance. Learn more about our commitment to stability and incremental migration in our versioning policy.

## Branch Organization

Submit all changes directly to the main branch. We don’t use separate branches for development or for upcoming releases. We do our best to keep main in good shape, with all tests passing.

Code that lands in main must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of main at any time.

## Feature Flags

To keep the main branch in a releasable state, breaking changes and experimental features must be gated behind a feature flag.

## Sending a Pull Request

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

Before submitting a pull request, please make sure the following is done:

1. Fork the repository and create your branch from main.
2. `make`.
3. If you’ve fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`make test`).
5. Format your code with prettier (`make format`).
6. Make sure your code lints (`make lint`).


