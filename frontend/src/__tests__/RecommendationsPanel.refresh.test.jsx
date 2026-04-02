import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RecommendationsPanel from "../components/RecommendationsPanel";
import * as api from "../services/api";

jest.mock("../services/api");

describe("RecommendationsPanel - refresh behavior", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("re-fetches and updates when neighborhood changes", async () => {
    // First response
    api.getRecommendations.mockResolvedValueOnce({
      data: [
        {
          message: "Old Data",
          priority: "low",
        },
      ],
    });

    const { rerender } = render(
      <RecommendationsPanel neighborhood="Downtown" />
    );

    // Wait for first render
    expect(await screen.findByText("Old Data")).toBeInTheDocument();

    // Second response
    api.getRecommendations.mockResolvedValueOnce({
      data: [
        {
          message: "New Data",
          priority: "high",
        },
      ],
    });

    // Change prop → triggers useEffect again
    rerender(<RecommendationsPanel neighborhood="Riverside" />);

    // Wait for updated UI
    expect(await screen.findByText("New Data")).toBeInTheDocument();
  });
});