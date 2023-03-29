import React, { useEffect } from 'react';
import { DarkmodeThemeContext, DarkmodeContextType } from './darkmode-theme.context';
import { DarkmodeThemeToggle } from './darkmode-theme-toggle';
import './darkmode-theme.module.css';

const defaultThemeState: DarkmodeContextType = {
  darkMode: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toogleDarkMode: () => () => {},
};


const changeDarkMode = (darkMode: boolean) => {
  switch (darkMode) {
    case true:
      document.body.classList.add("darkmode-theme__content");
      break;
    default:
      document.body.classList.remove("darkmode-theme__content");
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
    <DarkmodeThemeContext.Provider value={{ darkMode: darkMode, toogleDarkMode: toogleDark }}>
      <DarkmodeThemeToggle />
    </DarkmodeThemeContext.Provider>
  );
};
