import React from "react";
import { RECOMMENDATION_STATUS } from "../constants/recommendationConfig";

export const RecommendationCardActions = ({ status, onUpdateStatus }) => {
  const btnClass = "btn btn-sm rounded-pill";

  if (status === RECOMMENDATION_STATUS.NOT_STARTED) {
    return (
      <div className="d-flex gap-2">
        <button className={`${btnClass} btn-primary`} onClick={() => onUpdateStatus(RECOMMENDATION_STATUS.PLANNED)}>📅 Plan</button>
        <button className={`${btnClass} btn-outline-primary`} onClick={() => onUpdateStatus(RECOMMENDATION_STATUS.IN_PROGRESS)}>🔄 Start</button>
        <button className={`${btnClass} btn-outline-secondary`} onClick={() => onUpdateStatus(RECOMMENDATION_STATUS.DISMISSED)}>Dismiss</button>
      </div>
    );
  }

  if (status === RECOMMENDATION_STATUS.PLANNED) {
    return (
      <div className="d-flex gap-2">
        <button className={`${btnClass} btn-primary`} onClick={() => onUpdateStatus(RECOMMENDATION_STATUS.IN_PROGRESS)}>🔄 Start Now</button>
        <button className={`${btnClass} btn-outline-secondary`} onClick={() => onUpdateStatus(RECOMMENDATION_STATUS.DISMISSED)}>Cancel</button>
      </div>
    );
  }

  if (status === RECOMMENDATION_STATUS.IN_PROGRESS) {
    return (
      <div className="d-flex gap-2">
        <button className={`${btnClass} btn-success`} onClick={() => onUpdateStatus(RECOMMENDATION_STATUS.IMPLEMENTED)}>✅ Complete</button>
        <button className={`${btnClass} btn-outline-secondary`} onClick={() => onUpdateStatus(RECOMMENDATION_STATUS.DISMISSED)}>Cancel</button>
      </div>
    );
  }

  if (status === RECOMMENDATION_STATUS.IMPLEMENTED) {
    return (
      <div className="d-flex gap-2">
        <button className={`${btnClass} btn-outline-secondary`} disabled>✅ Completed</button>
      </div>
    );
  }

  if (status === RECOMMENDATION_STATUS.DISMISSED) {
    return (
      <div className="d-flex gap-2">
        <button className={`${btnClass} btn-outline-secondary`} disabled>🚫 Dismissed</button>
      </div>
    );
  }

  return null;
};