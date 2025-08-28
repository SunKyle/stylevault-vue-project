// 分析数据
export const analyticsData = {
  // 衣物统计信息
  clothingStats: {
    totalItems: 30,
    totalValue: 15000,
    averageWearCount: 12,
    mostWornItem: {
      id: 5,
      name: '运动鞋',
      wearCount: 30,
    },
    leastWornItem: {
      id: 4,
      name: '风衣',
      wearCount: 5,
    },
    favoriteItems: 20,
    itemsAddedThisMonth: 3,
    itemsWornThisMonth: 15,
  },

  // 搭配统计信息
  outfitStats: {
    totalOutfits: 12,
    favoriteOutfits: 8,
    mostUsedOutfit: {
      id: 2,
      name: '周末休闲',
      usageCount: 8,
    },
    outfitsCreatedThisMonth: 2,
    averageItemsPerOutfit: 3.5,
  },

  // 穿着频率分析
  wearFrequency: [
    { name: '白色T恤', count: 8 },
    { name: '牛仔裤', count: 12 },
    { name: '连帽卫衣', count: 15 },
    { name: '风衣', count: 5 },
    { name: '运动鞋', count: 30 },
    { name: '手表', count: 30 },
    { name: '双肩包', count: 18 },
  ],

  // 类别分布
  categoryDistribution: [
    { name: '上装', count: 8, percentage: 27 },
    { name: '下装', count: 5, percentage: 17 },
    { name: '外套', count: 4, percentage: 13 },
    { name: '鞋履', count: 5, percentage: 17 },
    { name: '配饰', count: 4, percentage: 13 },
    { name: '包包', count: 4, percentage: 13 },
  ],

  // 季节穿着分析
  seasonalAnalysis: [
    { season: '春季', count: 20, percentage: 35 },
    { season: '夏季', count: 15, percentage: 26 },
    { season: '秋季', count: 18, percentage: 32 },
    { season: '冬季', count: 4, percentage: 7 },
  ],

  // 风格偏好分析
  stylePreferences: [
    { style: '休闲', count: 18, percentage: 60 },
    { style: '商务', count: 8, percentage: 27 },
    { style: '运动', count: 3, percentage: 10 },
    { style: '摇滚', count: 1, percentage: 3 },
  ],

  // 价值分析
  valueAnalysis: {
    totalValue: 15000,
    averageItemValue: 500,
    highestValueItem: {
      id: 21,
      name: '灰色风衣',
      value: 2500,
    },
    lowestValueItem: {
      id: 1,
      name: '白色T恤',
      value: 99,
    },
    valuePerWear: {
      highest: {
        id: 5,
        name: '运动鞋',
        value: 800,
        wearCount: 30,
        valuePerWear: 26.67,
      },
      lowest: {
        id: 4,
        name: '风衣',
        value: 1500,
        wearCount: 5,
        valuePerWear: 300,
      },
    },
  },
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 分析API
export const analyticsAPI = {
  // 获取衣物统计信息
  getClothingStats: async () => {
    return { success: true, data: analyticsData.clothingStats };
  },

  // 获取搭配统计信息
  getOutfitStats: async () => {
    await delay(400);
    return { success: true, data: analyticsData.outfitStats };
  },

  // 获取穿着频率分析
  getWearFrequency: async () => {
    await delay(500);
    return { success: true, data: analyticsData.wearFrequency };
  },

  // 获取衣物类别分布
  getCategoryDistribution: async () => {
    await delay(400);
    return { success: true, data: analyticsData.categoryDistribution };
  },

  // 获取季节穿着分析
  getSeasonalAnalysis: async () => {
    await delay(400);
    return { success: true, data: analyticsData.seasonalAnalysis };
  },

  // 获取风格偏好分析
  getStylePreferences: async () => {
    await delay(400);
    return { success: true, data: analyticsData.stylePreferences };
  },

  // 获取衣物价值分析
  getValueAnalysis: async () => {
    await delay(500);
    return { success: true, data: analyticsData.valueAnalysis };
  },
};
