import React from 'react';

interface PropsInput {
  type?: React.HTMLInputTypeAttribute | undefined;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
}

export const Input: React.FC<PropsInput> = ({ ...props }) => {
  return (
    <>
      <input {...props} />
    </>
  );
};
