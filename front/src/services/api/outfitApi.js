import apiClient from '../core/axiosConfig';
import { API_ENDPOINTS } from '../core/apiEndpoints';
import { createApiService } from '../utils/crudUtils';

// 搭配API - 使用通用CRUD
const outfitApi = createApiService('outfit');

// 添加outfit特定方法
outfitApi.getOutfits = async (params = {}) => {
  return apiClient.get(API_ENDPOINTS.outfit.getItems, { params });
};

outfitApi.getOutfitsByTag = async (tag, params = {}) => {
  return apiClient.get(API_ENDPOINTS.outfit.getByTag(tag), { params });
};

outfitApi.getOutfitDetail = async id => {
  return apiClient.get(API_ENDPOINTS.outfit.getItemById(id));
};

outfitApi.addOutfit = async outfit => {
  return apiClient.post(API_ENDPOINTS.outfit.createItem, outfit);
};

outfitApi.updateOutfit = async (id, updates) => {
  return apiClient.put(API_ENDPOINTS.outfit.updateItem(id), updates);
};

outfitApi.deleteOutfit = async id => {
  return apiClient.delete(API_ENDPOINTS.outfit.deleteItem(id));
};

outfitApi.toggleLike = async id => {
  return apiClient.patch(API_ENDPOINTS.outfit.toggleLike(id));
};

export default outfitApi;
