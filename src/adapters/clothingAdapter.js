import { clothingService } from '../services/clothingService';
import { showToast } from '../utils/toast';

export class ClothingAdapter {
  constructor() {
    this.service = clothingService;
  }

  // 获取所有衣物，并处理错误和加载状态
  async fetchClothingItems() {
    try {
      const items = await this.service.getClothingItems();
      return items;
    } catch (error) {
      showToast('获取衣物列表失败', 'error');
      throw error;
    }
  }

  // 获取所有衣物类别
  async fetchCategories() {
    try {
      const categories = await this.service.getCategories();
      return categories;
    } catch (error) {
      showToast('获取衣物类别失败', 'error');
      throw error;
    }
  }

  // 根据类别获取衣物
  async fetchClothingItemsByCategory(categoryId) {
    try {
      const items = await this.service.getClothingItemsByCategory(categoryId);
      return items;
    } catch (error) {
      showToast('获取类别衣物失败', 'error');
      throw error;
    }
  }

  // 获取衣物详情
  async fetchClothingItemDetail(id) {
    try {
      const item = await this.service.getClothingItemDetail(id);
      return item;
    } catch (error) {
      showToast('获取衣物详情失败', 'error');
      throw error;
    }
  }

  // 添加衣物
  async addClothingItem(item) {
    try {
      const newItem = await this.service.addClothingItem(item);
      showToast('衣物添加成功', 'success');
      return newItem;
    } catch (error) {
      showToast('添加衣物失败', 'error');
      throw error;
    }
  }

  // 更新衣物信息
  async updateClothingItem(id, updates) {
    try {
      const updatedItem = await this.service.updateClothingItem(id, updates);
      showToast('衣物更新成功', 'success');
      return updatedItem;
    } catch (error) {
      showToast('更新衣物失败', 'error');
      throw error;
    }
  }

  // 删除衣物
  async deleteClothingItem(id) {
    try {
      await this.service.deleteClothingItem(id);
      showToast('衣物删除成功', 'success');
      return true;
    } catch (error) {
      showToast('删除衣物失败', 'error');
      throw error;
    }
  }

  // 搜索衣物
  async searchClothingItems(keyword) {
    try {
      const results = await this.service.searchClothingItems(keyword);
      return results;
    } catch (error) {
      showToast('搜索衣物失败', 'error');
      throw error;
    }
  }

  // 切换收藏状态
  async toggleFavorite(id) {
    try {
      const result = await this.service.toggleFavorite(id);
      showToast(result.favorite ? '已添加到收藏' : '已取消收藏', 'success');
      return result;
    } catch (error) {
      showToast('切换收藏状态失败', 'error');
      throw error;
    }
  }
}

// 创建单例实例
export const clothingAdapter = new ClothingAdapter();
