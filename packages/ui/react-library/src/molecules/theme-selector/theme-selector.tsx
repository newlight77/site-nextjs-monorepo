import React, { useEffect, MouseEvent } from 'react';
import './theme-selector.module.css';
import { Tooltip } from '../../atoms/Tooltip/Tooltip';

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
    setTheme(nextTheme == undefined ? 'orchid' : nextTheme);
  };

  const getNextTheme = (theme: string) => {
    return {
      'orchid': 'white',
      'white': 'dark',
      'dark': 'peachpuff',
      'peachpuff': 'gold',
      'gold': 'deepskyblue',
      'deepskyblue': 'orchid'
    }[theme];
  }

  const getThemeIcon = (theme: string) => {
    return {
      'orchid': '🟣',
      'white': '🌞',
      'dark': '🌙',
      'peachpuff': '🍑',
      'gold': '✨',
      'deepskyblue': '💧'
    }[theme];
  }

  return (
    <div className="theme-selector__toggle">
      <Tooltip text={theme} position="below">
        <button onClick={handleOnClick}>{getThemeIcon(theme)}</button>
      </Tooltip>
    </div>
  );
};
