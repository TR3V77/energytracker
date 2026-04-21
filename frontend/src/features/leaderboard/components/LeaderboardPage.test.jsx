import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { LeaderboardPage } from "./LeaderboardPage";

vi.mock("../hooks/useLeaderboardData", () => ({
  useLeaderboardData: vi.fn(),
}));

import { useLeaderboardData } from "../hooks/useLeaderboardData";

const MOCK_RANKINGS = [
  { rank: 1, neighborhood: "Downtown San Marcos", efficiencyScore: 10.0, medal: null },
  { rank: 2, neighborhood: "Riverside", efficiencyScore: 15.5, medal: null },
  { rank: 3, neighborhood: "Kyle", efficiencyScore: 22.3, medal: null },
];

describe("LeaderboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    useLeaderboardData.mockReturnValue({
      rankings: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LeaderboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading leaderboard data...")).toBeInTheDocument();
  });

  it("shows error state with retry button", () => {
    useLeaderboardData.mockReturnValue({
      rankings: [],
      loading: false,
      error: "Network error",
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LeaderboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Failed to Load Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("shows empty state when no rankings exist", () => {
    useLeaderboardData.mockReturnValue({
      rankings: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LeaderboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("No Leaderboard Data Available")).toBeInTheDocument();
  });

  it("renders header with title and badge", () => {
    useLeaderboardData.mockReturnValue({
      rankings: MOCK_RANKINGS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LeaderboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Neighborhood Efficiency Leaderboard/)).toBeInTheDocument();
    expect(screen.getByText("Real-time Rankings")).toBeInTheDocument();
  });

  it("renders table with ranking data", () => {
    useLeaderboardData.mockReturnValue({
      rankings: MOCK_RANKINGS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LeaderboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Downtown San Marcos")).toBeInTheDocument();
    expect(screen.getByText("Riverside")).toBeInTheDocument();
    expect(screen.getByText("Kyle")).toBeInTheDocument();
  });

  it("renders efficiency score explanation", () => {
    useLeaderboardData.mockReturnValue({
      rankings: MOCK_RANKINGS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LeaderboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Efficiency Score = Total kWh/)).toBeInTheDocument();
  });
});
