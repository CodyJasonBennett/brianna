/**
 * Sorts `package.json` keys alphabetically.
 */
export const sortKeys = obj => {
  return Object.keys(obj)
    .sort()
    .reduce((total, current) => {
      total[current] = obj[current];
      return total;
    }, Object.create(null));
};
