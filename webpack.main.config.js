require('webpack');

module.exports = () => {
  const outPath = __dirname;
  return {
    mode: 'production',
    target: 'electron-main',
    entry: './main.js',
    output: {
      path: outPath,
      filename: 'main.prod.js',
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
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      modules: ['node_modules'],
    },
  };
};
