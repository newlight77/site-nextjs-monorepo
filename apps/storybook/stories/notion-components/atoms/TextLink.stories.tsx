import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TextLink } from 'react-notion-library';

export default {
  title: 'Components/atoms',
  component: TextLink,
} as ComponentMeta<typeof TextLink>;

export const textLink: ComponentStory<typeof TextLink> = args => (
  <TextLink {...args} />
);

textLink.args = {
  id: 'id',
  plain_text: 'plain text',
};
