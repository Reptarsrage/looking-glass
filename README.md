# The Looking-Glass

![Github](https://github.com/Reptarsrage/looking-glass/workflows/CI/badge.svg)
![Codecov](https://codecov.io/gh/Reptarsrage/looking-glass/branch/master/graph/badge.svg?token=7j24nkzJrO)

## Description

A client for use with the [looking glass service application](https://github.com/Reptarsrage/looking-glass-service). Electron application to browse various website content from one app.

⚠ Built for development practice only. ⚠

## Install

Install the dependencies with `yarn`.

```bash
cd your-project-name
yarn install
```

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
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

- [x] Add Scroll bar
- [ ] Fix modal to open from masonry item (continuous video)
- [x] Fix modal next/prev scrolls page (update item bounds)
- [x] Fix for search and switching galleries
- [x] Add Filters/Tags
- [ ] Add "The End" notification or something
- [x] Fix thumbnails/outline showing after image load (the size should be known right?)
- [x] Fix breadcrumbs during search
- [ ] Gif Scrubber
- [x] Fix updating view when switching galleries, and restoring scroll position
- [x] Add window title change based on current page
- [ ] Add settings for various customization (colors, autoplay, default sort, ect.)
- [ ] Better Unit Testing
- [ ] Better E2E Testing
- [ ] Add alternate tile view for home
- [ ] Improve file explorer with sorting/filters
- [ ] Improve file explorer with nested directory previews and parent navigation
- [ ] Fix images which fail to load breaking the view (remove them from items)
- [ ] Add more gallery information
- [ ] Add more custom context menu items
- [ ] Add custom menu items
- [ ] Fix configured server address for different environments
- [ ] Add custom icon
- [x] Modal close button instead of clicking anywhere
- [ ] Add keyboard navigation
- [ ] Add support for html5 pictures with multiple sources based on screen size
- [ ] Add support for multiple filters
- [ ] Add dedicated search page
- [ ] Add forward and backward navigation buttons
- [ ] Redesign app bar
- [ ] Add more consistent "Loading", "Error", "No results" indicators
- [ ] Add some fun art for the Not Found, Error boundary, ect. screens
- [ ] Make filters a separate url so navigation works
- [ ] Add bookmarks and/or favorites
