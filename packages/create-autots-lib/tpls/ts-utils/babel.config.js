const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: {
        version: '3.6',
        proposals: true,
      },
    },
  ],
  // '@babel/preset-typescript',
];
const plugins = [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: 3,
      useESModules: true,
    },
  ],
];

module.exports = { presets, plugins };
