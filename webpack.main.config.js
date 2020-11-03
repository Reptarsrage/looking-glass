require('webpack')
const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')

module.exports = (webpackEnv) => {
  const isProduction = webpackEnv.production
  const isDevelopment = !isProduction

  const outPath = __dirname
  const entryPath = path.join(__dirname, 'main.js')

  return {
    mode: isDevelopment ? 'development' : 'production',
    target: 'electron-main',
    entry: entryPath,
    output: {
      path: outPath,
      filename: 'main.prod.js',
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin({ extractComments: false })],
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            compact: isProduction,
          },
        },
      ],
    },
  }
}
