import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Annotations, Text, TextLink } from './TextLink';

const text: Text = {
  content: "my content as link",
  link: { url: "url" }
};

const annotations: Annotations = {
  bold: true,
  italic: true,
  strikethrough: true,
  underline: true,
  code: true,
  color: "blue"
};

const other: any = {
  type: 'text',
  plain_text: '',
  href: null
};

describe('TextLink component testing', () => {
  it('Should render a text link with "Send" label', () => {

    render(<TextLink id={'id'} text={text} annotations={annotations} {...other} />);

    const element = screen.getByText('my content as link');
    expect(element).toBeDefined();
  });
});
