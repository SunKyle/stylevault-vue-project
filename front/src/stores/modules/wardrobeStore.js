import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import { showToast } from '../utils/toast';

export const useWardrobeStore = defineStore('wardrobe', {
  state: () => ({
    // 衣物数据
    clothingItems: [],
    categories: [],
    selectedItems: [],

    // 搭配数据
    outfits: [],
    favoriteOutfits: [],

    // 状态管理
    loading: false,
    error: null,
    lastUpdated: null,

    // 筛选条件
    filters: {
      category: null,
      season: null,
      color: null,
      favorite: false,
      searchQuery: '',
    },

    // 分页
    pagination: {
      currentPage: 1,
      itemsPerPage: 20,
      totalItems: 0,
    },
  }),

  getters: {
    // 基础数据获取
    totalItems: state => state.clothingItems.length,
    totalOutfits: state => state.outfits.length,

    // 筛选后的衣物
    filteredClothingItems: state => {
      let items = [...state.clothingItems];

      if (state.filters.category) {
        items = items.filter(item => item.category === state.filters.category);
      }

      if (state.filters.season) {
        items = items.filter(item => item.season === state.filters.season);
      }

      if (state.filters.color) {
        items = items.filter(item => item.color === state.filters.color);
      }

      if (state.filters.favorite) {
        items = items.filter(item => item.favorite);
      }

      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        items = items.filter(
          item =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.brand.toLowerCase().includes(query)
        );
      }

      return items;
    },

    // 按类别分组
    itemsByCategory: state => {
      const grouped = {};
      state.categories.forEach(category => {
        grouped[category.id] = state.clothingItems.filter(item => item.categoryId === category.id);
      });
      return grouped;
    },

    // 获取统计数据
    stats: state => ({
      totalValue: state.clothingItems.reduce((sum, item) => sum + (item.price || 0), 0),
      averagePrice: state.clothingItems.length
        ? state.clothingItems.reduce((sum, item) => sum + (item.price || 0), 0) /
          state.clothingItems.length
        : 0,
      mostExpensiveItem: state.clothingItems.reduce(
        (max, item) => ((item.price || 0) > (max?.price || 0) ? item : max),
        null
      ),
      newestItem: [...state.clothingItems].sort(
        (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
      )[0],
    }),

    // 分页数据
    paginatedItems: state => {
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
      const endIndex = startIndex + state.pagination.itemsPerPage;
      return state.filteredClothingItems.slice(startIndex, endIndex);
    },

    totalPages: state =>
      Math.ceil(state.filteredClothingItems.length / state.pagination.itemsPerPage),
  },

  actions: {
    // 设置加载状态
    setLoading(loading) {
      this.loading = loading;
    },

    // 设置错误信息
    setError(error) {
      this.error = error;
    },

    // 清除错误
    clearError() {
      this.error = null;
    },

    // 更新筛选条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      this.pagination.currentPage = 1; // 重置到第一页
    },

    // 清除筛选
    clearFilters() {
      this.filters = {
        category: null,
        season: null,
        color: null,
        favorite: false,
        searchQuery: '',
      };
    },

    // 设置分页
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination };
    },

    // 获取所有衣物数据
    async fetchClothingItems() {
      this.setLoading(true);
      this.clearError();

      try {
        const items = await apiClient.clothingApi.getItems();
        this.clothingItems = items;
        this.pagination.totalItems = items.length;
        this.lastUpdated = new Date();
        return items;
      } catch (error) {
        this.setError('获取衣物数据失败');
        showToast('获取衣物数据失败', 'error');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 获取衣物类别
    async fetchCategories() {
      try {
        const categories = await apiClient.clothingApi.getCategories();
        this.categories = categories;
        return categories;
      } catch (error) {
        this.setError('获取类别数据失败');
        showToast('获取类别数据失败', 'error');
        throw error;
      }
    },

    // 获取所有搭配
    async fetchOutfits() {
      this.setLoading(true);
      this.clearError();

      try {
        const outfits = await apiClient.outfitApi.getOutfits();
        this.outfits = outfits;
        this.favoriteOutfits = outfits.filter(outfit => outfit.liked);
        return outfits;
      } catch (error) {
        this.setError('获取搭配数据失败');
        showToast('获取搭配数据失败', 'error');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 添加新衣物
    async addClothingItem(item) {
      try {
        const newItem = await apiClient.clothingApi.addItem(item);
        this.clothingItems.unshift(newItem);
        this.pagination.totalItems += 1;
        showToast('衣物添加成功', 'success');
        return newItem;
      } catch (error) {
        this.setError('添加衣物失败');
        showToast('添加衣物失败', 'error');
        throw error;
      }
    },

    // 更新衣物信息
    async updateClothingItem(id, updates) {
      try {
        const updatedItem = await apiClient.clothingApi.updateItem(id, updates);
        const index = this.clothingItems.findIndex(item => item.id === id);
        if (index !== -1) {
          this.clothingItems[index] = updatedItem;
        }
        showToast('衣物信息更新成功', 'success');
        return updatedItem;
      } catch (error) {
        this.setError('更新衣物失败');
        showToast('更新衣物失败', 'error');
        throw error;
      }
    },

    // 删除衣物
    async deleteClothingItem(id) {
      try {
        await apiClient.clothingApi.deleteItem(id);
        this.clothingItems = this.clothingItems.filter(item => item.id !== id);
        this.pagination.totalItems -= 1;

        // 同时删除相关的搭配
        this.outfits = this.outfits.filter(
          outfit => !outfit.clothingItems.some(item => item.id === id)
        );
        showToast('衣物删除成功', 'success');
      } catch (error) {
        this.setError('删除衣物失败');
        showToast('删除衣物失败', 'error');
        throw error;
      }
    },

    // 切换收藏状态
    async toggleFavorite(id) {
      try {
        const item = this.clothingItems.find(item => item.id === id);
        if (item) {
          const updatedItem = await apiClient.clothingApi.toggleFavorite(id);
          const index = this.clothingItems.findIndex(item => item.id === id);
          if (index !== -1) {
            this.clothingItems[index] = updatedItem;
          }
          showToast(`衣物${updatedItem.favorite ? '已收藏' : '已取消收藏'}`, 'success');
          return updatedItem;
        }
      } catch (error) {
        this.setError('切换收藏状态失败');
        showToast('切换收藏状态失败', 'error');
        throw error;
      }
    },

    // 批量操作
    async batchUpdate(items) {
      try {
        const updatedItems = await apiClient.clothingApi.batchUpdate(items);

        updatedItems.forEach(updatedItem => {
          const index = this.clothingItems.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            this.clothingItems[index] = updatedItem;
          }
        });

        showToast('批量更新成功', 'success');
        return updatedItems;
      } catch (error) {
        this.setError('批量更新失败');
        showToast('批量更新失败', 'error');
        throw error;
      }
    },

    // 初始化所有数据
    async initializeWardrobe() {
      this.setLoading(true);
      try {
        await Promise.all([this.fetchCategories(), this.fetchClothingItems(), this.fetchOutfits()]);
        this.lastUpdated = new Date();
      } catch (error) {
        this.setError('初始化衣橱数据失败');
        showToast('初始化衣橱数据失败', 'error');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 刷新数据
    async refreshData() {
      return this.initializeWardrobe();
    },

    // 搜索衣物
    async searchClothingItems(query) {
      this.setFilters({ searchQuery: query });
      if (query.trim()) {
        try {
          const results = await apiClient.clothingApi.searchItems(query);
          this.clothingItems = results;
          this.pagination.totalItems = results.length;
        } catch (error) {
          this.setError('搜索失败');
          showToast('搜索失败', 'error');
          throw error;
        }
      } else {
        await this.fetchClothingItems();
      }
    },
  },
});
