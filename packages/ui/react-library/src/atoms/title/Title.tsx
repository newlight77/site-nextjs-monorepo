import React, { ReactNode } from 'react';
import './title.module.css';

interface ComponentProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  format?: React.ElementType;
}

interface TitleProps extends ComponentProps {
  className?: string;
  id?: string;
  label: string;
}

export const Title = ({ format: head = 'h1', label, ...props }: TitleProps) => {
  return (<head {...props}>{label}</head>);
};
