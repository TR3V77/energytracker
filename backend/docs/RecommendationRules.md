# Recommendations Rules
 
## Overview
 
This document describes how the recommendations engine works — what triggers
it evaluates, what catalog items it maps to, and how those combine into the
final API response. It is intended for frontend developers, testers, and
anyone reviewing or extending the rules.
 
The engine is deterministic: the same input metrics always produce the same
output. Recommendations are deduplicated by ID — if two triggers map to the
same recommendation, it only appears once.
 
---

 ## How It Works
 
1. **Metrics in** — the engine receives aggregated metrics per neighborhood
   (total kWh, households, efficiency score, and optional fields).
2. **Rules evaluate** — each rule checks the metrics against a threshold and
   fires zero or more trigger conditions.
3. **Triggers resolve** — fired trigger IDs are looked up in the mapping
   table to get recommendation IDs.
4. **Catalog lookup** — each recommendation ID is resolved to its full
   object from the catalog.
5. **Deduplication** — if multiple triggers map to the same recommendation
   ID, it appears only once (first occurrence wins).
6. **Response out** — the API returns triggered conditions and recommendations
   grouped by neighborhood.

---

## Threshold
 
The default threshold is **400.0 kWh/household**. It can be overridden per
request via the `threshold` query parameter on `/api/recommendations`.
 
All rule cutoffs derive from this threshold:
 
| Cutoff | Formula | Default value |
|---|---|---|
| Efficient cutoff | `threshold × 0.85` | 340.0 |
| High cutoff | `threshold` | 400.0 |
| Very high cutoff | `threshold × 1.20` | 480.0 |
| City average estimate | `threshold × 0.75` | 300.0 |
 
---

## Trigger Conditions
 
### Rule 1 — Efficient Usage
**ID:** `efficient_usage`
**Severity:** low
**Fires when:** `efficiency_score <= threshold × 0.85`
 
The neighborhood is performing at or below the efficient baseline. No
corrective action needed — recognition is appropriate.
 
---
 
### Rule 2 — Moderate Inefficiency
**ID:** `moderate_inefficiency`
**Severity:** medium
**Fires when:** `threshold × 0.85 < efficiency_score < threshold`
 
The neighborhood is above the efficient baseline but below the high
consumption threshold. A review is warranted.
 
---
 
### Rule 3 — High Consumption
**ID:** `high_consumption`
**Severity:** high
**Fires when:** `efficiency_score >= threshold`
 
The neighborhood exceeds the configured threshold. Corrective action
is recommended.
 
---
 
### Rule 4 — Critical Consumption
**ID:** `critical_consumption`
**Severity:** high
**Fires when:** `efficiency_score >= threshold × 1.20`
 
The neighborhood is significantly above the threshold. Urgent action
is recommended. Note: this fires in addition to Rule 3, not instead of it.
 
---
 
### Rule 5 — High Per-Household Load
**ID:** `high_per_household_load`
**Severity:** high
**Fires when:** `total_kwh / households >= threshold × 1.10`
 
The average household load is unusually high relative to the threshold,
suggesting demand-side issues.
 
---
 
### Rule 6 — High Usage vs City Average
**ID:** `high_kwh_vs_city_avg`
**Severity:** medium
**Fires when:** `efficiency_score > (threshold × 0.75) × 1.25`
 
The neighborhood's efficiency score is more than 25% above the estimated
city average. The city average is approximated as `threshold × 0.75` for
Sprint 1 — this will be replaced with a real city-wide average in a future
sprint.
 
---
 
### Rule 7 — High Peak Usage
**ID:** `high_summer_peak`
**Severity:** medium
**Fires when:** `peak_proxy >= threshold × 1.15`
 
Where `peak_proxy` is `peak_kwh` from metrics if available, otherwise falls
back to `total_kwh / households`. Indicates HVAC is likely running
inefficiently during high-demand periods.
 
