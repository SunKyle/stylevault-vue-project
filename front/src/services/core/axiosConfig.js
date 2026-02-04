import axios from 'axios';
// 导入storage工具
import { storage } from '../../stores/storeUtils';

// 创建axios实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 添加token等认证信息
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  response => {
    // 统一处理响应数据
    return response.data;
  },
  error => {
    // 统一处理错误
    let errorMessage = '请求失败';

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = '未授权访问，请登录';
          // 只在token过期时清除token
          localStorage.removeItem('token');
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器错误，请稍后再试';
          break;
        default:
          errorMessage = `请求错误: ${error.response.status}`;
      }
    } else {
      errorMessage = '网络错误，请检查您的网络连接';
    }

    console.error(errorMessage, error);
    // 可以在这里添加统一的错误提示逻辑
    // showToast(errorMessage, 'error');

    return Promise.reject(error);
  }
);

export default apiClient;
