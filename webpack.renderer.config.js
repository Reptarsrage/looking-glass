const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = (webpackEnv) => {
  const isProduction = webpackEnv.production
  const isDevelopment = !isProduction

  const outputPath = path.resolve(__dirname, 'dist')
  const srcPath = path.resolve(__dirname, 'src')
  const entryPath = path.resolve(srcPath, 'index.jsx')

  return {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    entry: entryPath,
    output: {
      path: outputPath,
      filename: isDevelopment ? 'bundle.js' : '[name].[contenthash:8].js',
      chunkFilename: isDevelopment ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
    },
    devServer: {
      static: {
        directory: outputPath,
      },
      hot: true,
      open: false,
      host: '0.0.0.0',
      port: 4000,
    },
    target: 'electron-renderer',
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new TerserPlugin({ extractComments: false }), new OptimizeCSSAssetsPlugin()],
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                name: '[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: srcPath,
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
                compact: isProduction,
                plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean),
              },
            },
            {
              test: /\.css$/,
              use: [
                isDevelopment && 'style-loader',
                isProduction && {
                  loader: MiniCssExtractPlugin.loader,
                },
                {
                  loader: 'css-loader',
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: isDevelopment,
                  },
                },
              ].filter(Boolean),
            },
            {
              loader: 'file-loader',
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: '[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(srcPath, 'index.html'),
        minify: isProduction,
      }),
      isProduction &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].chunk.css',
        }),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment &&
        new ReactRefreshWebpackPlugin({
          // https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/451
          overlay: false,
        }),
    ].filter(Boolean),
  }
}
