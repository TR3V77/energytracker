export const RECOMMENDATION_STATUS = {
  NOT_STARTED: "not_started",
  PLANNED: "planned",
  IN_PROGRESS: "in_progress",
  IMPLEMENTED: "implemented",
  DISMISSED: "dismissed",
};

export const STATUS_CONFIG = {
  not_started: { badgeClass: "bg-secondary", icon: "⏳", label: "Not Started" },
  planned: { badgeClass: "bg-primary", icon: "📅", label: "Planned" },
  in_progress: { badgeClass: "bg-info", icon: "🔄", label: "In Progress" },
  implemented: { badgeClass: "bg-success", icon: "✅", label: "Implemented" },
  dismissed: { badgeClass: "bg-dark", icon: "🚫", label: "Dismissed" },
};

export const PRIORITY_CONFIG = {
  high: { order: 3, badgeClass: "bg-danger", icon: "🔴", label: "High Priority", bgClass: "bg-danger bg-opacity-10" },
  medium: { order: 2, badgeClass: "bg-warning text-dark", icon: "🟡", label: "Medium Priority", bgClass: "bg-warning bg-opacity-10" },
  low: { order: 1, badgeClass: "bg-success", icon: "🟢", label: "Low Priority", bgClass: "bg-success bg-opacity-10" },
};

export const REBATE_OPPORTUNITIES = [
  { icon: "🏠", title: "Weatherization Assistance", description: "Free home energy audits and upgrades", amount: "Up to $5,000" },
  { icon: "☀️", title: "Solar Installation Credit", description: "Federal tax credit for solar panel installation", amount: "26% Tax Credit" },
  { icon: "🌡️", title: "Smart Thermostat Rebate", description: "Rebate for installing smart thermostats", amount: "Up to $100" },
];

export const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
export const getPriorityConfig = (priority) => PRIORITY_CONFIG[priority?.toLowerCase()] || PRIORITY_CONFIG.low;