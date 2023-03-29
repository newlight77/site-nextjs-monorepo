import { DarkmodeThemeContext } from './darkmode-theme.context';
import React, { MouseEvent } from 'react';

export const DarkmodeThemeToggle = () => {
  const { darkMode, toogleDarkMode } = React.useContext(DarkmodeThemeContext);

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toogleDarkMode();
  };

  return (
    <div className="darkmode-theme__toggle">
      <button onClick={handleOnClick}>{darkMode ? '🌙' : '🌞'}</button>
    </div>
  );
}
