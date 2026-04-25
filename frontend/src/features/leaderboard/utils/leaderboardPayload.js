export const EMPTY_LEADERBOARD_PAYLOAD = Object.freeze({
  generatedAt: null,
  window: null,
  rows: [],
});

export const normalizeLeaderboardPayload = (data) => {
  if (!data || typeof data !== "object") {
    return EMPTY_LEADERBOARD_PAYLOAD;
  }

  return {
    generatedAt: data.generatedAt ?? null,
    window: data.window ?? null,
    rows: Array.isArray(data.rows) ? data.rows : [],
  };
};
