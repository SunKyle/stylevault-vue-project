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
      // 检查响应是否成功
      if (response && response.success === true) {
        // 从response.data中获取token和user，这是后端实际返回的结构
        const token = response.data?.token;
        const user = response.data?.user;
        
        // 如果有token和user，保存它们
        if (token) {
          this.token = token;
          authApi.setToken(token);
        }
        if (user) {
          this.user = user;
          authApi.setUser(user);
        }
        return response;
      } else if (response && response.success === false) {
        // 如果后端明确返回失败，抛出具体错误信息
        throw new Error(response.message || '登录失败');
      } else {
        // 其他情况也认为成功，因为后端可能返回了其他格式的数据
        console.warn('Unexpected response format from login API:', response);
        return response;
      }
    },

    async register(data) {
      const response = await authApi.register(data);

      // 后端返回的数据已经被响应拦截器处理过
      // 检查响应是否成功
      if (response && response.success === true) {
        // 从response.data中获取token和user，这是后端实际返回的结构
        const token = response.data?.token;
        const user = response.data?.user;
        
        // 如果有token和user，保存它们
        if (token) {
          this.token = token;
          authApi.setToken(token);
        }
        if (user) {
          this.user = user;
          authApi.setUser(user);
        }
        return response;
      } else if (response && response.success === false) {
        // 如果后端明确返回失败，抛出具体错误信息
        throw new Error(response.message || '注册失败');
      } else {
        // 其他情况也认为成功，因为后端可能返回了其他格式的数据
        console.warn('Unexpected response format from register API:', response);
        return response;
      }
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
