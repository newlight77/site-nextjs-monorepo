import React, { useEffect, MouseEvent } from 'react';
import styles from './theme.module.css';

// const THEMES = [
//   'deepskyblue',
//   'darkindigoblue',
//   'lightseagreen',
//   'darkseagreen',
//   'peachpuff',
//   'salmon',
//   'orchid',
//   'blueviolet',
//   'lemonchiffon',
//   'gold',
// ];

export const ThemeSelector = () => {

  const [theme, setTheme] = React.useState('dark');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nextTheme = getNextTheme(theme)
    setTheme(nextTheme == undefined ? 'default' : nextTheme);
  };

  const getNextTheme = (theme: string) => {
    return {
      'default': 'white',
      'white': 'dark',
      'dark': 'peachpuff',
      'peachpuff': 'gold',
      'gold': 'deepskyblue',
      'deepskyblue': 'default'
    }[theme];
  }

  const getThemeIcon = (theme: string) => {
    return {
      'default': '🔅',
      'white': '🌞',
      'dark': '🌙',
      'peachpuff': '🍑',
      'gold': '✨',
      'deepskyblue': '💧'
    }[theme];
  }

  return (
    <div className={styles.darkmode__toggle}>
      <button onClick={handleOnClick}>{getThemeIcon(theme)}</button>
    </div>
  );
};
