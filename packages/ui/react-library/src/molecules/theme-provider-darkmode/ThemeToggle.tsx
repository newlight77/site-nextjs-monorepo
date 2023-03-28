import { ThemeContext } from './ThemeContext';
import React, { MouseEvent } from 'react';
import './theme.module.css';

export const ThemeToggle = () => {
  const { darkMode, toogleDarkMode } = React.useContext(ThemeContext);

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toogleDarkMode();
  };

  return (
    <div className="darkmode__toggle">
      <button onClick={handleOnClick}>{darkMode ? '🌙' : '🌞'}</button>
    </div>
  );
}
