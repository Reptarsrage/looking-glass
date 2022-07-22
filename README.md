# The Looking-Glass

![Github](https://github.com/Reptarsrage/looking-glass/workflows/CI/badge.svg)
![Codecov](https://codecov.io/gh/Reptarsrage/looking-glass/branch/main/graph/badge.svg?token=7j24nkzJrO)

## Description

A client for use with the [looking glass service application](https://github.com/Reptarsrage/looking-glass-service). Electron application to browse various website content from one app.

⚠ Built for development practice only. ⚠

## Install

Install the dependencies with `yarn`.

```bash
cd looking-glass
yarn install
```

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn run dev
```

## Test

Run unit tests using the `jest-cli` via `yarn` scripts:

```bash
# unit tests
yarn test

# watch
yarn test --watch

# test coverage
yarn test --coverage
```

> NOTE: More on the `jest-cli` here: https://jestjs.io/docs/en/cli

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Release

1. Run `yarn release` to run the semver release process
2. Run `git push --follow-tags origin <branch>`
3. Craft a new _draft_ release on GitHub with the tag created in Step 1
4. Create a PR and merge changes
5. Publish the GitHub release

## TODO (In no particular order)

- [x] Top Bar
- [x] Modal Controls
- [x] Gallery Nav
- [x] Search
- [x] Sort
- [x] Modules
- [x] Auth
- [x] Themes
- [x] Local file system
- [ ] Breadcrumbs
- [x] Column Slider + Settings
- [x] Error Handling + Images
- [ ] Route TRansitions?
- [x] Fix item tags
- [x] Fetch item tags
- [x] Fix video sources loading errors
- [ ] prev/next button hiding + search hiding
- [x] clear stuff when navigating
- [ ] hide sort/filter buttons when necessary
- [ ] Use skeletons instead of spinner
- [ ] add snackbar (toasts) for End of scroll + Errors + Download
- [x] video volume sync
- [x] update all zustand syntax
- [ ] use route for modal: https://stackblitz.com/github/remix-run/react-router/tree/main/examples/modal?file=src/App.tsx
- [ ] Pause videos when modal opens
- [ ] Start modal video at same time (maybe pause when zooming instead of showing poster?)
- [x] End of scroll indidicator
- [x] Avoid fetching more when navigating back
- [x] Fix modal title on light theme
- [ ] TESTS
- [ ] Masonry title popovers
