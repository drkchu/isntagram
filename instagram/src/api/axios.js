import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Backend url
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request Headers:", config.headers); // Debug log
  return config;
});

export default api;
