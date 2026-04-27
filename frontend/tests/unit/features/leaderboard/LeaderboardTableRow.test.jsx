import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { LeaderboardTableRow } from '../../../../src/features/leaderboard/components/LeaderboardTableRow';

const renderInTable = (component) => {
  return render(
    <table>
      <tbody>
        {component}
      </tbody>
    </table>
  );
};

describe('LeaderboardTableRow', () => {
  it('displays rank with hash symbol', () => {
    renderInTable(<LeaderboardTableRow rank={5} neighborhoodName="Test" efficiency={350} />);
    expect(screen.getByText('#5')).toBeInTheDocument();
  });

  it('displays neighborhood name', () => {
    renderInTable(<LeaderboardTableRow rank={1} neighborhoodName="Downtown" efficiency={320} />);
    expect(screen.getByText('Downtown')).toBeInTheDocument();
  });

  it('shows gold medal for rank 1', () => {
    renderInTable(<LeaderboardTableRow rank={1} neighborhoodName="First" efficiency={300} />);
    expect(screen.getByText('🥇')).toBeInTheDocument();
  });

  it('shows silver medal for rank 2', () => {
    renderInTable(<LeaderboardTableRow rank={2} neighborhoodName="Second" efficiency={350} />);
    expect(screen.getByText('🥈')).toBeInTheDocument();
  });

  it('shows bronze medal for rank 3', () => {
    renderInTable(<LeaderboardTableRow rank={3} neighborhoodName="Third" efficiency={400} />);
    expect(screen.getByText('🥉')).toBeInTheDocument();
  });

  it('applies green badge for efficient neighborhoods', () => {
    const { container } = renderInTable(<LeaderboardTableRow rank={1} neighborhoodName="Efficient" efficiency={320} />);
    expect(container.querySelector('.bg-success')).toBeInTheDocument();
  });

  it('applies yellow badge for average neighborhoods', () => {
    const { container } = renderInTable(<LeaderboardTableRow rank={2} neighborhoodName="Average" efficiency={370} />);
    expect(container.querySelector('.bg-warning')).toBeInTheDocument();
  });

  it('applies red badge for inefficient neighborhoods', () => {
    const { container } = renderInTable(<LeaderboardTableRow rank={3} neighborhoodName="Inefficient" efficiency={450} />);
    expect(container.querySelector('.bg-danger')).toBeInTheDocument();
  });
});