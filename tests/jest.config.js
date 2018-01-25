module.exports = {
  globals: {
    API_URL: process.env.API_URL,
  },
  testEnvironment: 'node',
  transform: {
    '\\.js$': 'babel-jest',
    '\\.(gql|graphql)$': 'jest-raw-loader',
  },
  testMatch: ['<rootDir>/tests/*.js'],
};
