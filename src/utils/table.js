/**
 * Calculates table padding.
 */
export const getPadding = (items, key, offset = 2) => {
  const [tableLength] = items
    .map(item => {
      const target = key ? item[key] : item;
      return (target.join?.(', ') || target).length;
    })
    .sort((a, b) => b - a);
  const tablePadding = tableLength + offset;

  return tablePadding;
};

/**
 * Generates spaces needed to fill padding.
 */
export const getSpaces = (items, padding) =>
  ' '.repeat(padding - (items.join?.(', ') || items).length);

/**
 * Formats a table from items.
 */
export const createTable = (items, ...keys) => {
  const table = items.reduce((acc, item) => {
    acc += '\n  ';

    Object.entries(item)
      .filter(([key]) => (keys?.length ? keys.includes(key) : key))
      .forEach(([key, value]) => {
        const padding = getPadding(items, key);
        const spaces = getSpaces(value, padding);

        acc += `${value.join?.(', ') || value}${spaces}`;
      });

    return acc;
  }, '');

  return table;
};
