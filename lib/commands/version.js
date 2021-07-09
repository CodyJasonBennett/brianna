const { readFileSync } = require('fs');
const { join } = require('path');

const version = {
  aliases: ['-v', 'version'],
  description: "Get Brianna's current version.",
  run: () => {
    const { version } = JSON.parse(readFileSync(join(__dirname, '../../package.json')));
    console.info(version);

    return version;
  },
};

module.exports = version;
