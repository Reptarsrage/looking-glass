require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const outPath = path.join(__dirname, 'dist');
  return {
    performance: { hints: false },
    devServer: {
      contentBase: outPath,
      host: '0.0.0.0',
      port: 4000,
      hot: true,
    },
    target: 'electron-renderer',
    entry: './src/index.jsx',
    // TODO: Issue with default source maps, see https://github.com/webpack/webpack/issues/3165
    devtool: isDev ? 'inline-source-map' : 'source-map',
    output: {
      path: outPath,
      filename: 'app.[hash].js',
      chunkFilename: '[name].[chunkhash].js',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: ['./src'],
                },
                sourceMap: isDev,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
      modules: ['node_modules'],
      alias: {
        'react-dom': isDev ? '@hot-loader/react-dom' : 'react-dom',
      },
    },
    plugins: [
      new HardSourceWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new CspHtmlWebpackPlugin(
        {
          'base-uri': "'self'",
          'script-src': isDev ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"] : "'self'",
          'style-src': ["'self'", "'unsafe-inline'"],
        },
        {
          nonceEnabled: {
            'script-src': false,
            'style-src': false,
          },
        }
      ),
      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),
    ],
  };
};
