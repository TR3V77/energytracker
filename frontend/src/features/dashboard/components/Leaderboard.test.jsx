/// <reference types="vitest" />
import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, test, expect, beforeEach } from "vitest";
import Leaderboard from "./Leaderboard";
import { getEfficiencyRankings } from "../../../services/api";

// Mock the API to make tests fast, predictable, and isolated
vi.mock("../../../services/api", () => ({
  getEfficiencyRankings: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// Loading state
test("shows loading state initially", () => {
  getEfficiencyRankings.mockResolvedValue({ data: { rows: [] } });

  render(<Leaderboard />);
  expect(screen.getByText(/loading leaderboard/i)).toBeInTheDocument();
});

// Success state
test("renders leaderboard data after loading", async () => {
  getEfficiencyRankings.mockResolvedValue({
    data: {
      rows: [
        { rank: 1, neighborhood: "Downtown", efficiencyScore: 95 },
        { rank: 2, neighborhood: "Uptown", efficiencyScore: 88 },
      ],
    },
  });

  render(<Leaderboard />);

  expect(await screen.findByText("Downtown")).toBeInTheDocument();
  expect(screen.getByText("Uptown")).toBeInTheDocument();
  expect(screen.getByText("95.00")).toBeInTheDocument();
});

// Error state
test("shows error message when API fails", async () => {
  getEfficiencyRankings.mockRejectedValue(new Error("API error"));

  render(<Leaderboard />);

  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
});

// Empty state
test("shows empty state when no leaderboard data is returned", async () => {
  getEfficiencyRankings.mockResolvedValue({
    data: { rows: [] },
  });

  render(<Leaderboard />);

  expect(await screen.findByText(/no leaderboard data/i)).toBeInTheDocument();
});