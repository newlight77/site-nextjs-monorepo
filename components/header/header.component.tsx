import React, { FunctionComponent } from 'react';
import Link from 'next/link';

import styles from './header.module.css';

const Header: FunctionComponent = () => {
  return (
    <div className={styles.nav}>
      <div className={styles.brand}>
        <Link href="/">
          <img
            className={styles.brand__logo}
            src="images/oneprofile-logo.png"
            alt="logo"
          />
        </Link>

        <h3 className={styles.brand__name}>
          Oneprofile: open community for developers.
        </h3>
      </div>
    </div>
  );
};

export default Header;