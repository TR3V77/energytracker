import apiClient from "./apiClient";

export const energyApi = {
  healthCheck: () => apiClient.get("/health"),
  // uploadFile: (formData) => apiClient.post("/upload", formData, {  // REMOVED
  //   headers: { "Content-Type": "multipart/form-data" },
  // }),
  getNeighborhoods: () => apiClient.get("/neighborhoods"),
  getEnergyData: (params) => apiClient.get("/energy", { params }),
  getEfficiencyRankings: (params) => apiClient.get("/analytics/rankings", { params }),
  getTrends: (params) => apiClient.get("/analytics/trends", { params }),
  getRecommendations: (params) => apiClient.get("/analytics/recommendations", { params }),
};

export default energyApi;