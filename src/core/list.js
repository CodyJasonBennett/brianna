import { maxSatisfying, satisfies } from 'semver';
import { getItem, updateOrCreate } from './lock';
import resolve from './resolve';
import { logResolving } from './console';

// Flattens dependency tree to avoid duplicates.
const topLevel = Object.create(null);

// Track dependency conflicts.
const unsatisfied = [];

const collectDeps = async (name, constraint, stack = []) => {
  // Retrieve a single manifest by name from the lock.
  const fromLock = getItem(name, constraint);

  // Fetch the manifest information.
  const manifest = fromLock || (await resolve(name));

  // Add currently resolving module to CLI.
  logResolving(name);

  // Use latest version of package.
  const versions = Object.keys(manifest);
  const matched = constraint
    ? maxSatisfying(versions, constraint)
    : versions[versions.length - 1]; // The last one is the latest.
  if (!matched) {
    throw new Error('Cannot resolve suitable package.');
  }

  if (!topLevel[name]) {
    topLevel[name] = { url: manifest[matched].dist.tarball, version: matched };
  } else if (satisfies(topLevel[name].version, constraint)) {
    const conflictIndex = checkStackDependencies(name, matched, stack);
    if (conflictIndex === -1) return;

    // Add dependency if peer conflicts.
    unsatisfied.push({
      name,
      parent: stack
        .map(({ name }) => name)
        .slice(conflictIndex - 2)
        .join('/node_modules/'),
      url: manifest[matched].dist.tarball,
    });
  } else {
    // Add dependency if semver conflicts.
    unsatisfied.push({
      name,
      parent: stack[stack.length - 1].name,
      url: manifest[matched].dist.tarball,
    });
  }

  // Dependencies of packages.
  const dependencies = manifest[matched].dependencies || null;

  // Save the manifest to the new lock.
  updateOrCreate(`${name}@${constraint}`, {
    version: matched,
    url: manifest[matched].dist.tarball,
    shasum: manifest[matched].dist.shasum,
    dependencies,
  });

  // Collect dependencies of packages.
  if (dependencies) {
    stack.push({
      name,
      version: matched,
      dependencies,
    });
    await Promise.all(
      Object.entries(dependencies)
        // Prevent dependency circulation
        .filter(([dep, range]) => !hasCirculation(dep, range, stack))
        .map(([dep, range]) => collectDeps(dep, range, stack.slice()))
    );
    stack.pop();
  }

  // Add missing semantic version range to `package.json`.
  if (!constraint) return { name, version: `^${matched}` };
};

/**
 * Check dependency conflicts of other packages.
 */
const checkStackDependencies = (name, version, stack) =>
  stack.findIndex(({ dependencies }) => {
    // Early return if not dependency of another package.
    if (!dependencies[name]) return true;

    // Semantic version checking.
    return satisfies(version, dependencies[name]);
  });

/**
 * Checks for dependency circulation in stack.
 */
const hasCirculation = (name, range, stack) => {
  return stack.some(item => item.name === name && satisfies(item.version, range));
};

/**
 * Collect and list dependencies.
 */
const list = async rootManifest => {
  // Process production dependencies
  if (rootManifest.dependencies) {
    (
      await Promise.all(
        Object.entries(rootManifest.dependencies).map(pair => collectDeps(...pair))
      )
    )
      .filter(Boolean)
      .forEach(item => (rootManifest.dependencies[item.name] = item.version));
  }

  // Process development dependencies
  if (rootManifest.devDependencies) {
    (
      await Promise.all(
        Object.entries(rootManifest.devDependencies).map(pair => collectDeps(...pair))
      )
    )
      .filter(Boolean)
      .forEach(item => (rootManifest.devDependencies[item.name] = item.version));
  }

  return { topLevel, unsatisfied };
};

export default list;
