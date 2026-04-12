export const FEATURES = [
  {
    icon: "📊",
    title: "Dashboard",
    description: "View KPIs, daily consumption charts, and filter by neighborhood, time window, and granularity.",
    linkTo: "/dashboard",
    linkText: "View Dashboard",
    gradient: "linear-gradient(90deg, #0066cc, #004999)",
  },
  {
    icon: "💡",
    title: "Recommendations",
    description: "Get rule-based efficiency recommendations for each neighborhood based on real consumption data.",
    linkTo: "/recommendations",
    linkText: "View Recommendations",
    gradient: "linear-gradient(90deg, #28a745, #1e7b34)",
  },
  {
    icon: "🏆",
    title: "Rankings",
    description: "Compare neighborhoods by efficiency score and track which areas are performing best.",
    linkTo: "/rankings",
    linkText: "View Rankings",
    gradient: "linear-gradient(90deg, #fd7e14, #e8590c)",
  },
];

export const HOW_IT_WORKS_STEPS = [
  { 
    number: 1, 
    title: "Collect", 
    description: "Energy records are stored per neighborhood with daily kWh readings." 
  },
  { 
    number: 2, 
    title: "Analyze", 
    description: "The system calculates efficiency scores and identifies consumption patterns." 
  },
  { 
    number: 3, 
    title: "Recommend", 
    description: "Neighborhoods receive prioritized recommendations based on their efficiency band." 
  },
];

export const TECH_STACK = [
  { category: "Frontend", technologies: "React · Bootstrap 5 · Recharts" },
  { category: "Backend", technologies: "Flask · SQLAlchemy · PostgreSQL" },
  { category: "Infrastructure", technologies: "Docker Compose · Bitbucket Pipelines" },
  { category: "Testing", technologies: "pytest · vitest · flake8" },
];