> **Note:** Real `peak_kwh` data is not yet wired into the metrics. Until
> then, this rule uses `efficiency_score` as a proxy and will fire on most
> high-usage neighborhoods.
 
---
 
### Rule 8 — High Usage Variance
**ID:** `high_usage_variance`
**Severity:** medium
**Fires when:** `kwh_variance >= threshold × 0.50`
 
Significant spikes or variance in usage suggest inconsistent consumption
patterns that an audit could address.
 
> **Note:** `kwh_variance` is not yet wired into the metrics. This rule will
> not fire until real variance data is available.
 
---
 
### Rule 9 — Low Rebate Participation + High Usage
**ID:** `low_rebate_high_usage`
**Severity:** medium
**Fires when:** `efficiency_score >= threshold` AND
`rebate_participation_pct < 0.20`
 
A high-usage neighborhood where fewer than 20% of households participate in
rebate programs. Outreach and weatherization could significantly reduce costs.
 
> **Note:** `rebate_participation_pct` defaults to `0.0` until real rebate
> data is wired in, so this rule fires on all high-consumption neighborhoods
> by default.
 
---

## Recommendation Catalog
 
These are all available recommendations. Each has a stable ID that is
referenced by the trigger mapping.
 
| ID | Action | Priority | Estimated Impact |
|---|---|---|---|
| `community_recognition` | Community Recognition | low | 0% |
| `demand_response_outreach` | Demand Response Outreach | medium | 6% |
| `energy_audit` | Schedule Energy Audit | medium | 8% |
| `smart_thermostat` | Install Smart Thermostat | medium | 8% |
| `rebate_outreach` | Rebate Program Outreach | medium | 7% |
| `insulation_improvements` | Insulation Improvements | medium | 10% |
| `hvac_tuneup` | HVAC Tune-Up | medium | 11% |
| `efficiency_upgrade` | Efficiency Upgrade | high | 12% |
| `weatherization_assistance` | Weatherization Assistance | high | 9% |
| `hvac_upgrades` | HVAC Upgrades | high | 15% |
 
---

## Trigger → Recommendation Mapping
 
Each trigger ID maps to 2–4 recommendation IDs. Recommendations are resolved
in trigger order and deduplicated — if the same recommendation ID appears in
multiple triggers, it is included only once.
 
| Trigger ID | Recommendation IDs |
|---|---|
| `efficient_usage` | `community_recognition`, `demand_response_outreach` |
| `moderate_inefficiency` | `energy_audit`, `insulation_improvements` |
| `high_consumption` | `efficiency_upgrade`, `hvac_upgrades`, `weatherization_assistance` |
| `critical_consumption` | `hvac_upgrades`, `insulation_improvements`, `efficiency_upgrade` |
| `high_per_household_load` | `demand_response_outreach`, `energy_audit` |
| `high_kwh_vs_city_avg` | `insulation_improvements`, `hvac_upgrades` |
| `high_summer_peak` | `hvac_tuneup`, `smart_thermostat` |
| `high_usage_variance` | `energy_audit`, `smart_thermostat` |
| `low_rebate_high_usage` | `rebate_outreach`, `weatherization_assistance` |
 
---

## Example Scenarios
 
### Scenario 1 — Efficient Neighborhood
**Input:** `efficiency_score = 300`, `threshold = 400`
 
| Rule | Fires? | Reason |
|---|---|---|
| Efficient Usage | ✅ | 300 ≤ 340 |
| Moderate Inefficiency | ❌ | 300 not in (340, 400) |
| High Consumption | ❌ | 300 < 400 |
| All others | ❌ | — |
 
**Triggered conditions:** `efficient_usage`
 
**Recommendations:**
- Community Recognition (low)
- Demand Response Outreach (medium)
---

### Scenario 2 — Moderate Inefficiency
**Input:** `efficiency_score = 360`, `threshold = 400`
 
