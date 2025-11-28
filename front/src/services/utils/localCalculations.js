// 本地计算函数

// 计算衣物统计
export function calculateClothingStats(clothingItems) {
  return {
    total: clothingItems.length,
    categories: [...new Set(clothingItems.map(item => item.category))].length,
    totalValue: clothingItems.reduce((sum, item) => sum + (item.price || 0), 0),
    averagePrice: clothingItems.length
      ? clothingItems.reduce((sum, item) => sum + (item.price || 0), 0) / clothingItems.length
      : 0,
  };
}

// 计算分类分布
export function calculateCategoryDistribution(clothingItems) {
  const distribution = {};
  clothingItems.forEach(item => {
    const category = item.category || 'Unknown';
    distribution[category] = (distribution[category] || 0) + 1;
  });
  return Object.keys(distribution).map(category => ({
    category,
    count: distribution[category],
    percentage: ((distribution[category] / clothingItems.length) * 100).toFixed(2),
  }));
}

// 计算使用频率
export function calculateUsageFrequency(clothingItems) {
  return clothingItems
    .filter(item => item.usageCount !== undefined)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, 10)
    .map(item => ({
      id: item.id,
      name: item.name,
      usageCount: item.usageCount || 0,
    }));
}

// 计算季节分析
export function calculateSeasonalAnalysis(clothingItems) {
  const seasonalItems = { spring: 0, summer: 0, autumn: 0, winter: 0 };
  clothingItems.forEach(item => {
    if (item.season) {
      seasonalItems[item.season] = (seasonalItems[item.season] || 0) + 1;
    }
  });
  return seasonalItems;
}

// 计算搭配统计
export function calculateOutfitStats(outfits) {
  return {
    total: outfits.length,
    favorites: outfits.filter(outfit => outfit.liked).length,
    mostPopular: outfits.sort((a, b) => (b.likes || 0) - (a.likes || 0))[0] || null,
  };
}

// 计算成本分析
export function calculateCostAnalysis(clothingItems) {
  return clothingItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price || 0,
    category: item.category,
  }));
}
