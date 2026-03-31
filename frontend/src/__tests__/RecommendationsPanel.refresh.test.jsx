import { render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect } from "@jest/globals";
import RecommendationsPanel from "../components/RecommendationsPanel";

global.fetch = vi.fn();

describe("RecommendationsPanel - refresh on prop change", () => {

  test("re-fetches and updates when neighborhood changes", async () => {
    
    // 🥇 First API response (Downtown)
    fetch.mockResolvedValueOnce({
      json: async () => [
        { trigger: "Old Data", actions: ["Action A"] }
      ]
    });

    const { rerender } = render(
      <RecommendationsPanel neighborhood="Downtown" />
    );

    // ✅ Wait for first render
    expect(await screen.findByText("Old Data")).toBeInTheDocument();

    // 🥈 Second API response (Riverside)
    fetch.mockResolvedValueOnce({
      json: async () => [
        { trigger: "New Data", actions: ["Action B"] }
      ]
    });

    // 🔁 Change prop (THIS is the key part)
    rerender(<RecommendationsPanel neighborhood="Riverside" />);

    // ✅ Wait for updated UI
    expect(await screen.findByText("New Data")).toBeInTheDocument();
  });

});