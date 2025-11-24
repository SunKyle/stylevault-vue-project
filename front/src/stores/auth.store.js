import { defineStore } from 'pinia';
import { authApi } from '../services/apiClient.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authApi.getUser(),
    token: authApi.getToken(),
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
  },

  actions: {
    async login(credentials) {
      const response = await authApi.login(credentials);

      // 后端返回的数据已经被响应拦截器处理过
      if (response && response.token && response.user) {
        this.token = response.token;
        this.user = response.user;

        authApi.setToken(response.token);
        authApi.setUser(response.user);
      } else {
        // 如果后端返回错误，抛出异常
        throw new Error(response.message || '登录失败');
      }

      return response;
    },

    async register(data) {
      const response = await authApi.register(data);

      // 后端返回的数据已经被响应拦截器处理过
      if (response && response.token && response.user) {
        this.token = response.token;
        this.user = response.user;

        authApi.setToken(response.token);
        authApi.setUser(response.user);
      } else {
        // 如果后端返回错误，抛出异常
        throw new Error(response.message || '注册失败');
      }

      return response;
    },

    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout failed:', error);
        // 即使API调用失败，也清除本地存储
      }
      authApi.removeToken();
      authApi.removeUser();
      this.token = null;
      this.user = null;
    },

    checkAuth() {
      const token = authApi.getToken();
      const user = authApi.getUser();

      if (token && user) {
        this.token = token;
        this.user = user;
        return true;
      }

      return false;
    },
  },
});
