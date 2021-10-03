import { readdirSync } from 'fs';
import { join } from 'path';
import { createTable } from 'utils/table';
import colors from 'utils/colors';

const COMMANDS_DIR = join(__dirname, '../commands');

const help = {
  aliases: ['-h', 'help'],
  description: "Displays Brianna's commands and options.",
  flags: [
    {
      aliases: ['<command>'],
      description: 'Name of command to display additional info.',
    },
  ],
  run: (...args) => {
    const [query] = args;

    if (query) {
      const command = readdirSync(COMMANDS_DIR)
        .map(name => name.replace('.js', ''))
        .find(name => name === query);
      if (!command) throw new Error(`Command "${query}" not found.`);

      const { description, flags } = require(join(COMMANDS_DIR, command)).default;

      const usage = `\`Usage: ${colors.bold(
        colors.white(`brianna ${command}${flags ? ' [flags]' : ''}`)
      )}\``;

      const options = flags
        ? `\n\nOptions:${createTable(flags, 'aliases', 'description')}`
        : '';

      const info = `Visit ${colors.bold(
        colors.white(`https://briannacli.com/docs/${query}`)
      )} to learn more about this command.`;

      console.info(`${usage}\n\n${description}${options}\n\n${info}`);
    } else {
      const usage = `Usage: \`${colors.bold(
        colors.white('brianna <command> [flags]')
      )}\``;

      const commands = createTable(
        readdirSync(COMMANDS_DIR).map(name => require(join(COMMANDS_DIR, name)).default),
        'aliases',
        'description'
      );

      const instructions = `Run \`${colors.bold(
        colors.white('brianna help <command>')
      )}\` for more information on specific commands.`;

      const info = `Visit ${colors.bold(
        colors.white('https://briannacli.com')
      )} to learn more about Brianna.`;

      console.info(`${usage}\n\nCommands:${commands}\n\n${instructions}\n${info}`);
    }
  },
};

export default help;
