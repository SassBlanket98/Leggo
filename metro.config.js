const { getDefaultConfig } = require('metro-config');
const { fileURLToPath } = require('url'); // This might still be tricky in CJS context for __dirname
const { dirname } = require('path');

// A more traditional way to get __dirname in a CJS file:
// const __dirname = dirname(require.main.filename); // Or simply __dirname if not using ESM features

module.exports = (async () => {
  // For CJS, ensure __dirname is correctly resolved.
  // If this file is truly treated as CJS by Metro's config loader,
  // __dirname should be available directly.
  // If it's loaded in an ESM context by Node due to package.json "type": "module",
  // then the original import.meta.url approach is more appropriate.
  const { mergeConfig } = require('metro-config'); // getDefaultConfig might not be directly suitable here
  const defaultConfig = await getDefaultConfig(__dirname); // If __dirname is correctly polyfilled or available

  // It's often safer to get the default config and then merge customisations
  // For a simple default, the original approach of calling getDefaultConfig might be fine
  // if Metro's environment handles the ESM `metro.config.js` correctly.

  return defaultConfig; // Or mergeConfig(defaultConfig, yourCustomConfig)
})();