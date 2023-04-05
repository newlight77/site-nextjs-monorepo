import React from 'react';
import styles from './TextLink.module.css';
import { type TextBlock } from 'notion-model';

export const TextLink:  React.FC<TextBlock> = ({ id, text, annotations }: TextBlock ) => {

  return (
    <span
      className={[
        annotations.bold ? styles.bold : '',
        annotations.code ? styles.code : '',
        annotations.italic ? styles.italic : '',
        annotations.strikethrough ? styles.strikethrough : '',
        annotations.underline ? styles.underline : '',
        annotations.color ? annotations.color : '',
      ].join(' ')}
      key={id}
    >
      {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
    </span>
  );
}
