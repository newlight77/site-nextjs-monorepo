import React from 'react';
import { type Text, TextLink } from '../../atoms/text-link/TextLink';


type TextBlockProps = { 
  text: Text[];
};

export const TextBlock = ({ text}: TextBlockProps) => {

  if (!text) {
    return null;
  }

  return text.map((value: any) => {
    return (
      <TextLink key={value.id} {...value} />
    )
  });
};
