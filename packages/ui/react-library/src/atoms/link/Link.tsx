import React from 'react';

type PropsLink = {
  href?: string;
  children?: any;
};

export const Link: React.FC<PropsLink> = ({ href, children }) => {
  return (
    <>
      <a className="link"
          href={href}
          target="_blank" rel="noreferrer"
        >
          {children}
      </a>
    </>
  );
};
