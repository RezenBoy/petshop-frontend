// src/libs/api.js
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API + "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
