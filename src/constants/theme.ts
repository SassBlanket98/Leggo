// src/constants/theme.ts
export const theme = {
  colors: {
    primary: '#FF6347', // Tomato
    primaryDark: '#E5533D',
    secondary: '#4682B4', // SteelBlue
    background: '#FFFFFF',
    cardBackground: '#F8F8F8',
    text: '#333333',
    lightGray: '#D3D3D3',
    mediumGray: '#A9A9A9',
    darkGray: '#696969',
    error: '#D9534F', // A Bootstrap-like error red
    success: '#5CB85C', // A Bootstrap-like success green
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as 'bold',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 12,
    },
    button: {
      fontSize: 16,
      fontWeight: 'bold' as 'bold',
    },
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
  },
  // ... add other theme properties like fonts, etc.
};
