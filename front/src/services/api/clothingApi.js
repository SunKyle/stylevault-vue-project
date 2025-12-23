import apiClient from '../core/axiosConfig';
import { API_ENDPOINTS } from '../core/apiEndpoints';
import { createApiService } from '../utils/crudUtils';

// 衣物API - 使用通用CRUD
const clothingApi = createApiService('clothing');

// 添加衣物特定方法
clothingApi.getCategories = async () => {
  return apiClient.get(API_ENDPOINTS.clothing.getCategories);
};

clothingApi.getByCategory = async categoryId => {
  return apiClient.get(API_ENDPOINTS.clothing.getByCategory(categoryId));
};

clothingApi.search = async keyword => {
  return apiClient.get(API_ENDPOINTS.clothing.search, { params: { q: keyword } });
};

clothingApi.getFavorites = async userId => {
  return apiClient.get(API_ENDPOINTS.clothing.favorite, { params: { userId } });
};

clothingApi.toggleFavorite = async id => {
  return apiClient.post(`/clothing/${id}/favorite`);
};

// 批量更新
clothingApi.batchUpdate = async items => {
  return apiClient.patch(API_ENDPOINTS.clothing.batchUpdate, { items });
};

// 上传衣物图片
clothingApi.uploadImage = async formData => {
  return apiClient.post(API_ENDPOINTS.clothing.uploadImage, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default clothingApi;
