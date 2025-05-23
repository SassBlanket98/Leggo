import { getDefaultConfig } from 'metro-config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default (async () => {
  const config = await getDefaultConfig(__dirname);
  return config;
})();
