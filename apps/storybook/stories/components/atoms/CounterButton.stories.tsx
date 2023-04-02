import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CounterButton } from 'react-library';

export default {
  title: 'Components/atoms',
  component: CounterButton,
} as ComponentMeta<typeof CounterButton>;

export const button: ComponentStory<typeof CounterButton> = args => (
  <CounterButton {...args} />
);

button.args = {
  label: 'plain text',
};
