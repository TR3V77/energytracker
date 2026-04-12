import { EFFICIENCY_THRESHOLDS, STATUS_CONFIG } from "../constants/rankingsConfig";

export const getEfficiencyStatus = (efficiencyScore) => {
  if (efficiencyScore < EFFICIENCY_THRESHOLDS.EFFICIENT) {
    return STATUS_CONFIG.EFFICIENT;
  }
  if (efficiencyScore < EFFICIENCY_THRESHOLDS.AVERAGE) {
    return STATUS_CONFIG.AVERAGE;
  }
  return STATUS_CONFIG.NEEDS_IMPROVEMENT;
};