import React, { FunctionComponent } from 'react';

import styles from './footer.module.css';

type Props = {
  version: string;
};

export const Footer: FunctionComponent<Props> = ({version}) => {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <span className={styles.devTeam}>
        Created by {' '}
        <a
          className={styles.link}
          href="https://www.oneprofile.io/newlight77"
          target="_blank" rel="noreferrer"
        >
          oneprofile.io
        </a>
        {' ' + year} - Version {version}
      </span>
    </footer>
  )
}
