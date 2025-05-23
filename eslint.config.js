// Leggo/eslint.config.js
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    // Global ignores
    ignores: [
      'node_modules/',
      'android/',
      'ios/',
      'build/',
      'dist/',
      'coverage/',
      // Config files are usually at the root, let's be specific
      'babel.config.js',
      'metro.config.js',
      'jest.config.js',
      // Consider if you want to lint .prettierrc.js or other root .js files
      // '.prettierrc.js',
    ],
  },
  eslintJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname, // For ESM config file itself
      },
      globals: {
        ...globals.node, // For config files like this one
      }
    },
  },
  {
    // React specific configuration for TS/TSX files in src
    files: ['src/**/*.{ts,tsx}', 'App.tsx'], // Added App.tsx explicitly
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin, // Moved React Native plugin here as it's React specific
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser, // For React components that might use browser-like globals
        ...reactNativePlugin.environments.all.globals, // React Native globals
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Using TypeScript

      // React Native specific rules
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'off',
      'react-native/no-raw-text': 'warn', // Consider configuring this if needed
      'react-native/sort-styles': 'off',
    },
  },
  {
    // Prettier configuration - MUST BE LAST
    // Apply to JS, JSX, TS, TSX, JSON
    files: ['**/*.{js,jsx,ts,tsx,json}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
    },
  }
);