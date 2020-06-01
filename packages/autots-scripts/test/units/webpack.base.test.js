/* eslint-disable no-undef */

const { assert } = require('chai');
const baseConfig = require('../../lib/webpack.base');

describe('webpack.base.js test cases', () => {
  it('entry', () => {
    assert.equal(baseConfig.entry.main.includes('/test/smoke/tpl/src/index.ts'), true);
  });
});
