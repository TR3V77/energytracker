import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecommendationsPanel from "../components/RecommendationsPanel";
import * as api from "../services/api";

jest.mock("../services/api");

jest.mock("../utils/recommendations", () => ({
  flattenRecommendationsPayload: (data) => data,
}));

describe("RecommendationsPanel - refresh behavior", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("re-fetches and updates when neighborhood changes", async () => {
    // First API response
    api.getRecommendations.mockResolvedValueOnce({
      data: [
        {
          rowKey: "1",
          message: "Old Data",
          priority: "low",
        },
      ],
    });

    const { rerender } = render(
      <MemoryRouter>
        <RecommendationsPanel neighborhood="Downtown" />
      </MemoryRouter>
    );

    // Wait for first render
    expect(await screen.findByText("Old Data")).toBeInTheDocument();

    // Second API response
    api.getRecommendations.mockResolvedValueOnce({
      data: [
        {
          rowKey: "2",
          message: "New Data",
          priority: "high",
        },
      ],
    });

    // Trigger re-fetch by changing prop
    rerender(
      <MemoryRouter>
        <RecommendationsPanel neighborhood="Riverside" />
      </MemoryRouter>
    );

    // Wait for updated UI
    expect(await screen.findByText("New Data")).toBeInTheDocument();
  });
});