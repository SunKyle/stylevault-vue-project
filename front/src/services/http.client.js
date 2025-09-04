import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

class HttpClient {
  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, params) {
    const response = await this.instance.get(url, { params });
    return response;
  }

  async post(url, data) {
    const response = await this.instance.post(url, data);
    return response;
  }

  async put(url, data) {
    const response = await this.instance.put(url, data);
    return response;
  }

  async delete(url) {
    const response = await this.instance.delete(url);
    return response;
  }
}

export const httpClient = new HttpClient();