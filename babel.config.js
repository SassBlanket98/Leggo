// Leggo/babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'module-resolver',
    {
      root: ['./'], // Or './src' if all aliases are within src
      extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      alias: {
        '@': './src', // Maps '@/' to the 'src/' directory
      },
    },
  ],
  'react-native-reanimated/plugin', // This will be added later when setting up animations
],
};
