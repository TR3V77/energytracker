import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import * as api from '../services/api';
import { MemoryRouter } from 'react-router-dom';

// ✅ Mock API layer (correct level)
jest.mock('../services/api');

// ✅ Mock RecommendationsPanel to prevent extra API noise
jest.mock('../components/RecommendationsPanel', () => () => (
  <div>Mock Recommendations</div>
));

describe('Dashboard Component', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ 1. Error state
  test('renders error message when API fails', async () => {
    api.getEnergyData.mockRejectedValueOnce(new Error('Network Error'));
    api.getNeighborhoods.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText(/failed to load dashboard data/i);
    expect(errorMessage).toBeTruthy();
  });

  // ✅ 2. No data state
  test('renders no data state', async () => {
    api.getEnergyData.mockResolvedValueOnce({ data: [] });
    api.getNeighborhoods.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const message = await screen.findByText(/no data available/i);
    expect(message).toBeTruthy();
  });

  // ✅ 3. Data exists
  test('renders KPI cards when data exists', async () => {
    api.getEnergyData.mockResolvedValueOnce({
      data: [
        { total_kwh: 100, neighborhood_id: 1 },
        { total_kwh: 218, neighborhood_id: 1 }
      ]
    });

    api.getNeighborhoods.mockResolvedValueOnce({
      data: [
        { neighborhood_id: 1, households: 10, neighborhood_name: 'Downtown' }
      ]
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const totalKwh = await screen.findByText(/318/i);
    expect(totalKwh).toBeTruthy();
  });

  // ✅ 4. Loading state
  test('renders loading state initially', () => {
    api.getEnergyData.mockImplementation(() => new Promise(() => {}));
    api.getNeighborhoods.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading dashboard/i)).toBeTruthy();
  });

});