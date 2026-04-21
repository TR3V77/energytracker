import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Leaderboard from "./Leaderboard";

vi.mock("../../../services/api", () => ({
  getEfficiencyRankings: vi.fn(),
}));

import { getEfficiencyRankings } from "../../../services/api";

const MOCK_ROWS = [
  { rank: 1, neighborhood: "Downtown San Marcos", efficiencyScore: 10.0 },
  { rank: 2, neighborhood: "Riverside", efficiencyScore: 15.5 },
  { rank: 3, neighborhood: "Kyle", efficiencyScore: 22.3 },
];

describe("Leaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    getEfficiencyRankings.mockReturnValue(new Promise(() => {}));
    render(<Leaderboard />);
    expect(screen.getByText("Loading leaderboard...")).toBeInTheDocument();
  });

  it("renders table with ranking data after API call", async () => {
    getEfficiencyRankings.mockResolvedValue({ data: { rows: MOCK_ROWS } });
    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText("Downtown San Marcos")).toBeInTheDocument();
    });

    expect(screen.getByText("Riverside")).toBeInTheDocument();
    expect(screen.getByText("Kyle")).toBeInTheDocument();
    expect(screen.getByText("10.00")).toBeInTheDocument();
    expect(screen.getByText("15.50")).toBeInTheDocument();
  });

  it("renders table headers for rank, neighborhood, and efficiency", async () => {
    getEfficiencyRankings.mockResolvedValue({ data: { rows: MOCK_ROWS } });
    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText("Rank")).toBeInTheDocument();
    });

    expect(screen.getByText("Neighborhood")).toBeInTheDocument();
    expect(screen.getByText("Efficiency")).toBeInTheDocument();
  });

  it("shows error message when API call fails", async () => {
    getEfficiencyRankings.mockRejectedValue(new Error("Network error"));
    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load")).toBeInTheDocument();
    });
  });

  it("shows empty state when API returns no rows", async () => {
    getEfficiencyRankings.mockResolvedValue({ data: { rows: [] } });
    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText("No leaderboard data")).toBeInTheDocument();
    });
  });

  it("handles missing rows gracefully", async () => {
    getEfficiencyRankings.mockResolvedValue({ data: {} });
    render(<Leaderboard />);

    await waitFor(() => {
      expect(screen.getByText("No leaderboard data")).toBeInTheDocument();
    });
  });
});
