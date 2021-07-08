const { readdirSync } = require('fs');
const { join } = require('path');
const { bold, white } = require('../utils/colors');
const { createTable } = require('../utils/table');

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
  run: args => {
    const [query] = args.slice(1);

    if (query) {
      const command = readdirSync(COMMANDS_DIR)
        .map(name => name.replace('.js', ''))
        .find(name => name === query);
      if (!command) throw new Error(`Command "${query}" not found.`);

      const { description, flags } = require(join(COMMANDS_DIR, command));

      const usage = `\`Usage: ${bold(
        white(`brianna ${command}${flags ? ' [flags]' : ''}`)
      )}\``;

      const options = flags ? `\n\n${createTable(flags, 'Options:')}` : '';

      const info = `Visit ${bold(
        white(`https://briannacli.com/docs/${query}`)
      )} to learn more about this command.`;

      console.info(`${usage}\n\n${description}${options}\n\n${info}`);
    } else {
      const usage = `Usage: \`${bold(white('brianna <command> [flags]'))}\``;

      const commands = createTable(
        readdirSync(COMMANDS_DIR).map(name => require(join(COMMANDS_DIR, name))),
        'Commands:'
      );

      const instructions = `Run \`${bold(
        white('brianna help <command>')
      )}\` for more information on specific commands.`;

      const info = `Visit ${bold(
        white('https://briannacli.com')
      )} to learn more about Brianna.`;

      console.info(`${usage}\n\n${commands}\n\n${instructions}\n${info}`);
    }
  },
};

module.exports = help;
