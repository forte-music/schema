#!/usr/bin/env node

const jest = require('jest');
const path = require('path');

const [apiLocation, ...args] = process.argv.slice(2);

if (!apiLocation) {
  throw new TypeError(
    'Please specify the api url of the endpoint to test as the first ' +
      'argument to this script.'
  );
}

process.env.API_URL = apiLocation;

const configPath = path.resolve(__dirname, 'jest.config.js');

jest.run(['-c', configPath, ...args]);
