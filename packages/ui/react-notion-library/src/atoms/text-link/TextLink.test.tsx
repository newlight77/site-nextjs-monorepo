import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Annotations, Text, TextLink } from './TextLink';

const text: Text = {
  content: "",
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

describe('Button component testing', () => {
  it('Should render a button with "Send" label', () => {
    render(<TextLink id={'id'} text={text} annotations={annotations} {...other} />);
    const element = screen.getByText('Send');
    expect(element).toBeDefined();
  });

  it('Should click on the button', () => {
    const onClick = jest.fn(e => e.preventDefault());
    render(<TextLink id={'id'} text={text} annotations={annotations} {...other} />);
    const button = screen.getByRole('button', { name: /Send/i });
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
