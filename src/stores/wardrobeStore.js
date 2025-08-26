import { defineStore } from 'pinia'
import wardrobeService from '../services/wardrobeService'

export const useWardrobeStore = defineStore('wardrobe', {
  state: () => ({
    categories: [],
    clothingItems: [],
    selectedCategory: null,
    loading: false,
    error: null
  }),

  getters: {
    // 获取选中的衣物
    selectedItems: (state) => {
      if (state.selectedCategory) {
        return state.clothingItems.filter(item => item.categoryId === state.selectedCategory)
      }
      return state.clothingItems
    },

    // 获取收藏的衣物
    favoriteItems: (state) => {
      return state.clothingItems.filter(item => item.favorite)
    },

    // 按类别分组衣物
    itemsByCategory: (state) => {
      const result = {}
      state.categories.forEach(category => {
        result[category.id] = state.clothingItems.filter(item => item.categoryId === category.id)
      })
      return result
    },

    // 获取最常穿的衣物
    mostWornItems: (state) => {
      return [...state.clothingItems]
        .sort((a, b) => b.wearCount - a.wearCount)
        .slice(0, 5)
    },

    // 获取最近添加的衣物
    recentlyAddedItems: (state) => {
      return [...state.clothingItems]
        .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
        .slice(0, 5)
    }
  },

  actions: {
    // 设置加载状态
    setLoading(status) {
      this.loading = status
    },

    // 设置错误信息
    setError(error) {
      this.error = error
    },

    // 清除错误信息
    clearError() {
      this.error = null
    },

    // 获取所有衣物类别
    async fetchCategories() {
      this.setLoading(true)
      this.clearError()

      try {
        const categories = await wardrobeService.getCategories()
        this.categories = categories
        return categories
      } catch (error) {
        this.setError('获取衣物类别失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 获取所有衣物
    async fetchClothingItems() {
      this.setLoading(true)
      this.clearError()

      try {
        const items = await wardrobeService.getClothingItems()
        this.clothingItems = items
        return items
      } catch (error) {
        this.setError('获取衣物列表失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 根据类别获取衣物
    async fetchClothingItemsByCategory(categoryId) {
      this.setLoading(true)
      this.clearError()

      try {
        const items = await wardrobeService.getClothingItemsByCategory(categoryId)
        return items
      } catch (error) {
        this.setError('获取类别衣物失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 获取衣物详情
    async fetchClothingItemDetail(id) {
      this.setLoading(true)
      this.clearError()

      try {
        const item = await wardrobeService.getClothingItemDetail(id)
        return item
      } catch (error) {
        this.setError('获取衣物详情失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 添加衣物
    async addClothingItem(item) {
      this.setLoading(true)
      this.clearError()

      try {
        const newItem = await wardrobeService.addClothingItem(item)
        this.clothingItems.push(newItem)
        // 添加新衣物后刷新数据，确保能立即查询到新添加的衣物
        await this.fetchClothingItems()
        return newItem
      } catch (error) {
        this.setError('添加衣物失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 更新衣物信息
    async updateClothingItem(id, updates) {
      this.setLoading(true)
      this.clearError()

      try {
        const updatedItem = await wardrobeService.updateClothingItem(id, updates)
        const index = this.clothingItems.findIndex(item => item.id === id)
        if (index !== -1) {
          this.clothingItems[index] = updatedItem
        }
        return updatedItem
      } catch (error) {
        this.setError('更新衣物失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 删除衣物
    async deleteClothingItem(id) {
      this.setLoading(true)
      this.clearError()

      try {
        await wardrobeService.deleteClothingItem(id)
        this.clothingItems = this.clothingItems.filter(item => item.id !== id)
        return true
      } catch (error) {
        this.setError('删除衣物失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 搜索衣物
    async searchClothingItems(keyword) {
      this.setLoading(true)
      this.clearError()

      try {
        const results = await wardrobeService.searchClothingItems(keyword)
        return results
      } catch (error) {
        this.setError('搜索衣物失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 设置选中的类别
    setSelectedCategory(categoryId) {
      console.log("wardrobeStore: 设置选中分类，ID:", categoryId);
      this.selectedCategory = categoryId;
      console.log("wardrobeStore: 设置后selectedCategory值:", this.selectedCategory);
    },

    // 清除选中的类别
    clearSelectedCategory() {
      console.log("wardrobeStore: 清除选中分类");
      this.selectedCategory = null;
      console.log("wardrobeStore: 清除后selectedCategory值:", this.selectedCategory);
    },

    // 初始化数据
    async initializeData() {
      this.setLoading(true)
      this.clearError()
      
      try {
        // 分别获取数据，避免一个失败导致全部失败
        const categoriesResult = await this.fetchCategories().catch(error => {
          console.error('获取衣物类别失败:', error)
          return null
        })
        
        const itemsResult = await this.fetchClothingItems().catch(error => {
          console.error('获取衣物列表失败:', error)
          return null
        })
        
        // 如果两个请求都失败了，抛出错误
        if (!categoriesResult && !itemsResult) {
          this.setError('初始化衣橱数据失败，请检查网络连接')
          throw new Error('初始化衣橱数据失败')
        }
        
        // 如果只有一个失败了，显示警告但继续
        if (!categoriesResult) {
          this.setError('获取衣物类别失败，但衣物列表已加载')
        } else if (!itemsResult) {
          this.setError('获取衣物列表失败，但衣物类别已加载')
        }
      } catch (error) {
        console.error('初始化衣橱数据失败:', error)
        this.setError('初始化衣橱数据失败，请重试')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    // 切换收藏状态
    async toggleFavorite(id) {
      this.setLoading(true)
      this.clearError()

      try {
        const itemIndex = this.clothingItems.findIndex(item => item.id === id)
        if (itemIndex !== -1) {
          // 获取当前收藏状态
          const currentFavoriteStatus = this.clothingItems[itemIndex].favorite
          const newFavoriteStatus = !currentFavoriteStatus
          
          // 调用API更新收藏状态
          const result = await wardrobeService.updateClothingItem(id, { favorite: newFavoriteStatus })
          
          // 创建一个新的对象，确保Vue能够检测到变化
          const updatedItem = {
            ...this.clothingItems[itemIndex],
            favorite: newFavoriteStatus
          }
          
          // 使用splice替换数组中的元素，确保Vue能够检测到变化
          this.clothingItems.splice(itemIndex, 1, updatedItem)
          
          return result
        }
        throw new Error('衣物不存在')
      } catch (error) {
        this.setError('切换收藏状态失败')
        throw error
      } finally {
        this.setLoading(false)
      }
    }
  }
})
