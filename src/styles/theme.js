import { createContext } from 'react';

export const themes = {
  light: {
    backgroundColor: '#F3F5FD',
    primaryColor: '#005680',
    inputBackgroundColor: '#FAFBFF',
    white: 'white',
    disabledColor: 'red',
  },
  dark: {
    backgroundColor: '#F3F5FD',
    primaryColor: '#005680',
    inputBackgroundColor: '#FAFBFF',
    white: 'white',
    disabledColor: 'red',
  },
};

export const ThemeContext = createContext();
