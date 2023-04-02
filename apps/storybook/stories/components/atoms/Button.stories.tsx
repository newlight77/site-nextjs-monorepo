import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from 'react-library';

export default {
  title: 'Components/atoms',
  component: Button,
} as ComponentMeta<typeof Button>;

export const button: ComponentStory<typeof Button> = args => (
  <Button {...args} />
);

button.args = {
  label: 'plain text',
};
