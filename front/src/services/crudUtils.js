import apiClient from './axiosConfig';
import API_ENDPOINTS from './apiEndpoints';

// 通用CRUD方法
export const createApiService = (resource) => {
  return {
    getAll: async (params = {}) => {
      return apiClient.get(API_ENDPOINTS[resource].getItems, { params });
    },
    
    getById: async (id) => {
      return apiClient.get(API_ENDPOINTS[resource].getItemById(id));
    },
    
    create: async (data) => {
      return apiClient.post(API_ENDPOINTS[resource].createItem, data);
    },
    
    update: async (id, data) => {
      return apiClient.put(API_ENDPOINTS[resource].updateItem(id), data);
    },
    
    delete: async (id) => {
      return apiClient.delete(API_ENDPOINTS[resource].deleteItem(id));
    },
  };
};

export default createApiService;