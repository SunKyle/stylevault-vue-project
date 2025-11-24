import { clothingApi } from './apiClient';

// 衣物服务层，封装API调用和数据处理
export const clothingService = {
  // 获取所有衣物类别
  getCategories: async () => {
    try {
      const response = await clothingApi.getCategories();
      // 确保返回的数据格式一致
      return Array.isArray(response.data) ? response.data : 
             Array.isArray(response) ? response : 
             response && response.length === undefined ? [response] : [];
    } catch (error) {
      console.error('获取衣物类别失败:', error);
      throw error;
    }
  },

  // 获取所有衣物
  getClothingItems: async () => {
    try {
      const response = await clothingApi.getAll();
      // 处理可能的不同响应格式
      return response.items || response.data?.items || response.data || [];
    } catch (error) {
      console.error('获取衣物列表失败:', error);
      throw error;
    }
  },

  // 搜索衣物
  searchClothingItems: async (keyword) => {
    try {
      const response = await clothingApi.search(keyword);
      return response.data || response;
    } catch (error) {
      console.error('搜索衣物失败:', error);
      throw error;
    }
  },

  // 获取单个衣物详情
  getClothingItemById: async (id) => {
    try {
      const response = await clothingApi.getById(id);
      return response.data || response;
    } catch (error) {
      console.error('获取衣物详情失败:', error);
      throw error;
    }
  },

  // 添加衣物
  addClothingItem: async (item) => {
    try {
      const response = await clothingApi.create(item);
      return response.data || response;
    } catch (error) {
      console.error('添加衣物失败:', error);
      throw error;
    }
  },

  // 更新衣物
  updateClothingItem: async (id, updates) => {
    try {
      const response = await clothingApi.update(id, updates);
      return response.data || response;
    } catch (error) {
      console.error('更新衣物失败:', error);
      throw error;
    }
  },

  // 删除衣物
  deleteClothingItem: async (id) => {
    try {
      const response = await clothingApi.delete(id);
      return response.data || response;
    } catch (error) {
      console.error('删除衣物失败:', error);
      throw error;
    }
  },

  // 获取收藏衣物
  getFavoriteClothingItems: async () => {
    try {
      const response = await clothingApi.getFavorites();
      return response.data || response;
    } catch (error) {
      console.error('获取收藏衣物失败:', error);
      throw error;
    }
  },

  // 切换收藏状态
  toggleFavoriteClothingItem: async (id) => {
    try {
      const response = await clothingApi.toggleFavorite(id);
      return response.data || response;
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      throw error;
    }
  }
};