// Leggo/eslint.config.js
import eslintJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier'; // Turns off ESLint rules that conflict with Prettier
import globals from 'globals'; // For defining global variables

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
      'metro.config.js',
      'babel.config.js',
      'jest.config.js',
      '.eslintrc.js', // if you are migrating from it
      '*.config.js', // if you have other .config.js files at root
    ],
  },
  eslintJs.configs.recommended, // ESLint's recommended base rules
  ...tseslint.configs.recommendedTypeChecked, // TypeScript-ESLint recommended rules that leverage type information
  {
    // Language options for TypeScript files - required for type-aware linting
    languageOptions: {
      parserOptions: {
        project: true, // Path to your tsconfig.json, true will find it automatically
        tsconfigRootDir: import.meta.dirname, // Or process.cwd() if import.meta.dirname is not available
      },
    },
  },
  {
    // React specific configuration
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions, // Includes JSX parser options
      globals: {
        ...globals.browser, // Common browser globals
        ...globals.node, // Common Node.js globals (for config files, etc.)
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform (React 17+)
      'react/prop-types': 'off', // Using TypeScript for prop types
    },
  },
  {
    // React Native specific configuration
    files: ['src/**/*.{ts,tsx}', 'App.tsx'], // Include App.tsx
    plugins: {
      'react-native': reactNativePlugin,
    },
    languageOptions: {
      // Define React Native globals
      globals: reactNativePlugin.environments.all.globals,
    },
    rules: {
      // Using a curated set of rules instead of all. 'all' can be very noisy.
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'off', // Can be noisy, adjust as needed
      'react-native/no-raw-text': 'warn',
      'react-native/sort-styles': 'off', // Optional, can be useful
    },
  },
  {
    // Prettier configuration - MUST BE LAST to override other formatting rules
    files: ['**/*.{js,jsx,ts,tsx,json}'], // Apply Prettier to all relevant files
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Disables ESLint formatting rules that conflict with Prettier
      'prettier/prettier': 'warn', // Reports Prettier differences as ESLint warnings (can be "error")
    },
  },
);
