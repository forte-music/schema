module.exports = {
  globals: {
    API_URL: process.env.API_URL,
  },
  testEnvironment: 'node',
  transform: {
    '\\.js$': 'babel-jest',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  testMatch: ['<rootDir>/tests/*.js'],

  // Jest assumes it isn't running from inside node_modules.
  // https://github.com/facebook/jest/issues/2145
  haste: {
    providesModuleNodeModules: ['.*'],
  },
  transformIgnorePatterns: ['<rootDir>/../node_modules/'],
  testPathIgnorePatterns: ['<rootDir>/../node_modules/'],
};
