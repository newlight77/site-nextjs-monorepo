import React, { FunctionComponent } from 'react';

import styles from './header.module.css';

export const Header: FunctionComponent = () => {
  return (
      <div className={styles.header__nav}>
        <div className={styles.header__brand}>
          <a href="/">
            <img
              className={styles.header__brand_logo}
              src="images/oneprofile-logo.png"
              alt="logo"
            />
          </a>

          <h3 className={styles.header__brand_name}>
            Oneprofile: open community for developers.
          </h3>
        </div>
      </div>
  );
};
