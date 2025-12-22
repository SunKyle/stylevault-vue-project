import { defineStore } from 'pinia';
import { clothingApi } from '../../services/apiClient';
import { showToast } from '../../utils/toast';

// ====================== 精简版工具函数 ======================
// 1. 缓存管理器（保留核心功能，简化非必要逻辑）
class CacheManager {
  constructor(namespace = 'default', cacheDuration = 5 * 60 * 1000) {
    this.cache = new Map();
    this.namespace = namespace;
    this.cacheDuration = cacheDuration;
    this.cleanupTimer = setInterval(() => this.cleanupExpired(), 30 * 60 * 1000);
  }

  getNamespacedKey(key) {
    return `${this.namespace}:${key}`;
  }

  isCacheValid(key) {
    const nsKey = this.getNamespacedKey(key);
    const cached = this.cache.get(nsKey);
    return cached && Date.now() - cached.timestamp < this.cacheDuration;
  }

  get(key) {
    return this.isCacheValid(key) ? this.cache.get(this.getNamespacedKey(key))?.data : null;
  }

  set(key, data) {
    this.cache.set(this.getNamespacedKey(key), { data, timestamp: Date.now() });
    return data;
  }

  delete(key) {
    return this.cache.delete(this.getNamespacedKey(key));
  }

  clear() {
    this.cache.clear();
  }

  cleanupExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.cacheDuration) this.cache.delete(key);
    }
  }

  destroy() {
    clearInterval(this.cleanupTimer);
    this.clear();
  }
}

// 2. 防抖函数（保留核心防抖，简化取消逻辑）
const createDebouncer = (func, delay) => {
  let timeoutId = null;
  return function (...args) {
    clearTimeout(timeoutId);
    return new Promise(resolve => {
      timeoutId = setTimeout(() => resolve(func.apply(this, args)), delay);
    });
  };
};

// 3. 统一错误处理（保留核心，简化非必要判断）
const handleApiError = (error, defaultMessage, store) => {
  let errorMessage = defaultMessage;
  
  if (!navigator.onLine) {
    errorMessage = '网络连接失败，请检查您的网络';
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.message) {
    errorMessage = error.message;
  }

  if (store) store.setError(errorMessage);
  showToast(errorMessage, 'error');
  
  const apiError = new Error(errorMessage);
  apiError.original = error;
  throw apiError;
};

// 4. 精简版通用工具（只保留必要功能）
const utils = {
  // 生成临时ID（保留核心）
  generateTempId(prefix = 'temp') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  },

  // 乐观更新（简化返回值，只保留回滚）
  optimisticUpdate(list, itemId, updates) {
    const index = list.findIndex(item => item.id === itemId);
    if (index === -1) return { rollback: () => {} };

    const original = { ...list[index] };
    list[index] = { ...original, ...updates };

    return { rollback: () => list[index] = original };
  },

  // 乐观添加（简化逻辑）
  optimisticAdd(list, item) {
    const tempId = this.generateTempId();
    const optimisticItem = { ...item, id: tempId, isOptimistic: true };
    list.unshift(optimisticItem);

    return {
      tempId,
      remove: () => {
        const index = list.findIndex(i => i.id === tempId);
        if (index !== -1) list.splice(index, 1);
      },
      replace: (newItem) => {
        const index = list.findIndex(i => i.id === tempId);
        if (index !== -1) list.splice(index, 1, newItem);
      }
    };
  }
};

// 5. 常量定义（保留核心）
const CACHE_KEYS = {
  CATEGORIES: 'categories',
  CLOTHING_ITEMS: 'clothingItems',
  FAVORITE_ITEMS: 'favoriteItems',
  ITEM_DETAIL: (id) => `item_${id}`,
  CATEGORY_ITEMS: (categoryId) => `items_category_${categoryId}`
};

const DEFAULT_DEBOUNCE_DELAY = 300;
const CACHE_DURATION = 5 * 60 * 1000;

// 创建缓存实例
const cacheManager = new CacheManager('clothing', CACHE_DURATION);

