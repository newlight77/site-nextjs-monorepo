import React, { FunctionComponent } from 'react';
import './header.module.css';
import { Logo } from '../../atoms';

export const Header: FunctionComponent = () => {
  return (
      <div className="header__nav">
        <div className="header__brand">
          <a href="/">
            <Logo />
          </a>

          <h3 className="header__brand_name">
            Oneprofile: open community for developers.
          </h3>
        </div>
      </div>
  );
};
