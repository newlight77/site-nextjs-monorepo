import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

describe('Logo component testing', () => {
  it('Should render a logo', () => {

    render(<Logo />);

    const one = screen.getByText('One');
    const profile = screen.getByText('Profile');
    expect(one).toBeDefined();
    expect(profile).toBeDefined();
  });
});
