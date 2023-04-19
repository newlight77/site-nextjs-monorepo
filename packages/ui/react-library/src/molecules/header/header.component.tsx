import React, { FunctionComponent } from 'react';
import './header.module.css';
import { Logo } from '../../atoms';

export const Header: FunctionComponent = () => {
  return (
      <div className="header__nav">
        <div className="header__brand">
          <a href="/">
            <Logo size={"2.2rem"}/>
          </a>

          <h3 className="header__brand_name">
            An open community for developers.
          </h3>
        </div>
      </div>
  );
};
