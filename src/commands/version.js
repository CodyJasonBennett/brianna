import { readFileSync } from 'fs';
import { join } from 'path';

const version = {
  aliases: ['-v', 'version'],
  description: "Get Brianna's current version.",
  run: () => {
    const { version } = JSON.parse(readFileSync(join(__dirname, '../../package.json')));
    console.info(version);

    return version;
  },
};

export default version;
