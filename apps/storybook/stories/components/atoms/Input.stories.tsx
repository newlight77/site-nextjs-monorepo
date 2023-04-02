import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Input } from 'react-library';

export default {
  title: 'Components/atoms',
  component: Input,
} as ComponentMeta<typeof Input>;

export const input: ComponentStory<typeof Input> = args => (
  <Input {...args} />
);

input.args = {
  id: 'id',
  label: 'label',
  value: '',
  className: 'className',
  placeholder: 'placeholder',
  required: true
};
