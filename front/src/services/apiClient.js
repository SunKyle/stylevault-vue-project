// 模块拆分重构：apiClient.js 主入口文件

// 导入axios基础配置
import apiClient from './axiosConfig';

// 导入API端点配置
export { API_ENDPOINTS } from './apiEndpoints';

// 导入通用CRUD工具
export { createApiService } from './crudUtils';

// 导入各API服务模块
export { default as authApi } from './authApi';
export { default as enumsApi } from './enumsApi';
export { default as outfitCreatorApi } from './outfitCreatorApi';
export { default as clothingApi } from './clothingApi';
export { default as outfitApi } from './outfitApi';
export { default as analyticsApi } from './analyticsApi';

// 导入本地计算函数
export * from './localCalculations';

// 导出默认的axios实例
export default apiClient;