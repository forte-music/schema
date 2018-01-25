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
};
