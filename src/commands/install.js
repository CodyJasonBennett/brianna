import colors from 'utils/colors';

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
  run: () => void console.info(colors.yellow('NOT IMPLEMENTED')),
};

export default install;
