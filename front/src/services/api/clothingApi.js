import { clothingAdaptorApi } from './adapter';

// 衣物API
export default {
  // 获取所有衣物类别
  getCategories: async () => {
    try {
      return await clothingAdaptorApi.getCategories();
    } catch (error) {
      console.error('获取衣物类别失败:', error);
      throw error;
    }
  },

  // 获取所有衣物
  getClothingItems: async () => {
    try {
      return await clothingAdaptorApi.getClothingItems();
    } catch (error) {
      console.error('获取衣物列表失败:', error);
      throw error;
    }
  },

  // 根据类别获取衣物
  getClothingItemsByCategory: async categoryId => {
    try {
      return await clothingAdaptorApi.getClothingItemsByCategory(categoryId);
    } catch (error) {
      console.error('获取类别衣物失败:', error);
      throw error;
    }
  },

  // 获取衣物详情
  getClothingItemDetail: async id => {
    try {
      return await clothingAdaptorApi.getClothingItemDetail(id);
    } catch (error) {
      console.error('获取衣物详情失败:', error);
      throw error;
    }
  },

  // 添加衣物
  addClothingItem: async item => {
    try {
      return await clothingAdaptorApi.addClothingItem(item);
    } catch (error) {
      console.error('添加衣物失败:', error);
      throw error;
    }
  },

  // 更新衣物信息
  updateClothingItem: async (id, updates) => {
    try {
      return await clothingAdaptorApi.updateClothingItem(id, updates);
    } catch (error) {
      console.error('更新衣物失败:', error);
      throw error;
    }
  },

  // 删除衣物
  deleteClothingItem: async id => {
    try {
      return await clothingAdaptorApi.deleteClothingItem(id);
    } catch (error) {
      console.error('删除衣物失败:', error);
      throw error;
    }
  },

  // 搜索衣物
  searchClothingItems: async keyword => {
    try {
      return await clothingAdaptorApi.searchClothingItems(keyword);
    } catch (error) {
      console.error('搜索衣物失败:', error);
      throw error;
    }
  },

  // 获取收藏衣物
  getFavoriteItems: async userId => {
    try {
      return await clothingAdaptorApi.getFavoriteItems(userId);
    } catch (error) {
      console.error('获取收藏衣物失败:', error);
      throw error;
    }
  },
};
