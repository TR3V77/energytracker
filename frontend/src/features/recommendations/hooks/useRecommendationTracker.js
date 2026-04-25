import { useState, useCallback } from "react";
import { RECOMMENDATION_STATUS } from "../constants/recommendationConfig";

const STORAGE_KEY = "recommendation_tracker";

/**
 * Hook for tracking recommendation status in localStorage
 * Manage persistence of recommendation statuses
 */
export const useRecommendationTracker = () => {
  const [tracker, setTracker] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading tracker from localStorage:", error);
      return {};
    }
  });

  const updateStatus = useCallback((id, status) => {
    if (!id) {
      console.error("Cannot update status: No ID provided");
      return;
    }
    
    setTracker(prev => {
      const updated = { ...prev, [id]: { status, updatedAt: new Date().toISOString() } };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving tracker to localStorage:", error);
      }
      return updated;
    });
  }, []);

  const getStatus = useCallback((id) => {
    if (!id) return RECOMMENDATION_STATUS.NOT_STARTED;
    return tracker[id]?.status || RECOMMENDATION_STATUS.NOT_STARTED;
  }, [tracker]);

  const getDetails = useCallback((id) => {
    if (!id) return { status: RECOMMENDATION_STATUS.NOT_STARTED };
    return tracker[id] || { status: RECOMMENDATION_STATUS.NOT_STARTED };
  }, [tracker]);

  //Reset to empty state
  const resetAllProgress = useCallback(() => {
    setTracker({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error resetting tracker from localStorage:", error);
    }
  }, []);

  return { 
    tracker, 
    updateStatus, 
    getStatus, 
    getDetails, 
    resetAllProgress,
  };
};