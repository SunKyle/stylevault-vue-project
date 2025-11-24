import apiClient from '../core/axiosConfig';
import { API_ENDPOINTS } from '../core/apiEndpoints';
import { 
  calculateClothingStats, 
  calculateCategoryDistribution, 
  calculateUsageFrequency,
  calculateSeasonalAnalysis,
  calculateOutfitStats,
  calculateCostAnalysis
} from '../utils/localCalculations';

// Analytics API
const analyticsApi = {
  // 获取衣物统计
  getClothingStats: async (clothingItems) => {
    try {
      return await apiClient.post(API_ENDPOINTS.analytics.clothingStats, { clothingItems });
    } catch (error) {
      // 降级处理：本地计算
      return calculateClothingStats(clothingItems);
    }
  },
  
  // 获取分类分布
  getCategoryDistribution: async (clothingItems) => {
    try {
      return await apiClient.post(API_ENDPOINTS.analytics.categoryDistribution, { clothingItems });
    } catch (error) {
      // 降级处理：本地计算
      return calculateCategoryDistribution(clothingItems);
    }
  },
  
  // 获取使用频率
  getUsageFrequency: async (clothingItems) => {
    try {
      return await apiClient.post(API_ENDPOINTS.analytics.usageFrequency, { clothingItems });
    } catch (error) {
      return calculateUsageFrequency(clothingItems);
    }
  },
  
  // 获取季节分析
  getSeasonalAnalysis: async (clothingItems) => {
    try {
      return await apiClient.post(API_ENDPOINTS.analytics.seasonalAnalysis, { clothingItems });
    } catch (error) {
      return calculateSeasonalAnalysis(clothingItems);
    }
  },
  
  // 获取搭配统计
  getOutfitStats: async (outfits) => {
    try {
      return await apiClient.post(API_ENDPOINTS.analytics.outfitStats, { outfits });
    } catch (error) {
      return calculateOutfitStats(outfits);
    }
  },
  
  // 获取成本分析
  getCostAnalysis: async (clothingItems) => {
    try {
      return await apiClient.post(API_ENDPOINTS.analytics.costAnalysis, { clothingItems });
    } catch (error) {
      return calculateCostAnalysis(clothingItems);
    }
  },
};

export default analyticsApi;