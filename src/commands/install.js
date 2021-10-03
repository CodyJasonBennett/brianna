import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { readLock, writeLock } from 'core/lock';
import list from 'core/list';
import { prepareInstall } from 'core/console';
import { sortKeys } from 'utils/package';

const install = {
  aliases: ['-i', 'install'],
  description: 'Installs all dependencies for a project.',
  flags: [
    {
      aliases: ['-P', '--production'],
      description: 'install production dependencies',
    },
    {
      aliases: ['-D', '--save-dev'],
      description: 'install package to your `devDependencies`',
    },
  ],
  run: async (...args) => {
    const production = ['--production', '-P'].includes(args);
    const dev = ['--save-dev', '--dev', '-D'].includes(args);

    const packages = args.filter(arg => !arg.startsWith('-'));

    // Find and read `package.json`.
    const jsonPath = join(process.cwd(), 'package.json');
    const root = JSON.parse(readFileSync(jsonPath));

    // Populate `package.json` from `brianna install`.
    if (packages.length) {
      if (dev) {
        root.devDependencies = root.devDependencies || {};
        packages.forEach(pkg => (root.devDependencies[pkg] = ''));
      } else {
        root.dependencies = root.dependencies || {};
        packages.forEach(pkg => (root.dependencies[pkg] = ''));
      }
    }

    // Only resolve production dependencies in production mode.
    if (production) {
      delete root.devDependencies;
    }

    // Read the lock file.
    readLock();

    // Generate the dependencies information.
    const info = await list(root);

    // Save the lock file
    writeLock();

    // Compute packages for progress bar.
    prepareInstall(Object.keys(info.topLevel).length + info.unsatisfied.length);

    // Install top level packages.
    await Promise.all(
      Object.entries(info.topLevel).map(([name, { url }]) => install(name, url))
    );

    // Install packages which have conflicts.
    await Promise.all(
      info.unsatisfied.map(item =>
        install(item.name, item.url, `/node_modules/${item.parent}`)
      )
    );

    // Pretty `package.json`.
    if (root.dependencies) {
      root.dependencies = sortKeys(root.dependencies);
    }

    if (root.devDependencies) {
      root.devDependencies = sortKeys(root.devDependencies);
    }

    // Save the `package.json` file.
    writeFileSync(jsonPath, JSON.stringify(root, null, 2));
  },
};

export default install;
