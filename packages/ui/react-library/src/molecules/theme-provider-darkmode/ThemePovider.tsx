import React, { useEffect } from 'react';
import { ThemeContext, ThemeContextType } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import './theme.module.css';

const defaultThemeState: ThemeContextType = {
  darkMode: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toogleDarkMode: () => () => {},
};


const changeDarkMode = (darkMode: boolean) => {
  switch (darkMode) {
    case true:
      document.body.classList.add("darkmode__content");
      break;
    default:
      document.body.classList.remove("darkmode__content");
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
