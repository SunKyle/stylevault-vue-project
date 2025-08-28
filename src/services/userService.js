import BaseService from './baseService'
import userApi from './api/userApi'

export default class UserService extends BaseService {
  constructor() {
    super('users')
  }

  // 用户登录
  async login(credentials) {
    try {
      const response = await userApi.login(credentials)
      return response
    } catch (error) {
      this.handleError(error, '用户登录失败')
      throw error
    }
  }

  // 用户注册
  async register(userData) {
    try {
      const response = await userApi.register(userData)
      return response
    } catch (error) {
      this.handleError(error, '用户注册失败')
      throw error
    }
  }

  // 获取用户信息
  async getUserProfile() {
    try {
      const response = await userApi.getUserProfile()
      return response
    } catch (error) {
      this.handleError(error, '获取用户信息失败')
      throw error
    }
  }

  // 更新用户信息
  async updateUserProfile(userData) {
    try {
      const response = await userApi.updateUserProfile(userData)
      return response
    } catch (error) {
      this.handleError(error, '更新用户信息失败')
      throw error
    }
  }

  // 修改密码
  async changePassword(passwordData) {
    try {
      const response = await userApi.changePassword(passwordData)
      return response
    } catch (error) {
      this.handleError(error, '修改密码失败')
      throw error
    }
  }

  // 用户登出
  async logout() {
    try {
      const response = await userApi.logout()
      return response
    } catch (error) {
      this.handleError(error, '用户登出失败')
      throw error
    }
  }
}

// 创建单例实例
export const userService = new UserService()
