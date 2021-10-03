import fetch from 'node-fetch';

// Support custom registry.
const REGISTRY = process.env.REGISTRY || 'https://registry.npmjs.org/';

// Use cache to prevent duplicated network requests.
const cache = Object.create(null);

/**
 * Resolves a package by name.
 */
const resolve = async name => {
  if (cache[name]) return cache[name];

  const response = await fetch(`${REGISTRY}${name}`);

  const json = await response.json();
  if (json.error) {
    throw new ReferenceError(`No such package: ${name}`);
  }

  // Add the manifest info to cache and return it.
  return (cache[name] = json.versions);
};

export default resolve;
