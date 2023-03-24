import React, { FunctionComponent } from 'react';
import Link from 'next/link';

import styles from './header.module.css';

const Header: FunctionComponent = () => {
  return (
      <div className={styles.header__nav}>
        <div className={styles.header__brand}>
          <Link href="/">
            <img
              className={styles.header__brand_logo}
              src="images/oneprofile-logo.png"
              alt="logo"
            />
          </Link>

          <h3 className={styles.header__brand_name}>
            Oneprofile: open community for developers.
          </h3>
        </div>
      </div>
  );
};

export default Header;