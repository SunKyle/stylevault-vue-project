import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 统一处理响应数据
    return response.data;
  },
  error => {
    // 统一处理错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          console.error('未授权访问，请登录');
          break;
        case 404:
          // 处理未找到
          console.error('请求的资源不存在');
          break;
        case 500:
          // 处理服务器错误
          console.error('服务器错误，请稍后再试');
          break;
        default:
          // 处理其他错误
          console.error(`请求错误: ${error.response.status}`);
      }
    } else {
      // 处理网络错误等
      console.error('网络错误，请检查您的网络连接');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
