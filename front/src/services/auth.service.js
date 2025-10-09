import { httpClient } from './http.client';

class AuthService {
  async register(data) {
    try {
      const response = await httpClient.post('/auth/register', data);
      return response;
    } catch (error) {
      // 优先使用后端返回的具体错误信息
      const message =
        error.response?.data?.message || error.response?.data?.error?.details || '注册失败！！！';
      const errorObj = new Error(message);
      errorObj.response = error.response;
      throw errorObj;
    }
  }

  async login(credentials) {
    try {
      const response = await httpClient.post('/auth/login', credentials);
      return response;
    } catch (error) {
      // 优先使用后端返回的具体错误信息
      const message =
        error.response?.data?.message || error.response?.data?.error?.details || '登录失败';
      const errorObj = new Error(message);
      errorObj.response = error.response;
      throw errorObj;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
