const ESC = '\x1b';

const colors = {
  white: text => `${ESC}[37m${text}${ESC}[39m`,
  yellow: text => `${ESC}[33m${text}${ESC}[39m`,
  red: text => `${ESC}[31m${text}${ESC}[39m`,
  blue: text => `${ESC}[34m${text}${ESC}[39m`,
  bold: text => `${ESC}[1m${text}${ESC}[22m`,
};

export default colors;
