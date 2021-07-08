const { readFileSync } = require('fs');
const { join } = require('path');

const ESC = '\x1b';

const white = text => `${ESC}[37m${text}${ESC}[39m`;
const yellow = text => `${ESC}[33m${text}${ESC}[39m`;
const red = text => `${ESC}[31m${text}${ESC}[39m`;
const blue = text => `${ESC}[34m${text}${ESC}[39m`;
const bold = text => `${ESC}[1m${text}${ESC}[22m`;

try {
  const args = process.argv.slice(2);

  const [command] = args;
  switch (command) {
    // @TODO installation logic
    case 'install':
    case undefined: {
      console.info(yellow('NOT IMPLEMENTED'));
      break;
    }
    case 'help':
    case '-h':
    case '--help': {
      const [query] = args.slice(1);

      if (query === 'install') {
        console.info(
          [
            `Usage: \`${bold(white('brianna install [flags]'))}\`\n`,
            'Brianna install is used to install all dependencies for a project.\n',
            'Options:',
            '  -P, --production  install production dependencies',
            '  -D, --save-dev    install package to your `devDependencies`',
            `\nVisit ${bold(
              white('https://briannacli.com/docs/install')
            )} to learn more about this command.`,
          ].join('\n')
        );
      } else if (query) {
        throw new Error(`Command "${query}" not found.`);
      } else {
        console.info(
          [
            `Usage: \`${bold(white('brianna <command> [flags]'))}\`\n`,
            'Options:',
            '  -h, --help     output usage information',
            '  -v, --version  output the version number',
            '\nCommands:',
            '  - install  installs local dependencies',
            `\nRun \`${bold(
              white('brianna help <command>')
            )}\` for more information on specific commands.`,
            `Visit ${bold(white('https://briannacli.com'))} to learn more about Brianna.`,
          ].join('\n')
        );
      }
      break;
    }
    case 'version':
    case '-v':
    case '--version': {
      const { version } = JSON.parse(readFileSync(join(__dirname, 'package.json')));
      console.info(version);
      break;
    }
    default: {
      throw new Error(`Command "${command}" not found.`);
    }
  }

  process.exit(0);
} catch (error) {
  console.info(
    `${red('error')} ${error.message}\n${blue('info')} Use ${bold(
      white('brianna --help')
    )} for usage.`
  );
}
