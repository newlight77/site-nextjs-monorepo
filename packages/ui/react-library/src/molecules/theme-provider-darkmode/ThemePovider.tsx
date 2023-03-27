import React, { useEffect } from 'react';
import styles from './theme.module.css';
import { ThemeContext, ThemeContextType } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const defaultThemeState: ThemeContextType = {
  darkMode: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toogleDarkMode: () => () => {},
};


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

export const DarkmodeThemeProvider = () => {
  const [darkMode, setDarkMode] = React.useState(defaultThemeState.darkMode);

  const toogleDark = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    changeDarkMode(darkMode);
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode: darkMode, toogleDarkMode: toogleDark }}>
      <ThemeToggle />
    </ThemeContext.Provider>
  );
};
