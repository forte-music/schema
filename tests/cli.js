const jest = require('jest');
const path = require('path');

const [runtimePath, scriptPath, apiLocation, ...args] = process.argv;

if (!apiLocation) {
  throw new TypeError(
    'Please specify the api url of the endpoint to test as the first ' +
      'argument to this script.'
  );
}

process.env.API_URL = apiLocation;

const configPath = path.resolve(__dirname, 'jest.config.js');

jest.run(['-c', configPath, ...args]);
