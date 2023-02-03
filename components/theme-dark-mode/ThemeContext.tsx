import React, { useEffect } from 'react';
import styles from './theme.module.css';

export const THEMES = {
  dark: '',
  bluesky: 'bluesky',
  seagreen: 'seegreen',
  salmon: 'salmon',
  peach: 'peach',
  orchid: 'orchid',
  limon: 'limon',
  gold: 'gold',
};

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

const changeDarkMode = (darkMode: boolean) => {
  switch (darkMode) {
    case true:
      document.body.classList.add(styles.darkmode__content);
      break;
    default:
      document.body.classList.remove(styles.darkmode__content);
      break;
  }
};

export const ThemeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = React.useState(defaultThemeState.darkMode);

  const toogleDark = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    changeDarkMode(darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode: darkMode, toogleDarkMode: toogleDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
