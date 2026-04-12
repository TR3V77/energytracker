import React from "react";

export const RecommendationsFilterToolbar = ({
  priorityFilter,
  setPriorityFilter,
  searchTerm,
  setSearchTerm,
  sortBy,
  sortOrder,
  onSort,
  getSortIcon,
  onClearFilters,
}) => {
  const priorityOptions = [
    { value: "all", label: "All", icon: null },
    { value: "high", label: "High", icon: "🔴" },
    { value: "medium", label: "Medium", icon: "🟡" },
    { value: "low", label: "Low", icon: "🟢" },
  ];

  const sortOptions = [
    { key: "priority", label: "Priority" },
    { key: "neighborhood", label: "Neighborhood" },
    { key: "score", label: "Score" },
  ];

  const hasActiveFilters = priorityFilter !== "all" || searchTerm !== "";

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small text-muted fw-bold">Filter by Priority</label>
            <div className="btn-group w-100" role="group">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`btn ${priorityFilter === option.value ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setPriorityFilter(option.value)}
                >
                  {option.icon && <span className="me-1">{option.icon}</span>}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-md-5">
            <label className="form-label small text-muted fw-bold">Search</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by neighborhood, message, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchTerm("")}>✕</button>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label small text-muted fw-bold">Sort by</label>
            <div className="d-flex gap-2 flex-wrap">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  className={`btn btn-sm ${sortBy === option.key ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => onSort(option.key)}
                >
                  {option.label} {getSortIcon(option.key)}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="col-12 mt-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={onClearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};