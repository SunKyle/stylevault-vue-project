import apiClient from '../core/axiosConfig';
import { API_ENDPOINTS } from '../core/apiEndpoints';

// 认证API
const authApi = {
  login: async credentials => {
    return apiClient.post(API_ENDPOINTS.auth.login, credentials);
  },
  register: async userData => {
    return apiClient.post(API_ENDPOINTS.auth.register, userData);
  },
  logout: async () => {
    return apiClient.post(API_ENDPOINTS.auth.logout);
  },
  getUserInfo: async () => {
    return apiClient.get(API_ENDPOINTS.auth.userInfo);
  },
  // 本地存储相关方法
  getToken: () => {
    return localStorage.getItem('token');
  },
  setToken: token => {
    localStorage.setItem('token', token);
  },
  removeToken: () => {
    localStorage.removeItem('token');
  },
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: user => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem('user');
  },
};

export default authApi;
