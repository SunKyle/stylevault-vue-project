import BaseService from './baseService';
import outfitApi from './api/outfitApi';

export default class OutfitService extends BaseService {
  constructor() {
    super('outfits');
  }

  // 获取所有搭配
  async getOutfits() {
    try {
      const response = await outfitApi.getOutfits();
      return response.data;
    } catch (error) {
      this.handleError(error, '获取搭配列表失败');
      throw error;
    }
  }

  // 根据标签获取搭配
  async getOutfitsByTag(tag) {
    try {
      const response = await outfitApi.getOutfitsByTag(tag);
      return response.data;
    } catch (error) {
      this.handleError(error, '获取标签搭配失败');
      throw error;
    }
  }

  // 获取搭配详情
  async getOutfitDetail(id) {
    try {
      const response = await outfitApi.getOutfitDetail(id);
      return response.data;
    } catch (error) {
      this.handleError(error, '获取搭配详情失败');
      throw error;
    }
  }

  // 添加新搭配
  async addOutfit(outfit) {
    try {
      const response = await outfitApi.addOutfit(outfit);
      return response.data;
    } catch (error) {
      this.handleError(error, '添加搭配失败');
      throw error;
    }
  }

  // 更新搭配
  async updateOutfit(id, updates) {
    try {
      const response = await outfitApi.updateOutfit(id, updates);
      return response.data;
    } catch (error) {
      this.handleError(error, '更新搭配失败');
      throw error;
    }
  }

  // 删除搭配
  async deleteOutfit(id) {
    try {
      const response = await outfitApi.deleteOutfit(id);
      return response.data;
    } catch (error) {
      this.handleError(error, '删除搭配失败');
      throw error;
    }
  }

  // 切换搭配的喜欢状态
  async toggleLike(id) {
    try {
      const response = await outfitApi.toggleLike(id);
      return response.data;
    } catch (error) {
      this.handleError(error, '切换喜欢状态失败');
      throw error;
    }
  }
}

// 创建单例实例
export const outfitService = new OutfitService();
