import { analyticsAdaptorApi } from './adapter'

// 分析API
export default {
  // 获取衣物统计信息
  getClothingStats: async () => {
    try {
      return await analyticsAdaptorApi.getClothingStats()
    } catch (error) {
      console.error('获取衣物统计失败:', error)
      throw error
    }
  },

  // 获取搭配统计信息
  getOutfitStats: async () => {
    try {
      return await analyticsAdaptorApi.getOutfitStats()
    } catch (error) {
      console.error('获取搭配统计失败:', error)
      throw error
    }
  },

  // 获取穿着频率分析
  getWearFrequency: async (params = {}) => {
    try {
      return await analyticsAdaptorApi.getWearFrequency(params)
    } catch (error) {
      console.error('获取穿着频率分析失败:', error)
      throw error
    }
  },

  // 获取衣物类别分布
  getCategoryDistribution: async () => {
    try {
      return await analyticsAdaptorApi.getCategoryDistribution()
    } catch (error) {
      console.error('获取类别分布失败:', error)
      throw error
    }
  },

  // 获取季节穿着分析
  getSeasonalAnalysis: async () => {
    try {
      return await analyticsAdaptorApi.getSeasonalAnalysis()
    } catch (error) {
      console.error('获取季节穿着分析失败:', error)
      throw error
    }
  },

  // 获取风格偏好分析
  getStylePreferences: async () => {
    try {
      return await analyticsAdaptorApi.getStylePreferences()
    } catch (error) {
      console.error('获取风格偏好分析失败:', error)
      throw error
    }
  },

  // 获取衣物价值分析
  getValueAnalysis: async () => {
    try {
      return await analyticsAdaptorApi.getValueAnalysis()
    } catch (error) {
      console.error('获取价值分析失败:', error)
      throw error
    }
  }
}
