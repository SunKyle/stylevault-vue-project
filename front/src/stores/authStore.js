import { defineStore } from 'pinia';
import { authApi } from '../services/apiClient.js';
import { storage, setAuthData, clearAuthData, setUserPreferences } from './storeUtils.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authApi.getUser(),
    token: authApi.getToken(),
    // 偏好设置
    preferences: {
      temperatureUnit: 'celsius', // 'celsius' 或 'fahrenheit'
      colorScheme: 'light', // 'light'、'dark' 或 'auto'
      defaultView: 'grid', // 'grid' 或 'list'
      notifications: {
        weatherAlerts: true,
        outfitRecommendations: true,
        laundryReminders: true,
      },
    },
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    // 偏好设置 Getters
    temperatureUnit: state => state.preferences.temperatureUnit,
    colorScheme: state => state.preferences.colorScheme,
    defaultView: state => state.preferences.defaultView,
    notificationSettings: state => state.preferences.notifications,
    userId: state => (state.user ? state.user.id : null),
    userName: state => (state.user ? state.user.name : '游客'),
  },

  actions: {
    // ========== 认证相关 Actions ==========
    async login(credentials) {
      this.setLoading(true);
      this.clearError();

      try {
        const response = await authApi.login(credentials);

        if (response && response.success === true) {
          const authData = {
            token: response.data?.token,
            user: response.data?.user,
          };
          setAuthData(this, authData);
          return response;
        } else if (response && response.success === false) {
          throw new Error(response.message || '登录失败');
        } else {
          console.warn('Unexpected response format from login API:', response);
          return response;
        }
      } catch (error) {
        this.setError('登录失败，请检查您的用户名和密码');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async register(data) {
      this.setLoading(true);
      this.clearError();

      try {
        const response = await authApi.register(data);

        if (response && response.success === true) {
          const authData = {
            token: response.data?.token,
            user: response.data?.user,
          };
          setAuthData(this, authData);
          return response;
        } else if (response && response.success === false) {
          throw new Error(response.message || '注册失败');
        } else {
          console.warn('Unexpected response format from register API:', response);
          return response;
        }
      } catch (error) {
        this.setError('注册失败，请稍后重试');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
      authApi.removeToken();
      authApi.removeUser();
      clearAuthData(this);
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

    // ========== 偏好设置 Actions ==========
    setLoading(status) {
      this.loading = status;
    },

    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    updatePreferences(newPreferences) {
      setUserPreferences(this, newPreferences);

      // 如果用户已登录，同时更新用户信息中的偏好设置
      if (this.user) {
        this.user.preferences = this.preferences;
      }
    },

    updateNotificationSettings(newSettings) {
      this.preferences.notifications = { ...this.preferences.notifications, ...newSettings };

      if (this.user) {
        this.user.preferences.notifications = this.preferences.notifications;
      }

      storage.set('userPreferences', this.preferences);
    },

    toggleTemperatureUnit() {
      const newUnit = this.preferences.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      this.updatePreferences({ temperatureUnit: newUnit });
    },

    toggleColorScheme() {
      let newScheme;
      switch (this.preferences.colorScheme) {
        case 'light':
          newScheme = 'dark';
          break;
        case 'dark':
          newScheme = 'auto';
          break;
        case 'auto':
          newScheme = 'light';
          break;
        default:
          newScheme = 'light';
      }
      this.updatePreferences({ colorScheme: newScheme });
    },

    toggleDefaultView() {
      const newView = this.preferences.defaultView === 'grid' ? 'list' : 'grid';
      this.updatePreferences({ defaultView: newView });
    },

    toggleNotificationSetting(settingName) {
      if (settingName in this.preferences.notifications) {
        const newSettings = {
          ...this.preferences.notifications,
          [settingName]: !this.preferences.notifications[settingName],
        };
        this.updateNotificationSettings(newSettings);
      }
    },

    async initializeUser() {
      this.setLoading(true);
      this.clearError();

      try {
        // 从本地存储恢复偏好设置
        const savedPreferences = storage.get('userPreferences');
        if (savedPreferences) {
          this.updatePreferences(savedPreferences);
        }
        return this.user;
      } catch (error) {
        this.setError('初始化用户数据失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
