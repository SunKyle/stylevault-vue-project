import { outfitAdaptorApi } from './adapter'

// 搭配API
export default {
  // 获取所有搭配
  getOutfits: async () => {
    try {
      return await outfitAdaptorApi.getOutfits()
    } catch (error) {
      console.error('获取搭配列表失败:', error)
      throw error
    }
  },

  // 根据标签获取搭配
  getOutfitsByTag: async (tag) => {
    try {
      return await outfitAdaptorApi.getOutfitsByTag(tag)
    } catch (error) {
      console.error('获取标签搭配失败:', error)
      throw error
    }
  },

  // 获取搭配详情
  getOutfitDetail: async (id) => {
    try {
      return await outfitAdaptorApi.getOutfitDetail(id)
    } catch (error) {
      console.error('获取搭配详情失败:', error)
      throw error
    }
  },

  // 添加新搭配
  addOutfit: async (outfit) => {
    try {
      return await outfitAdaptorApi.addOutfit(outfit)
    } catch (error) {
      console.error('添加搭配失败:', error)
      throw error
    }
  },

  // 更新搭配
  updateOutfit: async (id, updates) => {
    try {
      return await outfitAdaptorApi.updateOutfit(id, updates)
    } catch (error) {
      console.error('更新搭配失败:', error)
      throw error
    }
  },

  // 删除搭配
  deleteOutfit: async (id) => {
    try {
      return await outfitAdaptorApi.deleteOutfit(id)
    } catch (error) {
      console.error('删除搭配失败:', error)
      throw error
    }
  },

  // 切换搭配的喜欢状态
  toggleLike: async (id) => {
    try {
      return await outfitAdaptorApi.toggleLike(id)
    } catch (error) {
      console.error('切换喜欢状态失败:', error)
      throw error
    }
  }
}
