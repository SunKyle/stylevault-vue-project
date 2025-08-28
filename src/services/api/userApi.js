import { userAdaptorApi } from './adapter'

// 用户API
export default {
  // 用户登录
  login: async (credentials) => {
    try {
      return await userAdaptorApi.login(credentials)
    } catch (error) {
      console.error('用户登录失败:', error)
      throw error
    }
  },

  // 用户注册
  register: async (userData) => {
    try {
      return await userAdaptorApi.register(userData)
    } catch (error) {
      console.error('用户注册失败:', error)
      throw error
    }
  },

  // 获取用户信息
  getUserProfile: async (userId) => {
    try {
      return await userAdaptorApi.getUserProfile(userId)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  },

  // 更新用户信息
  updateUserProfile: async (userId, updates) => {
    try {
      return await userAdaptorApi.updateUserProfile(userId, updates)
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  },

  // 修改密码
  changePassword: async (userId, passwordData) => {
    try {
      // 在实际应用中，这里应该调用适配器中的方法
      // 由于我们的mock中没有实现这个方法，这里先模拟实现
      console.log('修改密码', userId, passwordData)
      return { success: true, message: '密码修改成功' }
    } catch (error) {
      console.error('修改密码失败:', error)
      throw error
    }
  },

  // 用户登出
  logout: async () => {
    try {
      // 在实际应用中，这里应该调用适配器中的方法
      // 由于我们的mock中没有实现这个方法，这里先模拟实现
      console.log('用户登出')
      // 清除本地存储的token
      localStorage.removeItem('token')
      return { success: true, message: '登出成功' }
    } catch (error) {
      console.error('用户登出失败:', error)
      throw error
    }
  }
}
