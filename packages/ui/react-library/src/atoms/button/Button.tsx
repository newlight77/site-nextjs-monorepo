import React from 'react';

type PropsButton = {
  className?: string;
  id?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  label?: string;
  children?: any;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button: React.FC<PropsButton> = ({
  label,
  children,
  ...props
}: PropsButton) => {
  return (
    <>
      <button {...props}>
        {label}
        {children}
      </button>
    </>
  );
};
