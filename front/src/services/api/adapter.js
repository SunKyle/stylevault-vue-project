import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api/v1',
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

// 衣物API适配器
export const clothingAdaptorApi = {
  // 获取所有衣物类别
  getCategories: async () => {
    return apiClient.get('/categories');
  },

  // 获取所有衣物
  getClothingItems: async () => {
    return apiClient.get('/clothing');
  },

  // 根据类别获取衣物
  getClothingItemsByCategory: async categoryId => {
    return apiClient.get(`/clothing/category/${categoryId}`);
  },

  // 获取衣物详情
  getClothingItemDetail: async id => {
    return apiClient.get(`/clothing/${id}`);
  },

  // 添加衣物
  addClothingItem: async item => {
    return apiClient.post('/clothing', item);
  },

  // 更新衣物
  updateClothingItem: async (id, item) => {
    return apiClient.put(`/clothing/${id}`, item);
  },

  // 删除衣物
  deleteClothingItem: async id => {
    return apiClient.delete(`/clothing/${id}`);
  },

  // 获取用户的收藏衣物
  getFavoriteItems: async userId => {
    return apiClient.get('/clothing/favorites', { params: { userId } });
  },

  // 切换衣物收藏状态
  toggleFavorite: async clothingId => {
    return apiClient.post(`/clothing/${clothingId}/favorite`);
  },

  // 搜索衣物
  searchClothing: async query => {
    return apiClient.get('/clothing/search', { params: query });
  },

  // 上传衣物图片
  uploadClothingImage: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/clothing/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// 用户API适配器
export const userAdaptorApi = {
  // 用户登录
  login: async credentials => {
    return apiClient.post('/auth/login', credentials);
  },

  // 用户注册
  register: async userData => {
    return apiClient.post('/auth/register', userData);
  },

  // 获取用户信息
  getUserProfile: async () => {
    return apiClient.get('/user/profile');
  },

  // 更新用户信息
  updateUserProfile: async profileData => {
    return apiClient.put('/user/profile', profileData);
  },

  // 用户登出
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // 获取用户统计信息
  getUserStats: async () => {
    return apiClient.get('/user/stats');
  },
};

// 搭配API适配器
export const outfitAdaptorApi = {
  // 获取所有搭配
  getOutfits: async () => {
    return apiClient.get('/outfits');
  },

  // 获取搭配详情
  getOutfitDetail: async id => {
    return apiClient.get(`/outfits/${id}`);
  },

  // 创建搭配
  createOutfit: async outfitData => {
    return apiClient.post('/outfits', outfitData);
  },

  // 更新搭配
  updateOutfit: async (id, outfitData) => {
    return apiClient.put(`/outfits/${id}`, outfitData);
  },

  // 删除搭配
  deleteOutfit: async id => {
    return apiClient.delete(`/outfits/${id}`);
  },

  // 切换搭配收藏状态
  toggleOutfitFavorite: async outfitId => {
    return apiClient.post(`/outfits/${outfitId}/favorite`);
  },

  // 获取用户收藏的搭配
  getFavoriteOutfits: async userId => {
    return apiClient.get('/outfits/favorites', { params: { userId } });
  },

  // 搜索搭配
  searchOutfits: async query => {
    return apiClient.get('/outfits/search', { params: query });
  },
};

// 枚举数据API适配器
export const enumsAdaptorApi = {
  // 获取所有枚举数据
  getAllEnums: async () => {
    try {
      const response = await apiClient.get('/enums/all');
      // 检查响应结构，后端返回的格式是 { data: {...}, message: '...' }
      if (response && response.data && typeof response.data === 'object') {
        // 返回data字段中的枚举数据
        return response.data;
      } else if (response && typeof response === 'object') {
        // 如果没有data字段，尝试直接使用response
        return response;
      }
      // 如果API返回的数据格式不正确，返回空对象
      console.warn('枚举API返回的数据格式不正确:', response);
      return {};
    } catch (error) {
      console.error('获取枚举数据失败:', error);
      // 出错时返回空对象，防止前端因数据格式问题崩溃
      return {};
    }
  },

  // 获取指定类型的枚举数据
  getEnumsByType: async type => {
    try {
      const data = await apiClient.get(`/enums/${type}`);
      // 确保返回的数据是数组格式
      if (data && Array.isArray(data)) {
        return data;
      }
      console.warn(`类型${type}的枚举API返回的数据格式不正确`);
      return [];
    } catch (error) {
      console.error(`获取类型${type}的枚举数据失败:`, error);
      return [];
    }
  },
};

// 天气API适配器
export const weatherAdaptorApi = {
  // 获取当前天气
  getCurrentWeather: async location => {
    return apiClient.get('/weather/current', {
      params: {
        lat: location.lat,
        lng: location.lng,
      },
    });
  },

  // 获取天气预报
  getWeatherForecast: async location => {
    return apiClient.get('/weather/forecast', {
      params: {
        lat: location.lat,
        lng: location.lng,
        days: 7,
      },
    });
  },

  // 获取基于天气的搭配推荐
  getWeatherRecommendations: async ({ weather, clothes }) => {
    return apiClient.post('/weather/recommendations', {
      weather,
      clothes,
    });
  },
};

// 分析API适配器
export const analyticsAdaptorApi = {
  // 获取衣物统计分析
  getClothingAnalytics: async () => {
    return apiClient.get('/analytics/clothing');
  },

  // 获取搭配统计分析
  getOutfitAnalytics: async () => {
    return apiClient.get('/analytics/outfits');
  },

  // 获取用户使用统计
  getUserUsageAnalytics: async () => {
    return apiClient.get('/analytics/user-usage');
  },
};

// 默认导出apiClient，以便其他地方直接使用
export default apiClient;
