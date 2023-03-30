import React from 'react';
import styles from './TextLink.module.css';


export type Text = {
  content: string;
  link: { url : string } | null;
};

export type TextProps = {
  id: string;
  type: "text";
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href: string | null;
};

export type Annotations = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color:
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red"
    | "gray_background"
    | "brown_background"
    | "orange_background"
    | "yellow_background"
    | "green_background"
    | "blue_background"
    | "purple_background"
    | "pink_background"
    | "red_background";
};

export const TextLink:  React.FC<TextProps> = ({ id, text, annotations, ...other }: TextProps ) => {

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
