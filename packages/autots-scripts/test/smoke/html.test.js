/* eslint-disable no-undef */
const glob = require('glob-all');

describe('checking html files generated', () => {
  it('should generate html file', (done) => {
    const files = glob.sync([
      './dist/index.html',
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('no html files generated!');
    }
  });
});
