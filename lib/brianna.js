#!/usr/bin/env node
const { readdirSync } = require('fs');
const { join } = require('path');
const { red, blue, bold, white } = require('./utils/colors');

const COMMANDS_DIR = join(__dirname, 'commands');

try {
  const args = process.argv.slice(2);

  const [command = 'help'] = args;
  const commands = readdirSync(COMMANDS_DIR).map(name =>
    require(join(COMMANDS_DIR, name))
  );
  const handler = commands.find(({ aliases }) => aliases.includes(command));
  if (!handler) throw new Error(`Command "${command}" not found.`);

  handler.run(args);

  process.exit(0);
} catch (error) {
  console.info(
    `${red('error')} ${error.message}\n${blue('info')} Use ${bold(
      white('brianna help')
    )} for usage.`
  );

  process.exit(1);
}
