import React, { FunctionComponent } from 'react';
import './header.module.css';

export const Header: FunctionComponent = () => {
  return (
      <div className="header__nav">
        <div className="header__brand">
          <a href="/">
            <img
              className="header__brand_logo"
              src="images/oneprofile-logo.png"
              alt="logo"
            />
          </a>

          <h3 className="header__brand_name">
            Oneprofile: open community for developers.
          </h3>
        </div>
      </div>
  );
};
