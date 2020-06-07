const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      version: 3,
      proposals: true
    }
  ],
  '@babel/preset-typescript',
];
const plugins = [
  '@babel/plugin-proposal-class-properties',
];

module.exports = { presets, plugins };
