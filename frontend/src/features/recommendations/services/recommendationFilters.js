export const filterByPriority = (items, priorityFilter) => {
  if (priorityFilter === "all") return items;
  return items.filter(item => item.priority?.toLowerCase() === priorityFilter);
};

export const filterBySearch = (items, searchTerm) => {
  if (!searchTerm) return items;
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    ["neighborhood", "message", "reason", "action", "id"].some(field =>
      String(item[field] ?? "").toLowerCase().includes(term)
    )
  );
};