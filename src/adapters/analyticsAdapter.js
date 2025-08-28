import analyticsService from '../services/analyticsService'
import { useToast } from '../utils/toast'

export class AnalyticsAdapter {
  constructor() {
    this.service = analyticsService
    this.toast = useToast()
  }

  // 获取衣物统计信息
  async fetchClothingStats() {
    try {
      const stats = await this.service.getClothingStats()
      return stats
    } catch (error) {
      this.toast.error('获取衣物统计失败')
      throw error
    }
  }

  // 获取搭配统计信息
  async fetchOutfitStats() {
    try {
      const stats = await this.service.getOutfitStats()
      return stats
    } catch (error) {
      this.toast.error('获取搭配统计失败')
      throw error
    }
  }

  // 获取穿着频率分析
  async fetchWearFrequency(params = {}) {
    try {
      const frequency = await this.service.getWearFrequency(params)
      return frequency
    } catch (error) {
      this.toast.error('获取穿着频率分析失败')
      throw error
    }
  }

  // 获取衣物类别分布
  async fetchCategoryDistribution() {
    try {
      const distribution = await this.service.getCategoryDistribution()
      return distribution
    } catch (error) {
      this.toast.error('获取类别分布失败')
      throw error
    }
  }

  // 获取季节穿着分析
  async fetchSeasonalAnalysis() {
    try {
      const analysis = await this.service.getSeasonalAnalysis()
      return analysis
    } catch (error) {
      this.toast.error('获取季节穿着分析失败')
      throw error
    }
  }

  // 获取风格偏好分析
  async fetchStylePreferences() {
    try {
      const preferences = await this.service.getStylePreferences()
      return preferences
    } catch (error) {
      this.toast.error('获取风格偏好分析失败')
      throw error
    }
  }

  // 获取衣物价值分析
  async fetchValueAnalysis() {
    try {
      const analysis = await this.service.getValueAnalysis()
      return analysis
    } catch (error) {
      this.toast.error('获取价值分析失败')
      throw error
    }
  }

  // 获取完整的分析报告
  async fetchFullReport() {
    try {
      const [
        clothingStats,
        outfitStats,
        wearFrequency,
        categoryDistribution,
        seasonalAnalysis,
        stylePreferences,
        valueAnalysis
      ] = await Promise.all([
        this.fetchClothingStats(),
        this.fetchOutfitStats(),
        this.fetchWearFrequency(),
        this.fetchCategoryDistribution(),
        this.fetchSeasonalAnalysis(),
        this.fetchStylePreferences(),
        this.fetchValueAnalysis()
      ])

      return {
        clothingStats,
        outfitStats,
        wearFrequency,
        categoryDistribution,
        seasonalAnalysis,
        stylePreferences,
        valueAnalysis
      }
    } catch (error) {
      this.toast.error('获取完整分析报告失败')
      throw error
    }
  }
}

// 创建单例实例
export const analyticsAdapter = new AnalyticsAdapter()
