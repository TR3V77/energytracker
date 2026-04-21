import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

vi.mock("../hooks/useDashboardData", () => ({
  useDashboardData: vi.fn(),
}));

vi.mock("../hooks/useDashboardFilters", () => ({
  useDashboardFilters: vi.fn(() => ({
    selectedNeighborhoodId: null,
    setSelectedNeighborhoodId: vi.fn(),
    filteredData: MOCK_ENERGY_DATA,
  })),
}));

vi.mock("../../../services/api", () => ({
  getEfficiencyRankings: vi.fn(() => Promise.resolve({ data: { rows: [] } })),
  getRecommendations: vi.fn(() => Promise.resolve({ data: { recommendations: [] } })),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => children,
  LineChart: () => null,
  Line: () => null,
  BarChart: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

import { useDashboardData } from "../hooks/useDashboardData";

const MOCK_ENERGY_DATA = [
  { neighborhood_id: 1, date: "2026-01-15", total_kwh: 100 },
  { neighborhood_id: 1, date: "2026-02-15", total_kwh: 150 },
];

const MOCK_HOUSEHOLDS = { 1: 10 };

const MOCK_NEIGHBORHOODS = [
  { neighborhood_id: 1, neighborhood_name: "Downtown San Marcos" },
];

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner when data is loading", () => {
    useDashboardData.mockReturnValue({
      energyData: [],
      householdsByNeighborhoodId: {},
      sortedNeighborhoods: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  it("shows error display when there is an error", () => {
    useDashboardData.mockReturnValue({
      energyData: [],
      householdsByNeighborhoodId: {},
      sortedNeighborhoods: [],
      loading: false,
      error: "Server error",
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Failed to Load Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Server error")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("shows empty state when no energy data exists", () => {
    useDashboardData.mockReturnValue({
      energyData: [],
      householdsByNeighborhoodId: {},
      sortedNeighborhoods: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("No Data Available")).toBeInTheDocument();
  });

  it("renders dashboard with KPI cards when data is loaded", async () => {
    useDashboardData.mockReturnValue({
      energyData: MOCK_ENERGY_DATA,
      householdsByNeighborhoodId: MOCK_HOUSEHOLDS,
      sortedNeighborhoods: MOCK_NEIGHBORHOODS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Energy Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Total Consumption")).toBeInTheDocument();
    expect(screen.getByText("Average Daily Usage")).toBeInTheDocument();
    expect(screen.getByText("Peak Day")).toBeInTheDocument();
    expect(screen.getByText("Neighborhood Efficiency")).toBeInTheDocument();
  });

  it("renders chart section with neighborhood filter", async () => {
    useDashboardData.mockReturnValue({
      energyData: MOCK_ENERGY_DATA,
      householdsByNeighborhoodId: MOCK_HOUSEHOLDS,
      sortedNeighborhoods: MOCK_NEIGHBORHOODS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("All neighborhoods")).toBeInTheDocument();
  });

  it("renders recommendations panel in dashboard", async () => {
    useDashboardData.mockReturnValue({
      energyData: MOCK_ENERGY_DATA,
      householdsByNeighborhoodId: MOCK_HOUSEHOLDS,
      sortedNeighborhoods: MOCK_NEIGHBORHOODS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Recommendations/)).toBeInTheDocument();
    });
  });

  it("renders leaderboard section in dashboard", async () => {
    useDashboardData.mockReturnValue({
      energyData: MOCK_ENERGY_DATA,
      householdsByNeighborhoodId: MOCK_HOUSEHOLDS,
      sortedNeighborhoods: MOCK_NEIGHBORHOODS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
  });
});
