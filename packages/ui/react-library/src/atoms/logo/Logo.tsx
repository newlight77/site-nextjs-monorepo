import React from 'react';
import './Logo.module.css';

type PropsLogo = {
  size?: string;
  href?: string;
};

export const Logo: React.FC<PropsLogo> = ({size, href, ...rest}) => {

  const fontSize = size ? size : "2rem";
  return (
    <a className="logo" href={href} {...rest}>
      <span style={{
        fontFamily: "cursive",
        fontSize: fontSize,
        color: "rgb(255, 104, 93)"
      }}>One</span>
      <span style={{
        fontFamily: "cursive",
        fontSize: fontSize,
        color: "rgb(1, 213, 250)"
      }}>Profile</span>
    </a>
  )
};
