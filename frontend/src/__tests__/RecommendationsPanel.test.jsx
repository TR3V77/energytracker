import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecommendationsPanel from "../components/RecommendationsPanel";
import * as api from "../services/api";

jest.mock("../services/api");

jest.mock("../utils/recommendations", () => ({
  flattenRecommendationsPayload: (data) => data,
}));

describe("RecommendationsPanel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders recommendations when data exists", async () => {
    api.getRecommendations.mockResolvedValue({
      data: [
        {
          rowKey: "1",
          message: "High energy usage",
          priority: "high",
        },
      ],
    });

    render(
      <MemoryRouter>
        <RecommendationsPanel />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/high energy usage/i)
    ).toBeInTheDocument();
  });

  test("renders empty state when no data", async () => {
    api.getRecommendations.mockResolvedValue({
      data: [],
    });

    render(
      <MemoryRouter>
        <RecommendationsPanel />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/no recommendations/i)
    ).toBeInTheDocument();
  });
});