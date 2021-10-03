import { join } from 'path';
import { mkdirSync } from 'fs';
import fetch from 'node-fetch';
import { extract } from 'tar';
import { tickInstalling } from './console';

/**
 * Handle dependency installation.
 */
const install = async (name, url, location = '') => {
  // Prepare for the directory which is for installation
  const path = join(process.cwd(), location, `/node_modules/${name}`);

  // Create directories recursively.
  mkdirSync(path, {
    mode: 0o777,
    recursive: true,
  });

  // Extract readable stream and update progress bar.
  const response = await fetch(url);
  response.body.pipe(extract({ cwd: path, strip: 1 })).on('close', tickInstalling);
};

export default install;
