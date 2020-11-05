const flexbugsFixesPlugin = require('postcss-flexbugs-fixes')
const presetEnvPlugin = require('postcss-preset-env')
const normalize = require('postcss-normalize')

module.exports = {
  plugins: [
    flexbugsFixesPlugin,
    presetEnvPlugin({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    normalize(),
  ],
}
