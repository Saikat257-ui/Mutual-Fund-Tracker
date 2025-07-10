import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const MF_API_URL = process.env.REACT_APP_MF_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded');
    }

    // Log errors in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would typically log to a service like Sentry
      console.error('API Error:', error);
    }

    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const searchMutualFunds = async (searchTerm) => {
  try {
    let url;
    if (!searchTerm || !searchTerm.trim()) {
      // Fetch all funds if searchTerm is empty
      url = `${MF_API_URL}/mf`;
    } else {
      url = `${MF_API_URL}/mf/search?q=${encodeURIComponent(searchTerm)}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMutualFundDetails = async (schemeCode) => {
  try {
    const response = await axios.get(`${MF_API_URL}/mf/${schemeCode}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const saveMutualFund = async (fundData) => {
  try {
    const response = await api.post('/api/funds/save', fundData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSavedFunds = async () => {
  try {
    const response = await api.get('/api/funds/saved');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeSavedFund = async (fundId) => {
  try {
    const response = await api.delete(`/api/funds/saved/${fundId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
