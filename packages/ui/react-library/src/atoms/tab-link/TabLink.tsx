import * as React from "react";

type TabLinkProps = {
  children: React.ReactNode;
  href: string;
}

export const TabLink: React.FC<TabLinkProps> = ({children, href, ...other}: TabLinkProps) => {
  return (
    <a target="_blank" rel="noreferrer" href={href} {...other}>
      {children}
    </a>
  );
};
