/* eslint global-require: off */

const developmentEnvironments = ['development', 'test'];

const developmentPlugins = [require('react-hot-loader/babel')];

const productionPlugins = [require('babel-plugin-transform-react-remove-prop-types')];

module.exports = api => {
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache

  const development = api.env(developmentEnvironments);

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { electron: require('electron/package.json').version },
          corejs: '3',
          useBuiltIns: 'usage'
        }
      ],
      [require('@babel/preset-react'), { development }]
    ],
    plugins: [
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      ...(development ? developmentPlugins : productionPlugins)
    ]
  };
};
