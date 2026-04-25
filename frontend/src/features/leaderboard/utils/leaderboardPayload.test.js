import {
  EMPTY_LEADERBOARD_PAYLOAD,
  normalizeLeaderboardPayload,
} from "./leaderboardPayload";

describe("normalizeLeaderboardPayload", () => {
  it("returns empty payload for missing data", () => {
    expect(normalizeLeaderboardPayload(undefined)).toEqual(EMPTY_LEADERBOARD_PAYLOAD);
    expect(normalizeLeaderboardPayload(null)).toEqual(EMPTY_LEADERBOARD_PAYLOAD);
  });

  it("returns rows fallback when rows is missing", () => {
    const result = normalizeLeaderboardPayload({
      generatedAt: "2026-04-21T00:00:00Z",
      window: "30d",
    });

    expect(result).toEqual({
      generatedAt: "2026-04-21T00:00:00Z",
      window: "30d",
      rows: [],
    });
  });

  it("returns null fallbacks when generatedAt and window are missing", () => {
    const result = normalizeLeaderboardPayload({
      rows: [{ rank: 1, neighborhood: "Test", efficiencyScore: 10 }],
    });

    expect(result).toEqual({
      generatedAt: null,
      window: null,
      rows: [{ rank: 1, neighborhood: "Test", efficiencyScore: 10 }],
    });
  });
});
