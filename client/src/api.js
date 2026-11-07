import axios from "axios";

export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

const api = axios.create({
  baseURL: `${API_ORIGIN}/api/items`,
});

export const productApi = axios.create({
  baseURL: `${API_ORIGIN}/api/products`,
});

export default api;