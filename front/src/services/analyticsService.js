import BaseService from './baseService';
import { mockAnalyticsData } from '../mock/analytics';

class AnalyticsService extends BaseService {
  constructor() {
    super();
    this.baseURL = '/api/analytics';
  }

  async getClothingStats(clothingItems) {
    try {
      const response = await this.request({
        method: 'POST',
        url: `${this.baseURL}/clothing-stats`,
        data: { clothingItems },
      });

      return response.data || this.calculateClothingStats(clothingItems);
    } catch (error) {
      return this.calculateClothingStats(clothingItems);
    }
  }

  async getCategoryDistribution(clothingItems) {
    try {
      const response = await this.request({
        method: 'POST',
        url: `${this.baseURL}/category-distribution`,
        data: { clothingItems },
      });

      return response.data || this.calculateCategoryDistribution(clothingItems);
    } catch (error) {
      return this.calculateCategoryDistribution(clothingItems);
    }
  }

  async getUsageFrequency(clothingItems) {
    try {
      const response = await this.request({
        method: 'POST',
        url: `${this.baseURL}/usage-frequency`,
        data: { clothingItems },
      });

      return response.data || this.calculateUsageFrequency(clothingItems);
    } catch (error) {
      return this.calculateUsageFrequency(clothingItems);
    }
  }

  async getSeasonalAnalysis(clothingItems) {
    try {
      const response = await this.request({
        method: 'POST',
        url: `${this.baseURL}/seasonal-analysis`,
        data: { clothingItems },
      });

      return response.data || this.calculateSeasonalAnalysis(clothingItems);
    } catch (error) {
      return this.calculateSeasonalAnalysis(clothingItems);
    }
  }

  async getOutfitStats(outfits) {
    try {
      const response = await this.request({
        method: 'POST',
        url: `${this.baseURL}/outfit-stats`,
        data: { outfits },
      });

      return response.data || this.calculateOutfitStats(outfits);
    } catch (error) {
      return this.calculateOutfitStats(outfits);
    }
  }

  async getCostAnalysis(clothingItems) {
    try {
      const response = await this.request({
        method: 'POST',
        url: `${this.baseURL}/cost-analysis`,
        data: { clothingItems },
      });

      return response.data || this.calculateCostAnalysis(clothingItems);
    } catch (error) {
      return this.calculateCostAnalysis(clothingItems);
    }
  }

  // 计算方法实现
  calculateClothingStats(items) {
    return {
      total: items.length,
      categories: [...new Set(items.map(item => item.category))].length,
      totalValue: items.reduce((sum, item) => sum + (item.price || 0), 0),
      averagePrice: items.length
        ? items.reduce((sum, item) => sum + (item.price || 0), 0) / items.length
        : 0,
    };
  }

  calculateCategoryDistribution(items) {
    const distribution = {};
    items.forEach(item => {
      const category = item.category || '未分类';
      distribution[category] = (distribution[category] || 0) + 1;
    });

    return Object.entries(distribution).map(([category, count]) => ({
      category,
      count,
      percentage: ((count / items.length) * 100).toFixed(1),
    }));
  }

  calculateUsageFrequency(items) {
    return items
      .filter(item => item.lastWorn)
      .map(item => ({
        id: item.id,
        name: item.name,
        lastWorn: item.lastWorn,
        frequency: item.wearCount || 0,
      }))
      .sort((a, b) => new Date(b.lastWorn) - new Date(a.lastWorn));
  }

  calculateSeasonalAnalysis(items) {
    const seasonalData = {
      spring: items.filter(item => item.season?.includes('春')).length,
      summer: items.filter(item => item.season?.includes('夏')).length,
      autumn: items.filter(item => item.season?.includes('秋')).length,
      winter: items.filter(item => item.season?.includes('冬')).length,
    };

    return Object.entries(seasonalData).map(([season, count]) => ({
      season,
      count,
      percentage: ((count / items.length) * 100).toFixed(1),
    }));
  }

  calculateOutfitStats(outfits) {
    return {
      total: outfits.length,
      favorites: outfits.filter(outfit => outfit.isFavorite).length,
      averageItems: outfits.length
        ? outfits.reduce((sum, outfit) => sum + (outfit.items?.length || 0), 0) / outfits.length
        : 0,
      mostUsedItems: this.getMostUsedItems(outfits),
    };
  }

  calculateCostAnalysis(items) {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price || 0,
      costPerWear: item.price && item.wearCount ? (item.price / item.wearCount).toFixed(2) : 'N/A',
      category: item.category,
    }));
  }

  getMostUsedItems(outfits) {
    const itemCounts = {};
    outfits.forEach(outfit => {
      outfit.items?.forEach(item => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
      });
    });

    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([itemId, count]) => ({ itemId, count }));
  }
}

export const analyticsService = new AnalyticsService();
