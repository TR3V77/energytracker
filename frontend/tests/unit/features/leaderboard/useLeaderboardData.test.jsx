import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLeaderboardData } from '../../../../src/features/leaderboard/hooks/useLeaderboardData';
import { getEfficiencyRankings } from '../../../../src/services/api';

vi.mock('../../../../src/services/api');

describe('useLeaderboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('consumes backend response directly without recalculating efficiency', async () => {
    const mockResponse = {
      data: {
        rankings: [
          { 
            rank: 1, 
            neighborhood_name: 'Neighborhood_5', 
            efficiency: 320.45, 
            households: 271, 
            total_kwh: 86842.95 
          }
        ]
      }
    };
    getEfficiencyRankings.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLeaderboardData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.rankings[0].efficiency).toBe(320.45);
    expect(result.current.rankings[0]).toHaveProperty('neighborhood_name');
  });

  it('adds medals for ranks 1, 2, 3', async () => {
    const mockResponse = {
      data: {
        rankings: [
          { rank: 1, neighborhood_name: 'First', efficiency: 300, households: 100, total_kwh: 30000 },
          { rank: 2, neighborhood_name: 'Second', efficiency: 350, households: 100, total_kwh: 35000 },
          { rank: 3, neighborhood_name: 'Third', efficiency: 400, households: 100, total_kwh: 40000 },
          { rank: 4, neighborhood_name: 'Fourth', efficiency: 450, households: 100, total_kwh: 45000 }
        ]
      }
    };
    getEfficiencyRankings.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLeaderboardData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.rankings[0].medal).toBe('🥇');
    expect(result.current.rankings[1].medal).toBe('🥈');
    expect(result.current.rankings[2].medal).toBe('🥉');
    expect(result.current.rankings[3].medal).toBeNull();
  });

  it('handles API errors gracefully', async () => {
    getEfficiencyRankings.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLeaderboardData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network error');
    expect(result.current.rankings).toEqual([]);
  });
});