import React from 'react';

interface PropsInput {
  type?: React.HTMLInputTypeAttribute | undefined;
  label?: string;
  value?: string;
  className?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
}

export const Input: React.FC<PropsInput> = ({ id, label, value, placeholder, className, required, ...props }) => {
  return (
    <>
      <div className={className}>
        <p>
        {label}
        </p>
        <div>
          <input id={id} {...props} placeholder={placeholder} required={required}>
          {value}
          </input>
        </div>
      </div>
    </>
  );
};
