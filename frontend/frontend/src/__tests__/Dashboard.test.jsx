import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Dashboard from "../pages/Dashboard";
import * as api from "../services/api";


// Helper to mock API
const mockApi = (mockResponse) => {
  vi.spyOn(api, "getEnergyData").mockResolvedValue(mockResponse);
};


describe("Dashboard Component", () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });


  // ✅ 1. No Data Test
  test("renders upload prompt when no data exists", async () => {
    mockApi({
      hasData: false,
      message: "No data available"
    });

    render(<Dashboard />);

    const message = await screen.findByText(/no data available/i);
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

    // Wait for KPI number to appear
    const totalKwh = await screen.findByText(/318.8/i);
    expect(totalKwh).toBeInTheDocument();

    // Check chart container exists (Recharts renders a div with class)
    await waitFor(() => {
      const chartContainer = document.querySelector(".recharts-responsive-container");
      expect(chartContainer).toBeTruthy();
    });
  });


  // ✅ 3. Loading State Test
  test("shows loading indicator while fetching data", () => {
    vi.spyOn(api, "getEnergyData").mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(<Dashboard />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

});