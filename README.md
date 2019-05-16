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
yarn electron-dev
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn electron-pack
```
