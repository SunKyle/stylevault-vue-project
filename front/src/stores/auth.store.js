import { defineStore } from 'pinia';
import { authService } from '../services/auth.service.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getUser(),
    token: authService.getToken(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      const response = await authService.login(credentials);
      
      this.token = response.data.token;
      this.user = response.data.user;
      
      authService.setToken(response.data.token);
      authService.setUser(response.data.user);
      
      return response;
    },

    async register(data) {
      const response = await authService.register(data);
      
      this.token = response.data.token;
      this.user = response.data.user;
      
      authService.setToken(response.data.token);
      authService.setUser(response.data.user);
      
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