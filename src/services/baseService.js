import apiClient from './api'

export default class BaseService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath
  }

  // 通用获取所有资源
  async getAll(params = {}) {
    try {
      const response = await apiClient.get(`/${this.resourcePath}`, { params })
      return response.data
    } catch (error) {
      this.handleError(error, '获取数据失败')
      throw error
    }
  }

  // 通用获取单个资源
  async getById(id) {
    try {
      const response = await apiClient.get(`/${this.resourcePath}/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error, '获取详情失败')
      throw error
    }
  }

  // 通用创建资源
  async create(data) {
    try {
      const response = await apiClient.post(`/${this.resourcePath}`, data)
      return response.data
    } catch (error) {
      this.handleError(error, '创建失败')
      throw error
    }
  }

  // 通用更新资源
  async update(id, data) {
    try {
      const response = await apiClient.put(`/${this.resourcePath}/${id}`, data)
      return response.data
    } catch (error) {
      this.handleError(error, '更新失败')
      throw error
    }
  }

  // 通用删除资源
  async delete(id) {
    try {
      await apiClient.delete(`/${this.resourcePath}/${id}`)
      return true
    } catch (error) {
      this.handleError(error, '删除失败')
      throw error
    }
  }

  // 通用错误处理
  handleError(error, defaultMessage) {
    console.error(defaultMessage, error)
    // 可以在这里添加统一的错误提示逻辑
  }
}
