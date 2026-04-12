import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.response?.data?.error || "An error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export const healthCheck = () => apiClient.get("/health");
export const getNeighborhoods = () => apiClient.get("/neighborhoods");
export const getEnergyData = (params) => apiClient.get("/energy", { params });
export const getEfficiencyRankings = (params) => apiClient.get("/analytics/rankings", { params });
export const getTrends = (params) => apiClient.get("/analytics/trends", { params });
export const getRecommendations = (params) => apiClient.get("/analytics/recommendations", { params });

export default apiClient;