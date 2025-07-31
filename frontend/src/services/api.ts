import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000',
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;
