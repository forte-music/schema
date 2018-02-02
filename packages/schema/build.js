// A bit of code to convert the toml code in fixtures to json for use
// without processing.

const fs = require('fs');
const path = require('path');
const toml = require('toml');

const getExtension = path => path.substring(path.indexOf('.') + 1);

const fixturesPath = './fixtures';

const fileNames = fs
  .readdirSync(fixturesPath)
  .map(path => String(path))
  .filter(path => getExtension(path) === 'toml');

fileNames.forEach(fileName => {
  const fullInputPath = path.join(fixturesPath, fileName);
  const fileContents = String(fs.readFileSync(fullInputPath));

  const parsed = toml.parse(fileContents);
  const transformed = JSON.stringify(parsed);

  const basename = path.basename(fileName, '.toml');
  const outputPath = path.join(fixturesPath, `${basename}.json`);

  fs.writeFileSync(outputPath, transformed);
});
