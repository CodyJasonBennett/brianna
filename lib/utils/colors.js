const ESC = '\x1b';

const white = text => `${ESC}[37m${text}${ESC}[39m`;
const yellow = text => `${ESC}[33m${text}${ESC}[39m`;
const red = text => `${ESC}[31m${text}${ESC}[39m`;
const blue = text => `${ESC}[34m${text}${ESC}[39m`;
const bold = text => `${ESC}[1m${text}${ESC}[22m`;

module.exports = {
  white,
  yellow,
  red,
  blue,
  bold,
};
