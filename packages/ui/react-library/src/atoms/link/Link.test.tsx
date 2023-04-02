import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Link } from './Link';


describe('Link component testing', () => {
  it('Should render a link with "my link" as text', () => {

    render(<Link href="/mypage" >my text</Link>);

    const element = screen.getByText('my text');
    expect(element).toBeDefined();
  });
});
