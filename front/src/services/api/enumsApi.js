import apiClient from '../core/axiosConfig';
import { API_ENDPOINTS } from '../core/apiEndpoints';

// 枚举API
const enumsApi = {
  getAllEnums: async () => {
    return apiClient.get(API_ENDPOINTS.enums.getAllEnums);
  },
  getEnumsByType: async (type) => {
    return apiClient.get(API_ENDPOINTS.enums.getEnumsByType(type));
  },
};

export default enumsApi;