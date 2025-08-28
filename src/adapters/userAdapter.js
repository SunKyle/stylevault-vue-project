import userService from '../services/userService'
import { useToast } from '../utils/toast'

export class UserAdapter {
  constructor() {
    this.service = userService
    this.toast = useToast()
  }

  // 用户登录
  async login(credentials) {
    try {
      const response = await this.service.login(credentials)
      // 保存token到本地存储
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      this.toast.success('登录成功')
      return response
    } catch (error) {
      this.toast.error('登录失败，请检查用户名和密码')
      throw error
    }
  }

  // 用户注册
  async register(userData) {
    try {
      const response = await this.service.register(userData)
      this.toast.success('注册成功')
      return response
    } catch (error) {
      this.toast.error('注册失败，请稍后再试')
      throw error
    }
  }

  // 获取用户信息
  async fetchUserProfile() {
    try {
      const profile = await this.service.getUserProfile()
      return profile
    } catch (error) {
      this.toast.error('获取用户信息失败')
      throw error
    }
  }

  // 更新用户信息
  async updateUserProfile(userData) {
    try {
      const updatedProfile = await this.service.updateUserProfile(userData)
      this.toast.success('用户信息更新成功')
      return updatedProfile
    } catch (error) {
      this.toast.error('更新用户信息失败')
      throw error
    }
  }

  // 修改密码
  async changePassword(passwordData) {
    try {
      await this.service.changePassword(passwordData)
      this.toast.success('密码修改成功')
      return true
    } catch (error) {
      this.toast.error('密码修改失败')
      throw error
    }
  }

  // 用户登出
  async logout() {
    try {
      await this.service.logout()
      // 清除本地存储的token
      localStorage.removeItem('token')
      this.toast.success('已成功登出')
      return true
    } catch (error) {
      // 即使API调用失败，也清除本地token
      localStorage.removeItem('token')
      this.toast.success('已成功登出')
      return true
    }
  }

  // 检查用户是否已登录
  isLoggedIn() {
    return !!localStorage.getItem('token')
  }

  // 获取当前用户的token
  getToken() {
    return localStorage.getItem('token')
  }
}

// 创建单例实例
export const userAdapter = new UserAdapter()
