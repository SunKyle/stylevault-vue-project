// 模块拆分重构：apiClient.js 主入口文件

// 导入axios基础配置
import apiClient from './core/axiosConfig';

// 导入API端点配置
export { API_ENDPOINTS } from './core/apiEndpoints';

// 导入通用CRUD工具
export { createApiService } from './utils/crudUtils';

// 导入各API服务模块
export { default as authApi } from './api/authApi';
export { default as enumsApi } from './api/enumsApi';
export { default as outfitCreatorApi } from './api/outfitCreatorApi';
export { default as clothingApi } from './api/clothingApi';
export { default as outfitApi } from './api/outfitApi';
export { default as analyticsApi } from './api/analyticsApi';

// 导入本地计算函数
export * from './utils/localCalculations';

// 导出默认的axios实例
export default apiClient;