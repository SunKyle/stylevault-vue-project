import apiClient from './axiosConfig';

// Outfit Creator API
const outfitCreatorApi = {
  // 获取衣物分类
  getCategories: async () => {
    return apiClient.get('/categories');
  },
  
  // 获取衣物列表
  getClothingItems: async (params = {}) => {
    return apiClient.get('/clothing', { params });
  },
  
  // 保存搭配
  saveOutfit: async (outfitData) => {
    return apiClient.post('/outfits', outfitData);
  },
  
  // 获取搭配列表
  getOutfits: async (params = {}) => {
    return apiClient.get('/outfits', { params });
  },
  
  // 删除搭配
  deleteOutfit: async (id) => {
    return apiClient.delete(`/outfits/${id}`);
  },
};

export default outfitCreatorApi;