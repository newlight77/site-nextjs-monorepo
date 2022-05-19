import React, { FunctionComponent } from 'react';

import styles from './footer.module.css';

const pjson = require('../../package.json')

const Footer: FunctionComponent = () => {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <span className={styles.devTeam}>
        Created by {' '}
        <a
          className={styles.link}
          href="https://www.oneprofile.io/newlight77"
          target="_blank"
        >
          oneprofile.io
        </a>
        {' ' + year} - Version {pjson.version}
      </span>
    </footer>
  )
}

export default Footer
