//Scaffolding import statements for testing the LeaderboardTableRow component
import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LeaderboardTableRow from "./LeaderboardTableRow";


describe("LeaderboardTableRow", () => {
  it("renders rank, neighborhood, and efficiency", () => {
    render(
      <table>
        <tbody>
          <LeaderboardTableRow
            rank={1}
            neighborhood="Downtown"
            efficiencyScore={95}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Downtown")).toBeInTheDocument();
    expect(screen.getByText("95.00")).toBeInTheDocument();
  });

  //Shows the gold medal for rank 1, which is the highest rank on the leaderboard. It verifies that the correct medal icon is displayed for the top-ranked neighborhood.
  it("shows gold medal for rank 1", () => {
    render(
      <table>
        <tbody>
          <LeaderboardTableRow
            rank={1}
            neighborhood="Downtown"
            efficiencyScore={95}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("🥇")).toBeInTheDocument();
  });

  //Show the silver medal for rank 2, which is the second-highest rank on the leaderboard. It verifies that the correct medal icon is displayed for the second-place neighborhood.
  it("shows silver medal for rank 2", () => {
    render(
      <table>
        <tbody>
          <LeaderboardTableRow
            rank={2}
            neighborhood="Uptown"
            efficiencyScore={88}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("🥈")).toBeInTheDocument();
  });

  //Shows the bronze medal for rank 3, which is the last rank that receives a medal. It ensures that the correct medal icon is displayed for the third-place neighborhood.
  it("shows bronze medal for rank 3", () => {
    render(
      <table>
        <tbody>
          <LeaderboardTableRow
            rank={3}
            neighborhood="Midtown"
            efficiencyScore={80}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("🥉")).toBeInTheDocument();
  });

  //This basically checks that no medal icons are rendered for ranks greater than 3.
  it("does not show medal for rank greater than 3", () => {
    render(
      <table>
        <tbody>
          <LeaderboardTableRow
            rank={4}
            neighborhood="Suburb"
            efficiencyScore={70}
          />
        </tbody>
      </table>
    );

    // Ensure no medals are shown for rank 4
    expect(screen.queryByText("🥇")).not.toBeInTheDocument();
    expect(screen.queryByText("🥈")).not.toBeInTheDocument();
    expect(screen.queryByText("🥉")).not.toBeInTheDocument();
  });
});