/* eslint import/no-unresolved: off, import/no-self-import: off, import/no-extraneous-dependencies: off */
require('@babel/register');

module.exports = require('./webpack.config.renderer.dev.babel').default;
