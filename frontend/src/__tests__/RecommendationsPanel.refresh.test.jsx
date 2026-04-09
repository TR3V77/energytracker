import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Recommendations from "../components/Recommendations";
import * as api from "../services/api";

// MOCKS
jest.mock("../services/api");

jest.mock("../utils/recommendations", () => ({
  flattenRecommendationsPayload: (data) => data,
}));

describe("RecommendationsPanel - refresh behavior", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ✅ REMOUNT TEST
  test("re-fetches data on component remount", async () => {
    api.getRecommendations.mockResolvedValueOnce({
      data: [{ rowKey: "1", message: "Old Data", priority: "low" }],
    });

    const { unmount } = render(
      <MemoryRouter>
        <Recommendations />
      </MemoryRouter>
    );

    // First render
    expect(await screen.findByText("Old Data")).toBeInTheDocument();

    // Unmount component
    unmount();

    // Mock new response
    api.getRecommendations.mockResolvedValueOnce({
      data: [{ rowKey: "2", message: "New Data", priority: "high" }],
    });

    // Remount component
    render(
      <MemoryRouter>
        <Recommendations />
      </MemoryRouter>
    );

    // Second render should show new data
    expect(await screen.findByText("New Data")).toBeInTheDocument();

    // API should have been called twice
    expect(api.getRecommendations).toHaveBeenCalledTimes(2);
  });

  // ✅ RETRY TEST
  test("retries fetching data when Try Again button is clicked", async () => {
    // First call fails
    api.getRecommendations.mockRejectedValueOnce({
      response: { data: { error: "Failed to load recommendations" } },
    });

    render(
      <MemoryRouter>
        <Recommendations />
      </MemoryRouter>
    );

    // Wait for error UI
    expect(
      await screen.findByText(/failed to load recommendations/i)
    ).toBeInTheDocument();

    // Next call succeeds
    api.getRecommendations.mockResolvedValueOnce({
      data: [
        {
          rowKey: "1",
          message: "Recovered Data",
          priority: "high",
        },
      ],
    });

    // Click "Try Again"
    fireEvent.click(
      screen.getByRole("button", { name: /try again/i })
    );

    // Wait for success UI
    expect(await screen.findByText("Recovered Data")).toBeInTheDocument();

    // Confirm retry triggered API call
    expect(api.getRecommendations).toHaveBeenCalledTimes(2);
  });
});