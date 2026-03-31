import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import * as api from "../services/api";

// Helper to mock API
const mockApi = (mockResponse) => {
  jest.spyOn(api, "getEnergyData").mockResolvedValue(mockResponse);
};

describe("Dashboard Component", () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ✅ 1. No Data Test
  test("renders upload prompt when no data exists", async () => {
    mockApi({
      hasData: false,
      message: "No data available"
    });

    render(<Dashboard />);

    const message = await screen.findByText(/no data/i);
    expect(message).toBeInTheDocument();
  });

  // ✅ 2. Data Exists Test
  test("renders KPI cards and chart when data exists", async () => {
    mockApi({
      hasData: true,
      kpis: {
        total_kwh: 318.8,
        avg_kwh_per_household: 2.12,
        neighborhood_count: 3
      },
      timeseries: [
        { date: "2025-01-01", kwh: 100 },
        { date: "2025-01-02", kwh: 120 }
      ]
    });

    render(<Dashboard />);

    const totalKwh = await screen.findByText(/318/i);
    expect(totalKwh).toBeInTheDocument();

    await waitFor(() => {
      const chartContainer = document.querySelector(".recharts-responsive-container");
      expect(chartContainer).toBeTruthy();
    });
  });

  // ✅ 3. Loading State Test (adjusted to match your UI)
  test("renders default state while fetching data", () => {
    jest.spyOn(api, "getEnergyData").mockImplementation(
      () => new Promise(() => {})
    );

    render(<Dashboard />);

    expect(screen.getByText(/total consumption/i)).toBeInTheDocument();
  });

});