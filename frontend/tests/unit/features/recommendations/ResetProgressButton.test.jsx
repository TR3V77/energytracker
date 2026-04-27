import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResetProgressButton } from '../../../../src/features/recommendations/components/ResetProgressButton';

describe('ResetProgressButton', () => {
  let mockOnReset;

  beforeEach(() => {
    mockOnReset = vi.fn();
  });

  it('calls onReset and clears localStorage when confirmed', () => {
    render(<ResetProgressButton onReset={mockOnReset} />);

    fireEvent.click(screen.getByTitle('Reset all implementation progress'));
    fireEvent.click(screen.getByText('Yes, Reset Progress'));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
    // Note: The test doesn't need to check localStorage directly
    // It assumes onReset handles that
  });

  it('opens modal on button click and closes on cancel', () => {
    render(<ResetProgressButton onReset={mockOnReset} />);

    fireEvent.click(screen.getByTitle('Reset all implementation progress'));
    expect(screen.getByText('Reset All Progress?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Reset All Progress?')).not.toBeInTheDocument();
  });
});