import { defineStore } from 'pinia';
import { authService } from '../services/auth.service.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getUser(),
    token: authService.getToken(),
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
  },

  actions: {
    async login(credentials) {
      const response = await authService.login(credentials);

      // 修复：正确访问后端返回的数据结构
      if (response.success) {
        this.token = response.data.token;
        this.user = response.data.user;

        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
      } else {
        // 如果后端返回错误，抛出异常
        throw new Error(response.message || '登录失败');
      }

      return response;
    },

    async register(data) {
      const response = await authService.register(data);

      // 修复：正确访问后端返回的数据结构
      if (response.success) {
        this.token = response.data.token;
        this.user = response.data.user;

        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
      } else {
        // 如果后端返回错误，抛出异常
        throw new Error(response.message || '注册失败');
      }

      return response;
    },

    logout() {
      authService.logout();
      this.token = null;
      this.user = null;
    },

    checkAuth() {
      const token = authService.getToken();
      const user = authService.getUser();

      if (token && user) {
        this.token = token;
        this.user = user;
        return true;
      }

      return false;
    },
  },
});
