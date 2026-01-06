import apiClient from '../core/axiosConfig';
import { API_ENDPOINTS } from '../core/apiEndpoints';
// 导入storage工具
import { storage } from '../../stores/storeUtils';

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
    return storage.get('token');
  },
  setToken: token => {
    storage.set('token', token);
  },
  removeToken: () => {
    storage.remove('token');
  },
  getUser: () => {
    return storage.get('user_info');
  },
  setUser: user => {
    storage.set('user_info', user);
  },
  removeUser: () => {
    storage.remove('user_info');
  },
};

export default authApi;
