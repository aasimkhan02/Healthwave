import axios from 'axios';

// Replace with your Django API base URL
const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
