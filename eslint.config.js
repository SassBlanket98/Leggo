// Leggo/eslint.config.js
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier"; // Turns off ESLint rules that conflict with Prettier
import globals from "globals"; // For defining global variables

export default tseslint.config(
  { // Global ignores
	ignores:,
  },
  eslintJs.configs.recommended, // ESLint's recommended base rules
  ...tseslint.configs.recommendedTypeChecked, // TypeScript-ESLint recommended rules that leverage type information [26, 28]
  // For projects not wanting type-aware linting initially, use:...tseslint.configs.recommended,
  { // Language options for TypeScript files - required for type-aware linting
	languageOptions: {
	  parserOptions: {
		project: true, // Path to your tsconfig.json, true will find it automatically
		tsconfigRootDir: import.meta.dirname, // Or process.cwd() if import.meta.dirname is not available
	  },
	},
  },
  { // React specific configuration
	files: ["src/**/*.{ts,tsx}"],
	plugins: {
	  react: reactPlugin,
	  "react-hooks": reactHooksPlugin,
	},
	languageOptions: {
	  ...reactPlugin.configs.flat.recommended.languageOptions, // Includes JSX parser options
	  globals: {
		...globals.browser, // Common browser globals
		...globals.node,    // Common Node.js globals (for config files, etc.)
		// React Native specific globals are often handled by eslint-plugin-react-native
	  }
	},
	settings: {
	  react: {
		version: "detect", // Automatically detect the React version
	  },
	},
	rules: {
	  ...reactPlugin.configs.recommended.rules,
	  ...reactHooksPlugin.configs.recommended.rules,
	  "react/react-in-jsx-scope": "off", // Not needed with new JSX transform (React 17+)
	  "react/prop-types": "off", // Using TypeScript for prop types
	  // Add custom rule overrides here
	  // Example: "react/jsx-curly-brace-presence": ["warn", { "props": "never", "children": "never" }],
	},
  },
  { // React Native specific configuration
	files: ["src/**/*.{ts,tsx}"],
	plugins: {
	  "react-native": reactNativePlugin,
	},
	languageOptions: { // Define React Native globals
	  globals: reactNativePlugin.environments.all.globals,
	},
	rules: {
	  ...reactNativePlugin.configs.all.rules, // Or a more curated set of rules
	  // Example: "react-native/no-inline-styles": "warn",
	  // "react-native/no-unused-styles": "warn",
	}
  },
  { // Prettier configuration - MUST BE LAST to override other formatting rules
	files: ["**/*.{js,jsx,ts,tsx,json}"], // Apply Prettier to all relevant files
	plugins: {
	  prettier: prettierPlugin,
	},
	rules: {
	  ...prettierConfig.rules, // Disables ESLint formatting rules that conflict with Prettier
	  "prettier/prettier": "warn", // Reports Prettier differences as ESLint warnings (can be "error")
	},
  }
);