| Rule | Fires? | Reason |
|---|---|---|
| Efficient Usage | ❌ | 360 > 340 |
| Moderate Inefficiency | ✅ | 340 < 360 < 400 |
| High Consumption | ❌ | 360 < 400 |
| All others | ❌ | — |
 
**Triggered conditions:** `moderate_inefficiency`
 
**Recommendations:**
- Schedule Energy Audit (medium)
- Insulation Improvements (medium)
---
 
### Scenario 3 — High Consumption
**Input:** `efficiency_score = 500`, `threshold = 400`
 
| Rule | Fires? | Reason |
|---|---|---|
| Efficient Usage | ❌ | 500 > 340 |
| Moderate Inefficiency | ❌ | 500 > 400 |
| High Consumption | ✅ | 500 ≥ 400 |
| Critical Consumption | ✅ | 500 ≥ 480 |
| High Per-Household Load | ✅ | depends on households |
| High Usage vs City Average | ✅ | 500 > 375 |
| High Peak Usage | ✅ | proxy ≥ 460 |
| High Usage Variance | ❌ | no variance data yet |
| Low Rebate + High Usage | ✅ | 500 ≥ 400 and rebate = 0% |
 
**Triggered conditions:** `high_consumption`, `critical_consumption`,
`high_per_household_load`, `high_kwh_vs_city_avg`, `high_summer_peak`,
`low_rebate_high_usage`
 
**Recommendations (deduplicated, in trigger order):**
- Efficiency Upgrade (high)
- HVAC Upgrades (high)
- Weatherization Assistance (high)
- Insulation Improvements (medium) — from `critical_consumption`
- Demand Response Outreach (medium) — from `high_per_household_load`
- Schedule Energy Audit (medium) — from `high_per_household_load`
- HVAC Tune-Up (medium) — from `high_summer_peak`
- Install Smart Thermostat (medium) — from `high_summer_peak`
- Rebate Program Outreach (medium) — from `low_rebate_high_usage`
---
 
### Scenario 4 — Critical Consumption
**Input:** `efficiency_score = 600`, `threshold = 400`
 
Same triggers as Scenario 3 but with higher severity messages. All the same
recommendations apply — deduplication means the output list does not grow
beyond what Scenario 3 produces.
 
---
 
## API Response Shape
 
```
GET /api/recommendations?threshold=400&window=30d
```
 
```json
{
  "message": "Recommendations generated successfully.",
  "recommendations": [
    {
      "neighborhood_id": 1,
      "neighborhood": "Downtown San Marcos",
      "score": 360.99,
      "triggered_conditions": [
        {
          "id": "high_consumption",
          "name": "High Consumption",
          "severity": "high",
          "message": "Downtown San Marcos exceeds the threshold. Efficiency score (360.99 kWh/household) is above 400.00."
        }
      ],
      "recommendations": [
        {
          "id": "efficiency_upgrade",
          "action": "Efficiency Upgrade",
          "priority": "high",
          "reason": "Consumption is above the configured threshold.",
          "estimated_impact_pct": 12.0
        }
      ]
    }
  ]
}
```
 
---

## Notes for Testers
 
- Use `?threshold=50` to force most rules to fire on real data.
- Use `?neighborhood_id=1` to test a single neighborhood.
- `high_usage_variance` will not fire until `kwh_variance` is wired into
  the metrics — this is expected behavior.
- `low_rebate_high_usage` fires on all high-consumption neighborhoods by
  default since `rebate_participation_pct` defaults to `0.0`.
- All rule thresholds scale with the `threshold` param — changing it affects
  every cutoff proportionally.
---

## Source Files
 
| File | Purpose |
|---|---|
| `app/services/recommendation_rules.py` | Rule evaluation logic |
| `app/services/recommendations_catalog.py` | Catalog of all recommendation objects |
| `app/services/recommendation_mapping.py` | Trigger → recommendation ID mapping |
| `app/services/recommendations_service.py` | Orchestrates metrics fetch and rule evaluation |
| `app/routes/analytics.py` | `/api/recommendations` endpoint |