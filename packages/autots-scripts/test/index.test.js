
const path = require('path');

process.chdir(path.join(__dirname, 'smoke/tpl'));

describe('autots-scripts unit case', () => {
  require('./units/webpack.base.test');
});

describe('autots-scripts smoke case', () => {
  require('./smoke/index.test');
});