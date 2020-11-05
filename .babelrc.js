module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'module-resolver',
      {
        alias: {
          actions: './src/actions/',
          components: './src/components/',
          containers: './src/containers/',
          hocs: './src/hocs/',
          reducers: './src/reducers/',
          sagas: './src/sagas/',
          selectors: './src/selectors/',
          services: './src/services/',
          store: './src/store/',
        },
      },
    ],
  ],
}
