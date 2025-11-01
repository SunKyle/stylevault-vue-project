import { defineStore } from 'pinia';
import { clothingAdapter } from '../../adapters/clothingAdapter';

// 缓存工具
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

const isCacheValid = key => {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_DURATION;
};

const getCachedData = key => {
  const cached = cache.get(key);
  return cached && isCacheValid(key) ? cached.data : null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// 防抖工具
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    return new Promise(resolve => {
      timeoutId = setTimeout(() => resolve(func.apply(this, args)), delay);
    });
  };
};

export const useClothingStore = defineStore('clothing', {
  state: () => ({
    categories: [],
    clothingItems: [],
    selectedCategory: null,
    loading: false,
    error: null,

    // 性能优化相关
    searchResults: [],
    isSearching: false,
    lastFetchTime: null,

    // 批量操作队列
    pendingUpdates: new Map(),

    // 分页相关
    pagination: {
      currentPage: 1,
      itemsPerPage: 50,
      totalItems: 0,
    },
    
    // 请求锁（用于防止并发请求）
    _fetchClothingItemsPromise: null,
  }),

  getters: {
    // 获取选中的衣物
    selectedItems: state => {
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      if (state.selectedCategory) {
        // 根据数据库设计，使用category字段而不是categoryId
        return items.filter(item => item && item.category === state.selectedCategory);
      }
      return items;
    },

    // 获取收藏的衣物
    favoriteItems: state => {
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      return items.filter(item => item && item.favorite);
    },

    // 按类别分组衣物
    itemsByCategory: state => {
      const result = {};
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      
      // 直接从items中按category字段分组（根据数据库设计，clothing表使用category字段关联attributes表）
      items.forEach(item => {
        if (item && item.category != null) {
          if (!result[item.category]) {
            result[item.category] = [];
          }
          result[item.category].push(item);
        }
      });
      
      return result;
    },

    // 获取最常穿的衣物
    mostWornItems: state => {
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      return [...items].sort((a, b) => (b?.wearCount || 0) - (a?.wearCount || 0)).slice(0, 5);
    },

    // 获取最近添加的衣物
    recentlyAddedItems: state => {
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      return [...items]
        .sort((a, b) => new Date(b?.purchaseDate || 0) - new Date(a?.purchaseDate || 0))
        .slice(0, 5);
    },

    // 新增性能相关 getters
    paginatedItems: state => {
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
      const endIndex = startIndex + state.pagination.itemsPerPage;
      return items.slice(startIndex, endIndex);
    },

    totalPages: state => {
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      return Math.ceil(items.length / state.pagination.itemsPerPage);
    },

    // 获取统计数据
    stats: state => {
      const items = Array.isArray(state.clothingItems) ? state.clothingItems : [];
      return {
        total: items.length,
        categories: [...new Set(items.map(item => item?.category).filter(Boolean))].length,
        totalValue: items.reduce((sum, item) => sum + (item?.price || 0), 0),
        averagePrice: items.length
          ? items.reduce((sum, item) => sum + (item?.price || 0), 0) / items.length
          : 0,
      };
    },
  },

  actions: {
    // 设置加载状态
    setLoading(status) {
      this.loading = status;
    },

    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    // 设置分页
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination };
    },

    // 设置选中的分类
    setSelectedCategory(categoryId) {
      this.selectedCategory = categoryId;
    },

    // 清除选中的分类
    clearSelectedCategory() {
      this.selectedCategory = null;
    },

    // 智能获取数据（带缓存）
    async fetchCategories(forceRefresh = false) {
      const cacheKey = 'categories';

      // 防止重复请求
      if (this.loading && !forceRefresh) return this.categories;

      // 检查缓存
      if (!forceRefresh && getCachedData(cacheKey)) {
        this.categories = getCachedData(cacheKey);
        return this.categories;
      }

      this.setLoading(true);
      this.clearError();

      try {
        const response = await clothingAdapter.fetchCategories();
        // 确保获取到的数据是数组格式
        let categoriesData = [];
        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        } else if (response && response.length === undefined) {
          // 如果是单个对象，放入数组中
          categoriesData = [response];
        }
        
        // 转换为前端需要的分类格式，确保包含必要字段
        this.categories = categoriesData.map(category => ({
          id: category.id,
          name: category.name || category.display_name || '未命名类别',
          icon: category.icon || 'shirt',
          enabled: category.enabled !== undefined ? category.enabled : 
                  (category.is_active !== undefined ? category.is_active : true),
          // 保留原始分类数据
          ...category
        }));
        
        setCachedData(cacheKey, this.categories);
        return this.categories;
      } catch (error) {
        this.setError('获取衣物类别失败');
        this.categories = [];
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchClothingItems(forceRefresh = false) {
      const cacheKey = 'clothingItems';

      // 关键优化：如果已有请求正在进行，返回同一个Promise
      if (this._fetchClothingItemsPromise && !forceRefresh) {
        return this._fetchClothingItemsPromise;
      }

      // 检查缓存
      if (!forceRefresh && getCachedData(cacheKey)) {
        this.clothingItems = getCachedData(cacheKey);
        this.pagination.totalItems = this.clothingItems.length;
        return this.clothingItems;
      }

      this.setLoading(true);
      this.clearError();

      try {
        // 保存Promise引用用于并发控制
        this._fetchClothingItemsPromise = clothingAdapter.fetchClothingItems();
        const response = await this._fetchClothingItemsPromise;
        const items = response.items || response.data?.items || response.data || [];
        this.clothingItems = Array.isArray(items) ? items : [];
        this.pagination.totalItems = response.pagination?.totalItems || this.clothingItems.length;
        this.lastFetchTime = new Date();
        setCachedData(cacheKey, this.clothingItems);
        return this.clothingItems;
      } catch (error) {
        this.setError('获取衣物列表失败');
        this.clothingItems = [];
        throw error;
      } finally {
        this.setLoading(false);
        // 清除请求锁，允许后续请求
        this._fetchClothingItemsPromise = null;
      }
    },

    // 防抖搜索
    debouncedSearch: debounce(async function (keyword) {
      if (!keyword.trim()) {
        this.searchResults = [];
        this.isSearching = false;
        return;
      }

      this.isSearching = true;
      try {
        const results = await clothingAdapter.searchClothingItems(keyword);
        this.searchResults = results;
        return results;
      } catch (error) {
        this.setError('搜索衣物失败');
        throw error;
      } finally {
        this.isSearching = false;
      }
    }, 300),

    // 优化后的搜索
    async searchClothingItems(keyword) {
      return this.debouncedSearch(keyword);
    },

    // 批量更新优化
    async batchUpdate(updates) {
      const updatePromises = updates.map(async ({ id, data }) => {
        if (this.pendingUpdates.has(id)) {
          // 合并更新
          const pending = this.pendingUpdates.get(id);
          this.pendingUpdates.set(id, { ...pending, ...data });
          return;
        }

        this.pendingUpdates.set(id, data);

        try {
          const updatedItem = await clothingAdapter.updateClothingItem(id, data);
          const index = this.clothingItems.findIndex(item => item.id === id);
          if (index !== -1) {
            this.clothingItems[index] = updatedItem;
          }
          this.pendingUpdates.delete(id);
          return updatedItem;
        } catch (error) {
          this.pendingUpdates.delete(id);
          throw error;
        }
      });

      return Promise.all(updatePromises);
    },

    // 快速添加（乐观更新）
    async addClothingItem(item) {
      // 现在数据库attributes表中已存在condition相关的记录，不需要再设置为null
      
      // 乐观更新：先添加到本地
      const tempId = `temp_${Date.now()}`;
      const optimisticItem = { ...item, id: tempId, isOptimistic: true };

      this.clothingItems.unshift(optimisticItem);
      this.pagination.totalItems += 1;

      try {
        const newItem = await clothingAdapter.addClothingItem(item);

        // 替换临时项
        const index = this.clothingItems.findIndex(item => item.id === tempId);
        if (index !== -1) {
          this.clothingItems.splice(index, 1, newItem);
        }

        // 更新缓存
        setCachedData('clothingItems', this.clothingItems);

        return newItem;
      } catch (error) {
        // 回滚：移除临时项
        this.clothingItems = this.clothingItems.filter(item => item.id !== tempId);
        this.pagination.totalItems -= 1;

        this.setError('添加衣物失败');
        throw error;
      }
    },

    // 优化后的更新
    async updateClothingItem(id, updates) {
      // 立即更新本地状态（乐观更新）
      const index = this.clothingItems.findIndex(item => item.id === id);
      if (index !== -1) {
        const originalItem = { ...this.clothingItems[index] };
        this.clothingItems[index] = { ...originalItem, ...updates };

        try {
          const updatedItem = await clothingAdapter.updateClothingItem(id, updates);
          this.clothingItems[index] = updatedItem;

          // 更新缓存
          setCachedData('clothingItems', this.clothingItems);

          return updatedItem;
        } catch (error) {
          // 回滚
          this.clothingItems[index] = originalItem;
          this.setError('更新衣物失败');
          throw error;
        }
      }
    },

    // 优化后的删除
    async deleteClothingItem(id) {
      const index = this.clothingItems.findIndex(item => item.id === id);
      if (index === -1) return;

      // 保存被删除的项目用于回滚
      const deletedItem = this.clothingItems[index];
      this.clothingItems.splice(index, 1);
      this.pagination.totalItems -= 1;

      try {
        await clothingAdapter.deleteClothingItem(id);

        // 更新缓存
        setCachedData('clothingItems', this.clothingItems);

        return true;
      } catch (error) {
        // 回滚
        this.clothingItems.splice(index, 0, deletedItem);
        this.pagination.totalItems += 1;

        this.setError('删除衣物失败');
        throw error;
      }
    },

    // 获取衣物详情（带缓存）
    async fetchClothingItemDetail(id) {
      const cacheKey = `item_${id}`;

      if (getCachedData(cacheKey)) {
        return getCachedData(cacheKey);
      }

      this.setLoading(true);
      this.clearError();

      try {
        const item = await clothingAdapter.fetchClothingItemDetail(id);
        setCachedData(cacheKey, item);
        return item;
      } catch (error) {
        this.setError('获取衣物详情失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 预加载数据
    async preloadData() {
      if (!this.lastFetchTime || Date.now() - this.lastFetchTime.getTime() > CACHE_DURATION) {
        await Promise.all([this.fetchCategories(), this.fetchClothingItems()]);
      }
    },

    // 获取特定分类的衣物
    async fetchClothingItemsByCategory(categoryId) {
      const cacheKey = `items_category_${categoryId}`;

      if (getCachedData(cacheKey)) {
        this.itemsByCategory[categoryId] = getCachedData(cacheKey);
        return getCachedData(cacheKey);
      }

      this.setLoading(true);
      this.clearError();

      try {
        const items = await clothingAdapter.fetchClothingItemsByCategory(categoryId);
        this.itemsByCategory[categoryId] = items;
        setCachedData(cacheKey, items);
        return items;
      } catch (error) {
        this.setError('获取分类衣物失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 获取收藏衣物
    async fetchFavoriteItems() {
      const cacheKey = 'favorite_items';

      if (getCachedData(cacheKey)) {
        return getCachedData(cacheKey);
      }

      this.setLoading(true);
      this.clearError();

      try {
        const items = await clothingAdapter.fetchFavoriteItems();
        setCachedData(cacheKey, items);
        return items;
      } catch (error) {
        this.setError('获取收藏衣物失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 清理缓存
    clearCache() {
      cache.clear();
      this.lastFetchTime = null;
    },

    // 切换收藏状态
    async toggleFavorite(id) {
      const index = this.clothingItems.findIndex(item => item.id === id);
      if (index === -1) return;

      const currentItem = this.clothingItems[index];
      const originalFavorite = currentItem.favorite;

      // 乐观更新
      this.clothingItems[index] = {
        ...currentItem,
        favorite: !currentItem.favorite,
      };

      try {
        const updatedItem = await clothingAdapter.updateClothingItem(id, {
          favorite: !currentItem.favorite,
        });

        this.clothingItems[index] = updatedItem;
        setCachedData('clothingItems', this.clothingItems);
        return updatedItem;
      } catch (error) {
        // 回滚
        this.clothingItems[index] = {
          ...currentItem,
          favorite: originalFavorite,
        };
        this.setError('更新收藏状态失败');
        throw error;
      }
    },

    // 初始化所有数据
    async initializeClothingStore() {
      try {
        await this.preloadData();
        console.log('衣物商店初始化完成');
      } catch (error) {
        console.error('衣物商店初始化失败:', error);
        this.setError('初始化失败');
      }
    },
  },
});
