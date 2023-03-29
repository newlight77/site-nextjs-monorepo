import React from 'react';

export type DarkmodeContextType = {
  darkMode: boolean;
  toogleDarkMode: () => void;
};

export const defaultThemeState: DarkmodeContextType = {
  darkMode: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toogleDarkMode: () => () => {},
};

export const DarkmodeThemeContext = React.createContext<DarkmodeContextType>(defaultThemeState);
