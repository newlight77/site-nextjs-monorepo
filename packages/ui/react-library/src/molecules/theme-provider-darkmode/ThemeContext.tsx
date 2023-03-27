import React from 'react';

export type ThemeContextType = {
  darkMode: boolean;
  toogleDarkMode: () => void;
};

export const defaultThemeState: ThemeContextType = {
  darkMode: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toogleDarkMode: () => () => {},
};

export const ThemeContext = React.createContext<ThemeContextType>(defaultThemeState);
