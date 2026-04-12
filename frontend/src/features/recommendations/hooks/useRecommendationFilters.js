import { useState, useMemo, useCallback } from "react";
import { filterByPriority, filterBySearch } from "../services/recommendationFilters";
import { sortRecommendations } from "../services/recommendationSorters";

export const useRecommendationFilters = (recommendations) => {
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredData = useMemo(() => {
    let result = filterByPriority(recommendations, priorityFilter);
    result = filterBySearch(result, searchTerm);
    return sortRecommendations(result, sortBy, sortOrder);
  }, [recommendations, priorityFilter, searchTerm, sortBy, sortOrder]);

  const handleSort = useCallback((column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }, [sortBy]);

  const clearFilters = useCallback(() => {
    setPriorityFilter("all");
    setSearchTerm("");
  }, []);

  const getSortIcon = useCallback((column) => {
    if (sortBy !== column) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  }, [sortBy, sortOrder]);

  return {
    priorityFilter, setPriorityFilter,
    searchTerm, setSearchTerm,
    sortBy, sortOrder, handleSort, getSortIcon, clearFilters,
    filteredData,
    hasFilters: searchTerm !== "" || priorityFilter !== "all",
  };
};