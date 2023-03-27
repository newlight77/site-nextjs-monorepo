import React, { ReactNode } from 'react';
import './textarea.module.css';

type TextareaProps = {
  type?: string;
  className?: string;
  children?: ReactNode;
  label?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  id?: string;
  placeholder?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ children, ...props }: TextareaProps) => {
  return <textarea {...props}>{children}</textarea>;
};
