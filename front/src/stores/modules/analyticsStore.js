import { defineStore } from 'pinia';
import { analyticsApi } from '../../services/apiClient';
import { showToast } from '../../utils/toast';
import { useClothingStore } from './clothingStore';
import { useOutfitStore } from './outfitStore';

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    clothingStats: null,
    categoryDistribution: [],
    usageFrequency: [],
    seasonalAnalysis: [],
    outfitStats: null,
    costAnalysis: [],
    loading: false,
    error: null,
    lastUpdated: null,
  }),

  getters: {
    totalItems: state => state.clothingStats?.total || 0,
    totalCategories: state => state.categoryDistribution.length,
    mostUsedCategory: state => {
      if (!state.categoryDistribution.length) return null;
      return state.categoryDistribution.reduce((max, current) =>
        current.count > max.count ? current : max
      );
    },
    wardrobeValue: state => state.costAnalysis.reduce((sum, item) => sum + (item.price || 0), 0),
  },

  actions: {
    async fetchClothingStats() {
      this.loading = true;
      this.error = null;
      try {
        const clothingStore = useClothingStore();
        const stats = await analyticsApi.getClothingStats(clothingStore.clothingItems);
        this.clothingStats = stats;
        this.lastUpdated = new Date();
        return stats;
      } catch (error) {
        this.error = error.message;
        showToast('获取衣物统计信息失败', 'error');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategoryDistribution() {
      try {
        const clothingStore = useClothingStore();
        const distribution = await analyticsApi.getCategoryDistribution(
          clothingStore.clothingItems
        );
        this.categoryDistribution = distribution;
        return distribution;
      } catch (error) {
        console.error('获取分类分布失败:', error);
        showToast('获取分类分布失败', 'error');
      }
    },

    async fetchUsageFrequency() {
      try {
        const clothingStore = useClothingStore();
        const frequency = await analyticsApi.getUsageFrequency(
          clothingStore.clothingItems
        );
        this.usageFrequency = frequency;
        return frequency;
      } catch (error) {
        console.error('获取使用频率失败:', error);
        showToast('获取使用频率失败', 'error');
      }
    },

    async fetchSeasonalAnalysis() {
      try {
        const clothingStore = useClothingStore();
        const seasonal = await analyticsApi.getSeasonalAnalysis(
          clothingStore.clothingItems
        );
        this.seasonalAnalysis = seasonal;
        return seasonal;
      } catch (error) {
        console.error('获取季节分析失败:', error);
        showToast('获取季节分析失败', 'error');
      }
    },

    async fetchOutfitStats() {
      try {
        const outfitStore = useOutfitStore();
        const stats = await analyticsApi.getOutfitStats(outfitStore.outfits);
        this.outfitStats = stats;
        return stats;
      } catch (error) {
        console.error('获取搭配统计失败:', error);
        showToast('获取搭配统计失败', 'error');
      }
    },

    async fetchCostAnalysis() {
      try {
        const clothingStore = useClothingStore();
        const cost = await analyticsApi.getCostAnalysis(clothingStore.clothingItems);
        this.costAnalysis = cost;
        return cost;
      } catch (error) {
        console.error('获取成本分析失败:', error);
        showToast('获取成本分析失败', 'error');
      }
    },

    async initializeAnalytics() {
      // 并行加载所有分析数据
      await Promise.all([
        this.fetchClothingStats(),
        this.fetchCategoryDistribution(),
        this.fetchUsageFrequency(),
        this.fetchSeasonalAnalysis(),
        this.fetchOutfitStats(),
        this.fetchCostAnalysis(),
      ]);
    },

    refreshAllData() {
      return this.initializeAnalytics();
    },
  },
});
