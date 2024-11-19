/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'jest-preset-angular',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  coverageReporters: ['html'],
  testPathIgnorePatterns: ['/node_modules/'],
};
