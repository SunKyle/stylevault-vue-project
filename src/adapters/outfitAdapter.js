import outfitService from '../services/outfitService'
import { useToast } from '../utils/toast'

export class OutfitAdapter {
  constructor() {
    this.service = outfitService
    this.toast = useToast()
  }

  // 获取所有搭配
  async fetchOutfits() {
    try {
      const outfits = await this.service.getOutfits()
      return outfits
    } catch (error) {
      this.toast.error('获取搭配列表失败')
      throw error
    }
  }

  // 根据标签获取搭配
  async fetchOutfitsByTag(tag) {
    try {
      const outfits = await this.service.getOutfitsByTag(tag)
      return outfits
    } catch (error) {
      this.toast.error('获取标签搭配失败')
      throw error
    }
  }

  // 获取搭配详情
  async fetchOutfitDetail(id) {
    try {
      const outfit = await this.service.getOutfitDetail(id)
      return outfit
    } catch (error) {
      this.toast.error('获取搭配详情失败')
      throw error
    }
  }

  // 添加新搭配
  async addOutfit(outfit) {
    try {
      const newOutfit = await this.service.addOutfit(outfit)
      this.toast.success('搭配添加成功')
      return newOutfit
    } catch (error) {
      this.toast.error('添加搭配失败')
      throw error
    }
  }

  // 更新搭配
  async updateOutfit(id, updates) {
    try {
      const updatedOutfit = await this.service.updateOutfit(id, updates)
      this.toast.success('搭配更新成功')
      return updatedOutfit
    } catch (error) {
      this.toast.error('更新搭配失败')
      throw error
    }
  }

  // 删除搭配
  async deleteOutfit(id) {
    try {
      await this.service.deleteOutfit(id)
      this.toast.success('搭配删除成功')
      return true
    } catch (error) {
      this.toast.error('删除搭配失败')
      throw error
    }
  }

  // 切换搭配的喜欢状态
  async toggleLike(id) {
    try {
      const result = await this.service.toggleLike(id)
      this.toast.success(result.liked ? '已添加到喜欢' : '已取消喜欢')
      return result
    } catch (error) {
      this.toast.error('切换喜欢状态失败')
      throw error
    }
  }
}

// 创建单例实例
export const outfitAdapter = new OutfitAdapter()
