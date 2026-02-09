import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('renders with role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has screen-reader-only loading text', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toHaveClass('sr-only');
  });

  it('applies custom className', () => {
    render(<Spinner className="mt-4" />);
    expect(screen.getByRole('status')).toHaveClass('mt-4');
  });
});
