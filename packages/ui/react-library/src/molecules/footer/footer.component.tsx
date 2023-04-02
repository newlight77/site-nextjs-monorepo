import React, { FunctionComponent } from 'react';
import './footer.module.css';
import { Link } from '../../atoms/link/Link';

type Props = {
  version: string;
};

export const Footer: FunctionComponent<Props> = ({version}) => {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <span className="devTeam">
        Created by {' '}
        <Link href="https://www.oneprofile.io/newlight77">oneprofile.io</Link>
        {' ' + year} - Version {version}
      </span>
    </footer>
  )
}
