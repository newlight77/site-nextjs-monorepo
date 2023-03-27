import * as React from "react";

export const TabLink = ({
  children,
  href,
  ...other
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <a target="_blank" rel="noreferrer" href={href} {...other}>
      {children}
    </a>
  );
};
