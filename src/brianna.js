#!/usr/bin/env node
import { readdirSync } from 'fs';
import { join } from 'path';
import colors from 'utils/colors';

const COMMANDS_DIR = join(__dirname, 'commands');

try {
  const args = process.argv.slice(2);
  const [command = 'help'] = args;

  const commands = readdirSync(COMMANDS_DIR).map(
    name => require(join(COMMANDS_DIR, name)).default
  );
  const handler = commands.find(({ aliases }) => aliases.includes(command));
  if (!handler) throw new Error(`Command "${command}" not found.`);

  handler.run(...args);
} catch (error) {
  console.info(
    `${colors.red('error')} ${error.stack}\n${colors.blue('info')} Use ${colors.bold(
      colors.white('brianna help')
    )} for usage.`
  );
}
