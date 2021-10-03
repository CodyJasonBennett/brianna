import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { sortKeys } from 'utils/package';

/*
 * Used for reading lock file.
 */
const storedLock = Object.create(null);

/**
 * Used for writing to lock file.
 */
const newLock = Object.create(null);

/**
 * Save, create, and update package information to lock.
 */
export const updateOrCreate = (name, info) => {
  // Create it if that information is not existed in the lock.
  if (!newLock[name]) {
    newLock[name] = Object.create(null);
  }

  // Then update it.
  Object.assign(newLock[name], info);
};

/**
 * Retrieve package by name and semver range.
 */
export const getItem = (name, constraint) => {
  // Retrive an item by key from the lock file.
  const item = storedLock[`${name}@${constraint}`];
  if (!item) return null;

  // Convert data structure.
  return {
    [item.version]: {
      dependencies: item.dependencies,
      dist: { shasum: item.shasum, tarball: item.url },
    },
  };
};

/**
 * Save lock file to disk.
 */
export const writeLock = () => {
  writeFileSync(join(process.cwd(), 'brianna.lock'), sortKeys(newLock));
};

/**
 * Read lock file from disk if present.
 */
export const readLock = () => {
  if (!existsSync(join(process.cwd(), 'brianna.lock'))) return;

  Object.assign(storedLock, readFileSync(join(process.cwd(), 'brianna.lock'), 'utf-8'));
};
