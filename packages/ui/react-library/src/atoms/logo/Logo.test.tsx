import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo component testing', () => {
  it('Should render a logo', () => {

    render(<Logo />);

    const element = screen.getByAltText('oneprofile');
    expect(element).toBeDefined();
  });
});
