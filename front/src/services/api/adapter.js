import axios from 'axios';
import mockAPI from '../../mock';

// 创建axios实例
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 统一处理响应数据
    return response.data;
  },
  error => {
    // 统一处理错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          console.error('未授权访问，请登录');
          break;
        case 404:
          // 处理未找到
          console.error('请求的资源不存在');
          break;
        case 500:
          // 处理服务器错误
          console.error('服务器错误，请稍后再试');
          break;
        default:
          // 处理其他错误
          console.error(`请求错误: ${error.response.status}`);
      }
    } else {
      // 处理网络错误等
      console.error('网络错误，请检查您的网络连接');
    }
    return Promise.reject(error);
  }
);

// API适配器 - 始终使用真实API
const isDevelopment = false;

// 衣物API适配器
export const clothingAdaptorApi = {
  // 获取所有衣物类别
  getCategories: async () => {
    if (isDevelopment) {
      return mockAPI.wardrobe.getCategories();
    }
    return apiClient.get('/clothing/categories');
  },

  // 获取所有衣物
  getClothingItems: async () => {
    if (isDevelopment) {
      return mockAPI.wardrobe.getClothingItems();
    }
    return apiClient.get('/clothing');
  },

  // 根据类别获取衣物
  getClothingItemsByCategory: async categoryId => {
    if (isDevelopment) {
      return mockAPI.wardrobe.getClothingItemsByCategory(categoryId);
    }
    return apiClient.get(`/clothing/category/${categoryId}`);
  },

  // 获取衣物详情
  getClothingItemDetail: async id => {
    if (isDevelopment) {
      return mockAPI.wardrobe.getClothingItemDetail(id);
    }
    return apiClient.get(`/clothing/${id}`);
  },

  // 添加衣物
  addClothingItem: async item => {
    if (isDevelopment) {
      return mockAPI.wardrobe.addClothingItem(item);
    }
    return apiClient.post('/clothing', item);
  },

  // 更新衣物信息
  updateClothingItem: async (id, updates) => {
    if (isDevelopment) {
      return mockAPI.wardrobe.updateClothingItem(id, updates);
    }
    return apiClient.put(`/clothing/${id}`, updates);
  },

  // 删除衣物
  deleteClothingItem: async id => {
    if (isDevelopment) {
      return mockAPI.wardrobe.deleteClothingItem(id);
    }
    return apiClient.delete(`/clothing/${id}`);
  },

  // 搜索衣物
  searchClothingItems: async keyword => {
    if (isDevelopment) {
      return mockAPI.wardrobe.searchClothingItems(keyword);
    }
    return apiClient.get('/clothing/search', { params: { keyword } });
  },

  // 获取收藏衣物
  getFavoriteItems: async (userId) => {
    if (isDevelopment) {
      return mockAPI.wardrobe.getFavoriteItems(userId);
    }
    return apiClient.get('/clothing/favorites', { params: { userId } });
  },
};

// 用户API适配器
export const userAdaptorApi = {
  // 用户登录
  login: async credentials => {
    if (isDevelopment) {
      return mockAPI.user.login(credentials);
    }
    return apiClient.post('/user/login', credentials);
  },

  // 用户注册
  register: async userData => {
    if (isDevelopment) {
      return mockAPI.user.register(userData);
    }
    return apiClient.post('/user/register', userData);
  },

  // 获取用户信息
  getUserProfile: async userId => {
    if (isDevelopment) {
      return mockAPI.user.getUserProfile(userId);
    }
    return apiClient.get(`/user/${userId}`);
  },

  // 更新用户信息
  updateUserProfile: async (userId, updates) => {
    if (isDevelopment) {
      return mockAPI.user.updateUserProfile(userId, updates);
    }
    return apiClient.put(`/user/${userId}`, updates);
  },
};

// 搭配API适配器
export const outfitAdaptorApi = {
  // 获取所有搭配
  getOutfits: async () => {
    if (isDevelopment) {
      return mockAPI.outfit.getOutfits();
    }
    return apiClient.get('/outfits');
  },

  // 根据标签获取搭配
  getOutfitsByTag: async tag => {
    if (isDevelopment) {
      return mockAPI.outfit.getOutfitsByTag(tag);
    }
    return apiClient.get('/outfits/tag', { params: { tag } });
  },

  // 获取搭配详情
  getOutfitDetail: async id => {
    if (isDevelopment) {
      return mockAPI.outfit.getOutfitDetail(id);
    }
    return apiClient.get(`/outfits/${id}`);
  },

  // 添加新搭配
  addOutfit: async outfit => {
    if (isDevelopment) {
      return mockAPI.outfit.addOutfit(outfit);
    }
    return apiClient.post('/outfits', outfit);
  },

  // 更新搭配
  updateOutfit: async (id, updates) => {
    if (isDevelopment) {
      return mockAPI.outfit.updateOutfit(id, updates);
    }
    return apiClient.put(`/outfits/${id}`, updates);
  },

  // 删除搭配
  deleteOutfit: async id => {
    if (isDevelopment) {
      return mockAPI.outfit.deleteOutfit(id);
    }
    return apiClient.delete(`/outfits/${id}`);
  },

  // 切换搭配的喜欢状态
  toggleLike: async id => {
    if (isDevelopment) {
      return mockAPI.outfit.toggleLike(id);
    }
    return apiClient.post(`/outfits/${id}/like`);
  },
};

// 分析API适配器
export const analyticsAdaptorApi = {
  // 获取衣物统计信息
  getClothingStats: async () => {
    if (isDevelopment) {
      return mockAPI.analytics.getClothingStats();
    }
    return apiClient.get('/analytics/clothing');
  },

  // 获取搭配统计信息
  getOutfitStats: async () => {
    if (isDevelopment) {
      return mockAPI.analytics.getOutfitStats();
    }
    return apiClient.get('/analytics/outfits');
  },

  // 获取穿着频率分析
  getWearFrequency: async (params = {}) => {
    if (isDevelopment) {
      return mockAPI.analytics.getWearFrequency();
    }
    return apiClient.get('/analytics/wear-frequency', { params });
  },

  // 获取衣物类别分布
  getCategoryDistribution: async () => {
    if (isDevelopment) {
      return mockAPI.analytics.getCategoryDistribution();
    }
    return apiClient.get('/analytics/category-distribution');
  },

  // 获取季节穿着分析
  getSeasonalAnalysis: async () => {
    if (isDevelopment) {
      return mockAPI.analytics.getSeasonalAnalysis();
    }
    return apiClient.get('/analytics/seasonal');
  },

  // 获取风格偏好分析
  getStylePreferences: async () => {
    if (isDevelopment) {
      return mockAPI.analytics.getStylePreferences();
    }
    return apiClient.get('/analytics/style-preferences');
  },

  // 获取衣物价值分析
  getValueAnalysis: async () => {
    if (isDevelopment) {
      return mockAPI.analytics.getValueAnalysis();
    }
    return apiClient.get('/analytics/value');
  },
};

// 默认导出apiClient，以便其他地方直接使用
export default apiClient;
