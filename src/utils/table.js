/**
 * Calculates table padding.
 */
export const getPadding = (items, key, offset = 2) => {
  const [tableLength] = items
    .map(item => (key ? item[key] : item).join(', ').length)
    .sort((a, b) => b - a);
  const tablePadding = tableLength + offset;

  return tablePadding;
};

/**
 * Generates spaces needed to fill padding.
 */
export const getSpaces = (items, padding) =>
  ' '.repeat(padding - items.join(', ').length);

/**
 * Formats a table from core items.
 */
export const createTable = (items, header = '') => {
  const padding = getPadding(items, 'aliases');

  const table = items.reduce((acc, { aliases, description }) => {
    acc += `\n  ${aliases.join(', ')}${getSpaces(aliases, padding)}${description}`;
    return acc;
  }, header);

  return table;
};
