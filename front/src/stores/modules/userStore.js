import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
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
    // 检查用户是否已登录
    isLoggedIn: state => !!state.user,

    // 获取温度单位
    temperatureUnit: state => state.preferences.temperatureUnit,

    // 获取颜色主题
    colorScheme: state => state.preferences.colorScheme,

    // 获取默认视图
    defaultView: state => state.preferences.defaultView,

    // 获取通知设置
    notificationSettings: state => state.preferences.notifications,

    // 获取用户ID
    userId: state => (state.user ? state.user.id : null),

    // 获取用户名
    userName: state => (state.user ? state.user.name : '游客'),
  },

  actions: {
    // 设置加载状态
    setLoading(status) {
      this.loading = status;
    },

    // 设置错误信息
    setError(error) {
      this.error = error;
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },

    // 登录
    async login(credentials) {
      this.setLoading(true);
      this.clearError();

      try {
        // 这里应该调用实际的登录API
        // const response = await authService.login(credentials)
        // this.user = response.user

        // 模拟登录成功
        this.user = {
          id: 'user123',
          name: '时尚达人',
          email: credentials.email,
          avatar: 'https://picsum.photos/seed/avatar/100/100',
          preferences: this.preferences,
        };

        return this.user;
      } catch (error) {
        this.setError('登录失败，请检查您的用户名和密码');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 注册
    async register(userData) {
      this.setLoading(true);
      this.clearError();

      try {
        // 这里应该调用实际的注册API
        // const response = await authService.register(userData)
        // this.user = response.user

        // 模拟注册成功
        this.user = {
          id: 'user' + Date.now(),
          name: userData.name,
          email: userData.email,
          avatar: 'https://picsum.photos/seed/avatar' + Date.now() + '/100/100',
          preferences: this.preferences,
        };

        return this.user;
      } catch (error) {
        this.setError('注册失败，请稍后重试');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 登出
    logout() {
      this.user = null;
      // 清除本地存储的token和用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // 更新用户信息
    async updateUserProfile(updates) {
      this.setLoading(true);
      this.clearError();

      try {
        // 这里应该调用实际的更新API
        // const response = await authService.updateProfile(this.user.id, updates)
        // this.user = { ...this.user, ...updates }

        // 模拟更新成功
        this.user = { ...this.user, ...updates };

        return this.user;
      } catch (error) {
        this.setError('更新用户信息失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 更新偏好设置
    updatePreferences(newPreferences) {
      this.preferences = { ...this.preferences, ...newPreferences };

      // 如果用户已登录，同时更新用户信息中的偏好设置
      if (this.user) {
        this.user.preferences = this.preferences;
      }

      // 这里可以添加API调用来更新后端数据
      // await authService.updatePreferences(this.preferences)
    },

    // 更新通知设置
    updateNotificationSettings(newSettings) {
      this.preferences.notifications = { ...this.preferences.notifications, ...newSettings };

      // 如果用户已登录，同时更新用户信息中的通知设置
      if (this.user) {
        this.user.preferences.notifications = this.preferences.notifications;
      }

      // 这里可以添加API调用来更新后端数据
      // await authService.updateNotificationSettings(this.preferences.notifications)
    },

    // 切换温度单位
    toggleTemperatureUnit() {
      const newUnit = this.preferences.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
      this.updatePreferences({ temperatureUnit: newUnit });
    },

    // 切换颜色主题
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

    // 切换默认视图
    toggleDefaultView() {
      const newView = this.preferences.defaultView === 'grid' ? 'list' : 'grid';
      this.updatePreferences({ defaultView: newView });
    },

    // 切换特定通知设置
    toggleNotificationSetting(settingName) {
      if (settingName in this.preferences.notifications) {
        const newSettings = {
          ...this.preferences.notifications,
          [settingName]: !this.preferences.notifications[settingName],
        };
        this.updateNotificationSettings(newSettings);
      }
    },

    // 初始化用户数据（例如从本地存储或API）
    async initializeUser() {
      this.setLoading(true);
      this.clearError();

      try {
        // 这里可以添加从本地存储或API获取用户数据的逻辑
        // 例如检查本地存储中的token，并获取用户信息

        // 模拟从本地存储获取用户偏好
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
          try {
            const parsedPreferences = JSON.parse(savedPreferences);
            this.updatePreferences(parsedPreferences);
          } catch (e) {
            console.error('解析用户偏好设置失败:', e);
          }
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
