import { wardrobeAPI } from '../mock/wardrobe'

class WardrobeService {
  // 获取所有衣物类别
  async getCategories() {
    try {
      const response = await wardrobeAPI.getCategories()
      return response.data
    } catch (error) {
      console.error('获取衣物类别失败:', error)
      throw error
    }
  }

  // 获取所有衣物
  async getClothingItems() {
    try {
      const response = await wardrobeAPI.getClothingItems()
      return response.data
    } catch (error) {
      console.error('获取衣物列表失败:', error)
      throw error
    }
  }

  // 根据类别获取衣物
  async getClothingItemsByCategory(categoryId) {
    try {
      const response = await wardrobeAPI.getClothingItemsByCategory(categoryId)
      return response.data
    } catch (error) {
      console.error('获取类别衣物失败:', error)
      throw error
    }
  }

  // 获取衣物详情
  async getClothingItemDetail(id) {
    try {
      const response = await wardrobeAPI.getClothingItemDetail(id)
      return response.data
    } catch (error) {
      console.error('获取衣物详情失败:', error)
      throw error
    }
  }

  // 添加衣物
  async addClothingItem(item) {
    try {
      const response = await wardrobeAPI.addClothingItem(item)
      return response.data
    } catch (error) {
      console.error('添加衣物失败:', error)
      throw error
    }
  }

  // 更新衣物信息
  async updateClothingItem(id, updates) {
    try {
      const response = await wardrobeAPI.updateClothingItem(id, updates)
      return response.data
    } catch (error) {
      console.error('更新衣物失败:', error)
      throw error
    }
  }

  // 删除衣物
  async deleteClothingItem(id) {
    try {
      await wardrobeAPI.deleteClothingItem(id)
      return true
    } catch (error) {
      console.error('删除衣物失败:', error)
      throw error
    }
  }

  // 搜索衣物
  async searchClothingItems(keyword) {
    try {
      const response = await wardrobeAPI.searchClothingItems(keyword)
      return response.data
    } catch (error) {
      console.error('搜索衣物失败:', error)
      throw error
    }
  }
}

export default new WardrobeService()
