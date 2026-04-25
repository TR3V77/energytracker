import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { LeaderboardHeader } from "./LeaderboardHeader";

describe("LeaderboardHeader", () => {
  it("shows fallback labels when generatedAt and window are missing", () => {
    render(<LeaderboardHeader generatedAt={null} window={null} />);

    expect(screen.getByText("Window: unavailable")).toBeInTheDocument();
    expect(screen.getByText("Generated time unavailable")).toBeInTheDocument();
  });

  it("shows window range when window object is provided", () => {
    render(
      <LeaderboardHeader
        generatedAt={null}
        window={{ from: "2026-01-01", to: "2026-01-31" }}
      />
    );

    expect(
      screen.getByText("Window: 2026-01-01 to 2026-01-31")
    ).toBeInTheDocument();
  });
});
