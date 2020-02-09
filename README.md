# The Looking-Glass

## Description

Electron application to browse various website content from one app. Built for development practice only.

## Install

Install the dependencies with yarn.

```bash
cd your-project-name
yarn
```

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Forked from [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

## TODO (In no particular order)

- [ ] Add Scroll bar
- [ ] Fix modal to open from masonry item (continuous video)
- [ ] Fix modal next/prev scrolls page (update item bounds)
- [x] Fix for search and switching galleries
- [ ] Add Filters/Tags
- [ ] Add "The End" notification or something
- [ ] Fix thumbnails/outline showing after image load (the size should be known right?)
- [ ] Fix breadcrumbs during search
- [ ] Gif Scrubber
- [ ] Fix updating view when switching galleries, and restoring scroll position
- [ ] Add window title change based on current page
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
