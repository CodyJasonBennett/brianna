const ESC = '\u001B[';
const ERASE_LINE = ESC + '2K';
const CURSOR_LEFT = ESC + 'G';

let prevLines = 0;

/**
 * Updates the console in place.
 */
export const updateLog = message => {
  const removed = new Array(prevLines).fill(ERASE_LINE).join(CURSOR_LEFT);
  process.stderr.write(removed, message);

  prevLines = message.split('\n').length;
};

let total;
let complete;
let incomplete;

/**
 * Update currently resolved module.
 */
export const logResolving = name => updateLog(`[1/2] Resolving: ${name}`);

/**
 * Use a friendly progress bar.
 */
export const prepareInstall = count => {
  updateLog('[1/2] Finished resolving.');

  total = count;
  complete = 0;
  incomplete = count;
};

/**
 * Update progress bar when tarball finishes.
 */
export const tickInstalling = () => {
  complete++;
  incomplete--;

  const template = '[2/2] Installing ';
  const width = Math.min(process.stderr.columns - template.length, total);

  const done = (complete / total) * width;
  const todo = (incomplete / total) * width;

  const bar = `${template}${'='.repeat(done)}${'-'.repeat(todo)}`;

  process.stderr.cursorTo(0);
  process.stderr.write(bar);
  process.stderr.clearLine(1);
};
