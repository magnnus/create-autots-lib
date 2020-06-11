const presets = [
  [
    '@babel/preset-env',
    {
      modules: false,
      useBuiltIns: 'entry',
      corejs: {
        version: 3,
        proposals: true,
      },
    },
  ],
  // '@babel/preset-typescript',
];
const plugins = [
  '@babel/plugin-transform-runtime',
  '@babel/plugin-syntax-dynamic-import',
];

module.exports = { presets, plugins };
