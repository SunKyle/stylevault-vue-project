import { outfitApi } from './adapter'

// 搭配API
export default {
  // 获取所有搭配
  getOutfits: async () => {
    try {
      return await outfitApi.getOutfits()
    } catch (error) {
      console.error('获取搭配列表失败:', error)
      throw error
    }
  },

  // 根据标签获取搭配
  getOutfitsByTag: async (tag) => {
    try {
      return await outfitApi.getOutfitsByTag(tag)
    } catch (error) {
      console.error('获取标签搭配失败:', error)
      throw error
    }
  },

  // 获取搭配详情
  getOutfitDetail: async (id) => {
    try {
      return await outfitApi.getOutfitDetail(id)
    } catch (error) {
      console.error('获取搭配详情失败:', error)
      throw error
    }
  },

  // 添加新搭配
  addOutfit: async (outfit) => {
    try {
      return await outfitApi.addOutfit(outfit)
    } catch (error) {
      console.error('添加搭配失败:', error)
      throw error
    }
  },

  // 更新搭配
  updateOutfit: async (id, updates) => {
    try {
      return await outfitApi.updateOutfit(id, updates)
    } catch (error) {
      console.error('更新搭配失败:', error)
      throw error
    }
  },

  // 删除搭配
  deleteOutfit: async (id) => {
    try {
      return await outfitApi.deleteOutfit(id)
    } catch (error) {
      console.error('删除搭配失败:', error)
      throw error
    }
  },

  // 切换搭配的喜欢状态
  toggleLike: async (id) => {
    try {
      return await outfitApi.toggleLike(id)
    } catch (error) {
      console.error('切换喜欢状态失败:', error)
      throw error
    }
  }
}
