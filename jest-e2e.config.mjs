import defaultConfig from './jest.config.mjs';

const config = {
  ...defaultConfig,
  testRegex: '.e2e-test.js$',
};

export default config;
