import React, { FunctionComponent } from 'react';
import './header.module.css';
import { Logo } from '../../atoms';

export const Header: FunctionComponent = () => {
  return (
      <div className="header__nav">
        <div className="header__container">
          <div className="header__logo">
            <Logo size={"2.2rem"} href="/" />
          </div>
          <div className="header__content">
            <div className="header_spacer"></div>
            <h1 className="header__title">
            Knowledgebase for engineers
            </h1>
            <h3 className="header__subtitle">
            Crafting Software with care
            </h3>
          </div>
        </div>
      </div>
  );
};
