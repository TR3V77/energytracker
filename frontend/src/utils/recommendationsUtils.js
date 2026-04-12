export const flattenRecommendationsPayload = (bundles) => {
  if (!Array.isArray(bundles)) return [];

  const out = [];
  for (const bundle of bundles) {
    const neighborhood = bundle.neighborhood ?? "Unknown";
    const neighborhoodId = bundle.neighborhood_id;
    const score = bundle.score;
    const nested = bundle.recommendations;
    
    if (!Array.isArray(nested) || nested.length === 0) continue;

    for (const rec of nested) {
      const ruleId = rec.id ?? "unknown";
      const rowKey = `${neighborhoodId ?? "na"}::${ruleId}`;
      out.push({
        ...rec,
        rowKey,
        neighborhood,
        neighborhood_id: neighborhoodId,
        score,
        message: rec.reason,
        triggered_conditions: bundle.triggered_conditions,
      });
    }
  }
  return out;
};