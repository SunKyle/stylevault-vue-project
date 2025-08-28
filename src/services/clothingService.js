import BaseService from './baseService'
import clothingApi from './api/clothingApi'

export default class ClothingService extends BaseService {
  constructor() {
    super('clothing')
  }

  // 获取所有衣物类别
  async getCategories() {
    try {
      const response = await clothingApi.getCategories()
      return response.data
    } catch (error) {
      this.handleError(error, '获取衣物类别失败')
      throw error
    }
  }

  // 获取所有衣物
  async getClothingItems() {
    try {
      const response = await clothingApi.getClothingItems()
      return response.data
    } catch (error) {
      this.handleError(error, '获取衣物列表失败')
      throw error
    }
  }

  // 根据类别获取衣物
  async getClothingItemsByCategory(categoryId) {
    try {
      const response = await clothingApi.getClothingItemsByCategory(categoryId)
      return response.data
    } catch (error) {
      this.handleError(error, '获取类别衣物失败')
      throw error
    }
  }

  // 获取衣物详情
  async getClothingItemDetail(id) {
    try {
      const response = await clothingApi.getClothingItemDetail(id)
      return response.data
    } catch (error) {
      this.handleError(error, '获取衣物详情失败')
      throw error
    }
  }

  // 添加衣物
  async addClothingItem(item) {
    try {
      const response = await clothingApi.addClothingItem(item)
      return response.data
    } catch (error) {
      this.handleError(error, '添加衣物失败')
      throw error
    }
  }

  // 更新衣物信息
  async updateClothingItem(id, updates) {
    try {
      const response = await clothingApi.updateClothingItem(id, updates)
      return response.data
    } catch (error) {
      this.handleError(error, '更新衣物失败')
      throw error
    }
  }

  // 删除衣物
  async deleteClothingItem(id) {
    try {
      const response = await clothingApi.deleteClothingItem(id)
      return response.data
    } catch (error) {
      this.handleError(error, '删除衣物失败')
      throw error
    }
  }

  // 搜索衣物
  async searchClothingItems(keyword) {
    try {
      const response = await clothingApi.searchClothingItems(keyword)
      return response.data
    } catch (error) {
      this.handleError(error, '搜索衣物失败')
      throw error
    }
  }

  // 切换收藏状态
  async toggleFavorite(id) {
    try {
      // 先获取当前衣物信息
      const item = await this.getClothingItemDetail(id)
      if (!item) {
        throw new Error('衣物不存在')
      }

      // 切换收藏状态
      const updatedItem = await this.updateClothingItem(id, { 
        favorite: !item.favorite 
      })

      return updatedItem
    } catch (error) {
      this.handleError(error, '切换收藏状态失败')
      throw error
    }
  }
}

// 创建单例实例
export const clothingService = new ClothingService()
