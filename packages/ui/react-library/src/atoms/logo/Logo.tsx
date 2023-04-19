import React from 'react';
import './Logo.module.css';

type PropsLogo = {
  size?: string;
};

export const Logo: React.FC<PropsLogo> = ({size}) => {

  const fontSize = size ? size : "2rem";
  return (
    <div className='logo'>
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
    </div>
  )
};
