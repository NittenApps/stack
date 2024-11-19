const { pathsToModuleNameMapper } = require('ts-jest');
const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/projects/nittenapps/forms'],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@nittenapps/forms': ['projects/nittenapps/forms/src/public-api'],
      '@nittenapps/forms/testing': ['projects/nittenapps/forms/testing/src/private-api'],
    },
    { prefix: '<rootDir>/' }
  ),
};
