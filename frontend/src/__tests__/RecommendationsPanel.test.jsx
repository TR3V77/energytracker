import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "@jest/globals";
import RecommendationsPanel from "../components/RecommendationsPanel";

global.fetch = jest.fn();

describe("RecommendationsPanel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders recommendations when data exists", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          trigger: "High kWh usage",
          actions: ["Improve insulation", "Upgrade HVAC"],
        },
      ],
    });

    render(<RecommendationsPanel neighborhood="Downtown" />);

    await waitFor(() => {
      expect(screen.getByText("High kWh usage")).toBeInTheDocument();
    });

    expect(screen.getByText("Improve insulation")).toBeInTheDocument();
    expect(screen.getByText("Upgrade HVAC")).toBeInTheDocument();
  });

  test("renders empty state when no recommendations", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<RecommendationsPanel neighborhood="Downtown" />);

    await waitFor(() => {
      expect(
        screen.getByText("No recommendations for this selection.")
      ).toBeInTheDocument();
    });
  });
});