// ====================== 精简版 Store ======================
export const useClothingStore = defineStore('clothing', {
  state: () => ({
    categories: [],
    clothingItems: [],
    selectedCategory: null,
    loading: false,
    error: null,

    searchResults: [],
    isSearching: false,

    pagination: {
      currentPage: 1,
      itemsPerPage: 50,
      totalItems: 0,
      totalPages: 0,
      useServerPagination: false
    },

    _fetchClothingItemsPromise: null,
    _searchDebouncer: null
  }),

  getters: {
    // 获取选中的衣物（去掉冗余数组校验）
    selectedItems: state => {
      return state.selectedCategory 
        ? state.clothingItems.filter(item => item && item.category === state.selectedCategory)
        : state.clothingItems;
    },

    // 获取收藏的衣物（简化）
    favoriteItems: state => {
      return state.clothingItems.filter(item => item && item.isFavorite);
    },

    // 按类别分组衣物（简化）
    itemsByCategory: state => {
      const result = {};
      state.clothingItems.forEach(item => {
        if (item && item.category != null) {
          if (!result[item.category]) result[item.category] = [];
          result[item.category].push(item);
        }
      });
      return result;
    },

    // 最常穿的衣物（简化）
    mostWornItems: state => {
      return [...state.clothingItems]
        .sort((a, b) => (b?.wearCount || 0) - (a?.wearCount || 0))
        .slice(0, 5);
    },

    // 最近添加的衣物（简化）
    recentlyAddedItems: state => {
      return [...state.clothingItems]
        .sort((a, b) => new Date(b?.purchaseDate || 0) - new Date(a?.purchaseDate || 0))
        .slice(0, 5);
    },

    // 分页衣物（简化）
    paginatedItems: state => {
      if (state.pagination.useServerPagination) return state.clothingItems;
      
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
      const endIndex = startIndex + state.pagination.itemsPerPage;
      return state.clothingItems.slice(startIndex, endIndex);
    },

    // 总页数（简化）
    totalPages: state => {
      return state.pagination.useServerPagination 
        ? state.pagination.totalPages 
        : Math.ceil(state.clothingItems.length / state.pagination.itemsPerPage);
    },

    // 统计数据（简化）
    stats: state => {
      const totalValue = state.clothingItems.reduce((sum, item) => sum + (item?.price || 0), 0);
      return {
        total: state.clothingItems.length,
        categories: [...new Set(state.clothingItems.map(item => item?.category).filter(Boolean))].length,
        totalValue,
        averagePrice: state.clothingItems.length ? totalValue / state.clothingItems.length : 0,
        favoriteCount: state.clothingItems.filter(item => item?.isFavorite).length
      };
    }
  },

  actions: {
    // 基础状态操作（保留核心）
    setLoading(status) {
      this.loading = status;
    },

    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination };
      if (!this.pagination.useServerPagination) {
        this.pagination.totalPages = this.totalPages;
      }
    },

    setSelectedCategory(categoryId) {
      this.selectedCategory = categoryId;
    },

    clearSelectedCategory() {
      this.selectedCategory = null;
    },

    // 初始化防抖（简化）
    initDebouncers() {
      if (!this._searchDebouncer) {
        this._searchDebouncer = createDebouncer(this._handleSearch, DEFAULT_DEBOUNCE_DELAY);
      }
    },

    // 内部搜索逻辑（简化）
    async _handleSearch(keyword) {
      if (!keyword.trim()) {
        this.searchResults = [];
        this.isSearching = false;
        return [];
      }

      this.isSearching = true;
      try {
        const results = await clothingApi.search(keyword);
        this.searchResults = results || [];
        return this.searchResults;
      } catch (error) {
        handleApiError(error, '搜索衣物失败', this);
      } finally {
        this.isSearching = false;
      }
    },

    // 获取分类（去掉冗余数组校验）
    async fetchCategories(forceRefresh = false) {
      if (this.loading && !forceRefresh) return this.categories;

      if (!forceRefresh && cacheManager.get(CACHE_KEYS.CATEGORIES)) {
        this.categories = cacheManager.get(CACHE_KEYS.CATEGORIES);
        return this.categories;
      }

      this.setLoading(true);
      this.clearError();

      try {
        const response = await clothingApi.getCategories();
        const categoriesData = response.data || response || [];
        
        this.categories = categoriesData.map(category => ({
          id: category.id,
          name: category.name || category.display_name || '未命名类别',
          icon: category.icon || 'shirt',
          enabled: category.enabled ?? category.is_active ?? true,
          ...category
        }));

        cacheManager.set(CACHE_KEYS.CATEGORIES, this.categories);
        return this.categories;
      } catch (error) {
        handleApiError(error, '获取衣物类别失败', this);
        this.categories = [];
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 获取衣物列表（删除冗余pagination参数）
    async fetchClothingItems(forceRefresh = false) {
      if (this._fetchClothingItemsPromise && !forceRefresh) {
        return this._fetchClothingItemsPromise;
      }

      if (!forceRefresh && cacheManager.get(CACHE_KEYS.CLOTHING_ITEMS)) {
        this.clothingItems = cacheManager.get(CACHE_KEYS.CLOTHING_ITEMS);
        this.setPagination({ totalItems: this.clothingItems.length });
        return this.clothingItems;
      }

      this.setLoading(true);
      this.clearError();

      try {
        // 简化分页参数
        const fetchParams = this.pagination.useServerPagination 
          ? { page: this.pagination.currentPage, limit: this.pagination.itemsPerPage }
          : {};

        this._fetchClothingItemsPromise = clothingApi.getAll(fetchParams);
        const response = await this._fetchClothingItemsPromise;
        
        const items = response.items || response.data?.items || response.data || response || [];
        this.clothingItems = items;
        
        this.setPagination({
          totalItems: response.pagination?.totalItems || items.length,
          totalPages: response.pagination?.totalPages || Math.ceil(items.length / this.pagination.itemsPerPage)
        });

        cacheManager.set(CACHE_KEYS.CLOTHING_ITEMS, this.clothingItems);
        return this.clothingItems;
      } catch (error) {
        handleApiError(error, '获取衣物列表失败', this);
        this.clothingItems = [];
        throw error;
      } finally {
        this.setLoading(false);
        this._fetchClothingItemsPromise = null;
      }
    },

    // 搜索衣物（简化）
    async searchClothingItems(keyword) {
      this.initDebouncers();
      return this._searchDebouncer.call(this, keyword);
    },

    // 批量更新（删除pendingUpdates冗余逻辑）
    async batchUpdate(updates) {
      if (!updates || !updates.length) {
        showToast('没有需要更新的衣物', 'warning');
        return [];
      }

      const updatePromises = updates.map(async ({ id, data }) => {
        if (!id || !data) return null;

        try {
          const updatedItem = await clothingApi.update(id, data);
          const index = this.clothingItems.findIndex(item => item.id === id);
          if (index !== -1) this.clothingItems[index] = updatedItem;
          
          cacheManager.delete(CACHE_KEYS.ITEM_DETAIL(id));
          cacheManager.delete(CACHE_KEYS.CLOTHING_ITEMS);
          
          showToast('衣物更新成功', 'success');
          return updatedItem;
        } catch (error) {
          handleApiError(error, `更新衣物[${id}]失败`, this);
          throw error;
        }
      });

      return Promise.all(updatePromises);
    },

    // 添加衣物（简化乐观更新）
    async addClothingItem(item) {
      if (!item) {
        const error = new Error('衣物数据不能为空');
        handleApiError(error, '添加衣物失败', this);
        throw error;
      }

      const { tempId, remove, replace } = utils.optimisticAdd(this.clothingItems, item);
      this.setPagination({ totalItems: this.pagination.totalItems + 1 });

      try {
        const newItem = await clothingApi.create(item);
        replace(newItem);
        cacheManager.delete(CACHE_KEYS.CLOTHING_ITEMS);
        
        showToast('衣物添加成功', 'success');
        return newItem;
      } catch (error) {
        remove();
        this.setPagination({ totalItems: this.pagination.totalItems - 1 });
        handleApiError(error, '添加衣物失败', this);
        throw error;
      }
    },

    // 更新衣物（简化）
    async updateClothingItem(id, updates) {
      if (!id || !updates) {
        const error = new Error('更新数据不能为空');
        handleApiError(error, '更新衣物失败', this);
        throw error;
      }

      const { rollback } = utils.optimisticUpdate(this.clothingItems, id, updates);

      try {
        const updatedItem = await clothingApi.update(id, updates);
        const index = this.clothingItems.findIndex(item => item.id === id);
        if (index !== -1) this.clothingItems[index] = updatedItem;

        cacheManager.delete(CACHE_KEYS.ITEM_DETAIL(id));
        cacheManager.delete(CACHE_KEYS.CLOTHING_ITEMS);
        
        showToast('衣物更新成功', 'success');
        return updatedItem;
      } catch (error) {
        rollback();
        handleApiError(error, '更新衣物失败', this);
        throw error;
      }
    },

    // 删除衣物（简化）
    async deleteClothingItem(id) {
      const index = this.clothingItems.findIndex(item => item.id === id);
      if (index === -1) {
        const error = new Error('衣物不存在');
        handleApiError(error, '删除衣物失败', this);
        throw error;
      }

      const deletedItem = this.clothingItems[index];
      this.clothingItems.splice(index, 1);
      this.setPagination({ totalItems: this.pagination.totalItems - 1 });

      try {
        await clothingApi.delete(id);
        cacheManager.delete(CACHE_KEYS.ITEM_DETAIL(id));
        cacheManager.delete(CACHE_KEYS.CLOTHING_ITEMS);
        
        if (deletedItem?.category) {
          cacheManager.delete(CACHE_KEYS.CATEGORY_ITEMS(deletedItem.category));
        }
        
        showToast('衣物删除成功', 'success');
        return true;
      } catch (error) {
        this.clothingItems.splice(index, 0, deletedItem);
        this.setPagination({ totalItems: this.pagination.totalItems + 1 });
        handleApiError(error, '删除衣物失败', this);
        throw error;
      }
    },

    // 获取衣物详情（简化）
    async fetchClothingItemDetail(id) {
      if (!id) {
        const error = new Error('衣物ID不能为空');
        handleApiError(error, '获取衣物详情失败', this);
        throw error;
      }

      const cacheKey = CACHE_KEYS.ITEM_DETAIL(id);
      if (cacheManager.get(cacheKey)) {
        return cacheManager.get(cacheKey);
      }

      this.setLoading(true);
      this.clearError();

      try {
        const item = await clothingApi.getById(id);
        cacheManager.set(cacheKey, item);
        return item;
      } catch (error) {
        handleApiError(error, '获取衣物详情失败', this);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 预加载数据（删除lastFetchTime冗余逻辑）
    async preloadData() {
      const isItemsExpired = !cacheManager.get(CACHE_KEYS.CLOTHING_ITEMS);
      const isCatesExpired = !cacheManager.get(CACHE_KEYS.CATEGORIES);
      
      if (isItemsExpired || isCatesExpired) {
        await Promise.all([this.fetchCategories(), this.fetchClothingItems()]);
      }
    },

    // 获取分类衣物（简化）
    async fetchClothingItemsByCategory(categoryId, forceRefresh = false) {
      if (!categoryId) {
        const error = new Error('分类ID不能为空');
        handleApiError(error, '获取分类衣物失败', this);
        throw error;
      }

      const cacheKey = CACHE_KEYS.CATEGORY_ITEMS(categoryId);
      if (!forceRefresh && cacheManager.get(cacheKey)) {
        return cacheManager.get(cacheKey);
      }

      this.setLoading(true);
      this.clearError();

      try {
        const items = await clothingApi.getByCategory(categoryId);
        this.itemsByCategory[categoryId] = items || [];
        cacheManager.set(cacheKey, this.itemsByCategory[categoryId]);
        
        return this.itemsByCategory[categoryId];
      } catch (error) {
        handleApiError(error, '获取分类衣物失败', this);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 获取收藏衣物（简化）
    async fetchFavoriteItems(forceRefresh = false) {
      const cacheKey = CACHE_KEYS.FAVORITE_ITEMS;
      if (!forceRefresh && cacheManager.get(cacheKey)) {
        return cacheManager.get(cacheKey);
      }

      this.setLoading(true);
      this.clearError();

      try {
        const items = await clothingApi.getFavorites();
        cacheManager.set(cacheKey, items || []);
        return cacheManager.get(cacheKey);
      } catch (error) {
        handleApiError(error, '获取收藏衣物失败', this);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 清理缓存（简化）
    clearCache() {
      cacheManager.clear();
      showToast('缓存已清理', 'success');
    },

    // 切换收藏（优化：避免重复更新）
    async toggleFavorite(id) {
      const targetItem = this.clothingItems.find(item => item.id === id);
      if (!targetItem) return;

      // 乐观更新，只更新favorite字段
      const { rollback } = utils.optimisticUpdate(
        this.clothingItems, 
        id, 
        { isFavorite: !targetItem.isFavorite }
      );

      try {
        const updatedItem = await clothingApi.toggleFavorite(id);
        
        // API调用成功后，我们不需要再次更新数组，因为乐观更新已经是正确的
        // 只需要更新缓存和显示提示即可
        cacheManager.delete(CACHE_KEYS.ITEM_DETAIL(id));
        cacheManager.delete(CACHE_KEYS.CLOTHING_ITEMS);
        cacheManager.delete(CACHE_KEYS.FAVORITE_ITEMS);
        
        showToast(updatedItem.isFavorite ? '收藏成功' : '已取消收藏', 'success');
        return updatedItem;
      } catch (error) {
        rollback();
        handleApiError(error, '更新收藏状态失败', this);
        throw error;
      }
    },

    // 初始化Store（简化）
    async initializeClothingStore() {
      try {
        this.initDebouncers();
        await this.preloadData();
        console.log('衣物商店初始化完成');
      } catch (error) {
        console.error('衣物商店初始化失败:', error);
        this.setError('初始化失败');
      }
    },

    // 销毁Store（删除冗余防抖取消）
    destroy() {
      cacheManager.destroy();
      this.$reset();
    }
  }
});