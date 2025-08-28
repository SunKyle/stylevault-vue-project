import { analyticsApi } from './adapter'

// 分析API
export default {
  // 获取衣物统计信息
  getClothingStats: async () => {
    try {
      return await analyticsApi.getClothingStats()
    } catch (error) {
      console.error('获取衣物统计失败:', error)
      throw error
    }
  },

  // 获取搭配统计信息
  getOutfitStats: async () => {
    try {
      return await analyticsApi.getOutfitStats()
    } catch (error) {
      console.error('获取搭配统计失败:', error)
      throw error
    }
  },

  // 获取穿着频率分析
  getWearFrequency: async (params = {}) => {
    try {
      return await analyticsApi.getWearFrequency(params)
    } catch (error) {
      console.error('获取穿着频率分析失败:', error)
      throw error
    }
  },

  // 获取衣物类别分布
  getCategoryDistribution: async () => {
    try {
      return await analyticsApi.getCategoryDistribution()
    } catch (error) {
      console.error('获取类别分布失败:', error)
      throw error
    }
  },

  // 获取季节穿着分析
  getSeasonalAnalysis: async () => {
    try {
      return await analyticsApi.getSeasonalAnalysis()
    } catch (error) {
      console.error('获取季节穿着分析失败:', error)
      throw error
    }
  },

  // 获取风格偏好分析
  getStylePreferences: async () => {
    try {
      return await analyticsApi.getStylePreferences()
    } catch (error) {
      console.error('获取风格偏好分析失败:', error)
      throw error
    }
  },

  // 获取衣物价值分析
  getValueAnalysis: async () => {
    try {
      return await analyticsApi.getValueAnalysis()
    } catch (error) {
      console.error('获取价值分析失败:', error)
      throw error
    }
  }
}
