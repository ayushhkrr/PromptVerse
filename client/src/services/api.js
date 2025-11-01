import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // http://localhost:5000/api/v1

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ USER/AUTH APIs ============
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/users/register', userData),
  
  // Login user
  login: (credentials) => api.post('/users/login', credentials),
  
  // Update user
  updateUser: (userId, userData) => api.patch(`/users/${userId}`, userData),
  
  // Delete user
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  
  // Become seller
  becomeSeller: () => api.patch('/users/become-seller'),

  // Get user profile
  getUserProfile: () => api.get('/users/profile'),

  // Google OAuth (redirect URL)
  googleAuth: () => `${API_URL}/users/google/auth`,
};

// ============ PROMPT APIs ============
export const promptAPI = {
  // Get all approved prompts (public)
  getAllPrompts: (page = 1, limit = 10, tag = '') => {
    const params = { page, limit };
    if (tag) params.tag = tag;
    return api.get('/prompts', { params });
  },
  
  // Get my prompts (seller only)
  getMyPrompts: () => api.get('/prompts/myprompts'),
  
  // Create new prompt (seller only)
  createPrompt: (formData) => api.post('/prompts/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Update prompt
  updatePrompt: (promptId, promptData) => api.patch(`/prompts/${promptId}`, promptData),
  
  // Delete prompt
  deletePrompt: (promptId) => api.delete(`/prompts/${promptId}`),
  
  // Get prompt preview (AI generated)
  getPromptPreview: (promptId) => api.get(`/prompts/${promptId}/preview`),
  
  // Update prompt status (admin only)
  updatePromptStatus: (promptId, status) =>
    api.patch(`/prompts/${promptId}/status`, { status }),

  // Get all prompts (admin only)
  getAllPromptsAdmin: (page = 1, limit = 100) =>
    api.get('/prompts/admin/all', { params: { page, limit } }),
};

export const orderAPI = {
  // Create checkout session
  createCheckout: (promptId) => api.post(`/orders/checkout/${promptId}`),
  
  // Get my purchased prompts
  getMyPurchases: () => api.get('/orders/prompts'),
};

// ============ ADMIN APIs ============
export const adminAPI = {
  // Get platform stats
  getStats: () => api.get('/users/stats'),
  
  // Update user status
  updateUserStatus: (userId, status) => 
    api.patch(`/users/${userId}/status`, { status }),
};

export default api;