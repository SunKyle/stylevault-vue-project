// API端点配置
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    userInfo: '/auth/user',
  },
  enums: {
    getAllEnums: '/enums/all',
    getEnumsByType: (type) => `/enums/${type}`,
  },
  clothing: {
    getCategories: '/categories',
    getItems: '/clothing',
    getItemById: (id) => `/clothing/${id}`,
    createItem: '/clothing',
    updateItem: (id) => `/clothing/${id}`,
    deleteItem: (id) => `/clothing/${id}`,
    getByCategory: (categoryId) => `/clothing/category/${categoryId}`,
    search: '/clothing/search',
    favorite: '/clothing/favorites',
    toggleFavorite: (id) => `/clothing/${id}/favorite`,
    batchUpdate: '/clothing/batch',
  },
  outfit: {
    getItems: '/outfits',
    getItemById: (id) => `/outfits/${id}`,
    createItem: '/outfits',
    updateItem: (id) => `/outfits/${id}`,
    deleteItem: (id) => `/outfits/${id}`,
    getByTag: (tag) => `/outfits/tag/${tag}`,
    toggleLike: (id) => `/outfits/${id}/like`,
  },
  analytics: {
    clothingStats: '/analytics/clothing-stats',
    categoryDistribution: '/analytics/category-distribution',
    usageFrequency: '/analytics/usage-frequency',
    seasonalAnalysis: '/analytics/seasonal-analysis',
    outfitStats: '/analytics/outfit-stats',
    costAnalysis: '/analytics/cost-analysis',
  },
};

export default API_ENDPOINTS;