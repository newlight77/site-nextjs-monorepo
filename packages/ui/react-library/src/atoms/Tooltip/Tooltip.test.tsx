import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';


describe('Tooltip component testing', () => {
  it('Should render a tooltip with "my tooltip" as text', () => {

    render(<Tooltip text="my tooltip" >
      <button>a button</button>
    </Tooltip>);

    const element = screen.getByText('my tooltip');
    expect(element).toBeDefined();
  });
});
