# HealthCare Locator SDK for JavaScript

This repository is a monorepository of all the JavaScript projects related to the
HealthCare Locator SDK.

## Packages

| Package                                                  | Version | Description                                            |
| -------------------------------------------------------- | ------- | ------------------------------------------------------ |
| `@healthcarelocator/sdk-core` | `0.2.0`     | Common elements such as typings and default properties |
| [`@healthcarelocator/sdk-web`](./packages/hcl-sdk-web-ui/README.md) | `0.3.0`     | Web Component to integrate the Hcl SDK inside applications |
| [`@healthcarelocator/sdk-angular`](./packages/hcl-sdk-web-ui-angular/projects/hcl-sdk/README.md) | `0.0.28`     | Angular Component to integrate the Hcl SDK inside applications |
| [`@healthcarelocator/sdk-react`](./packages/hcl-sdk-web-ui-react/README.md) | `0.1.19`     | React Component to integrate the Hcl SDK inside applications |
| [`hcl-sdk-web-devtools`](./packages/hcl-sdk-web-devtools/README.md) | `0.2.0`     | Developer tools to live customize the SDK |

## Contribute

### How to generate changelog

Use @changesets/cli to bump version easier. Workflow:

* When need to note down some change that is worth notice, run `yarn changeset`, answer cli questions (minor/patch or major and change summary), it will write that change as a markdown file in .changeset directory.
* When need to bump version, run `yarn changeset version`, the tool will combine changes from above markdown files, write it into CHANGELOG.md, remove those markdown files and also auto bump the version in package.json for us.

### How to test pushblishing package end-to-end locally

- Remove folders `.angular`, `build`, `node_moduels`, revert any changes in yarn.lock in `examples/web/angular` to make sure everything as new.

- Using `scripts/e2e-build-example.sh` to build, publish package to a local registry and then install in `examples/web/angular`.

- Then go insde `examples/web/angular`, check version of sdk packages inside `node_modules` and `yarn start` to do a smoke test to see if everything ok.

- Run `scripts/cleanup-verdaccio-storage.sh` to clean up local registry and set registry back to the defaults of npm and yarn.

Reference: [Verdaccio](https://verdaccio.org/docs/what-is-verdaccio)