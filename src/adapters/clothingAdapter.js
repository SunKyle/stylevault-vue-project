import clothingService from '../services/clothingService';
import { showToast } from '../utils/toast';

export class ClothingAdapter {
  constructor() {
    this.service = clothingService;
    this.toast = showToast();
  }

  // 获取所有衣物，并处理错误和加载状态
  async fetchClothingItems() {
    try {
      const items = await this.service.getClothingItems();
      return items;
    } catch (error) {
      this.toast.error('获取衣物列表失败');
      throw error;
    }
  }

  // 获取所有衣物类别
  async fetchCategories() {
    try {
      const categories = await this.service.getCategories();
      return categories;
    } catch (error) {
      this.toast.error('获取衣物类别失败');
      throw error;
    }
  }

  // 根据类别获取衣物
  async fetchClothingItemsByCategory(categoryId) {
    try {
      const items = await this.service.getClothingItemsByCategory(categoryId);
      return items;
    } catch (error) {
      this.toast.error('获取类别衣物失败');
      throw error;
    }
  }

  // 获取衣物详情
  async fetchClothingItemDetail(id) {
    try {
      const item = await this.service.getClothingItemDetail(id);
      return item;
    } catch (error) {
      this.toast.error('获取衣物详情失败');
      throw error;
    }
  }

  // 添加衣物
  async addClothingItem(item) {
    try {
      const newItem = await this.service.addClothingItem(item);
      this.toast.success('衣物添加成功');
      return newItem;
    } catch (error) {
      this.toast.error('添加衣物失败');
      throw error;
    }
  }

  // 更新衣物信息
  async updateClothingItem(id, updates) {
    try {
      const updatedItem = await this.service.updateClothingItem(id, updates);
      this.toast.success('衣物更新成功');
      return updatedItem;
    } catch (error) {
      this.toast.error('更新衣物失败');
      throw error;
    }
  }

  // 删除衣物
  async deleteClothingItem(id) {
    try {
      await this.service.deleteClothingItem(id);
      this.toast.success('衣物删除成功');
      return true;
    } catch (error) {
      this.toast.error('删除衣物失败');
      throw error;
    }
  }

  // 搜索衣物
  async searchClothingItems(keyword) {
    try {
      const results = await this.service.searchClothingItems(keyword);
      return results;
    } catch (error) {
      this.toast.error('搜索衣物失败');
      throw error;
    }
  }

  // 切换收藏状态
  async toggleFavorite(id) {
    try {
      const result = await this.service.toggleFavorite(id);
      this.toast.success(result.favorite ? '已添加到收藏' : '已取消收藏');
      return result;
    } catch (error) {
      this.toast.error('切换收藏状态失败');
      throw error;
    }
  }
}

// 创建单例实例
export const clothingAdapter = new ClothingAdapter();
