import styles from './theme.module.css';
import { ThemeContext } from './ThemeContext';
import React, { MouseEvent } from 'react';

function ThemeToggle() {
  const { darkMode, toogleDarkMode } = React.useContext(ThemeContext);

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toogleDarkMode();
  };

  return (
    <div className={styles.darkmode__toggle}>
      <button onClick={handleOnClick}>{darkMode ? '🌙' : '🌞'}</button>
    </div>
  );
}

export default ThemeToggle;
