/**
 * Calculates table padding.
 */
const getPadding = (items, key) => {
  const [tableLength] = items
    .map(item => (key ? item[key] : item).join(', ').length)
    .sort((a, b) => b - a);
  const tablePadding = tableLength + 2;

  return tablePadding;
};

/**
 * Generates spaces needed to fill padding.
 */
const getSpaces = (items, padding) => {
  console.log(items, padding);
  return ' '.repeat(padding - items.join(', ').length);
};

/**
 * Formats a table from core items.
 */
const createTable = (items, header = '') => {
  const padding = getPadding(items, 'aliases');

  const table = items.reduce((acc, { aliases, description }) => {
    acc += `\n  ${aliases.join(', ')}${getSpaces(aliases, padding)}${description}`;
    return acc;
  }, header);

  return table;
};

module.exports = { getPadding, getSpaces, createTable };
