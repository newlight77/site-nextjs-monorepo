import React, { FunctionComponent } from 'react';
import './footer.module.css';

type Props = {
  version: string;
};

export const Footer: FunctionComponent<Props> = ({version}) => {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <span className="devTeam">
        Created by {' '}
        <a
          className="link"
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
