/**
 * Inspiration Store - 灵感搭配管理模块
 *
 * 功能职责：
 * - 管理搭配创建流程中的筛选条件、分页状态
 * - 处理衣物选择、搭配保存等核心业务逻辑
 * - 协调 clothingStore 和 outfitStore 的数据交互
 *
 * 性能优化：
 * - 筛选防抖：避免频繁筛选导致的性能问题
 * - 结果缓存：减少重复计算开销
 */

import { defineStore } from 'pinia';
import { ref, computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useClothingStore } from './clothingStore';
import { useOutfitStore } from './outfitStore';

// ===================== 工具函数 =====================

/**
 * 简单的防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 生成筛选缓存Key
 * @param {object} filters - 筛选条件对象
 * @returns {string} 缓存Key
 */
function generateFilterCacheKey(filters) {
  return `${filters.category}|${filters.tag || ''}|${filters.search || ''}|${filters.scene.join(
    ','
  )}|${filters.season.join(',')}|${filters.style.join(',')}`;
}

// ===================== 常量定义 =====================

/** 默认分页大小 */
const DEFAULT_PAGE_SIZE = 12;

/** 默认分类选项 */
const DEFAULT_CATEGORY = '0';

/** 默认标签选项 */
const DEFAULT_TAG = '最近穿着';

/** 筛选防抖延迟（毫秒） */
const FILTER_DEBOUNCE_DELAY = 300;

/** 筛选结果缓存最大数量 */
const FILTER_CACHE_MAX_SIZE = 50;

// ===================== Store 定义 =====================

export const useInspirationStore = defineStore(
  'inspiration',
  () => {
    // --- 依赖注入 ---

    const clothingStore = useClothingStore();
    const outfitStore = useOutfitStore();
    const router = useRouter();

    // --- 状态定义 ---

    /** 筛选条件状态 */
    const filters = reactive({
      category: DEFAULT_CATEGORY, // 当前选中的分类
      tag: '', // 当前选中的标签
      search: '', // 搜索关键词
      scene: [], // 场景筛选数组
      season: [], // 季节筛选数组
      style: [], // 风格筛选数组
    });

    /** 分页状态 */
    const pagination = reactive({
      page: 1, // 当前页码（从1开始）
      pageSize: DEFAULT_PAGE_SIZE, // 每页数量
      hasMore: true, // 是否还有更多数据
    });

    /** 已选中的衣物列表 */
    const selectedClothes = ref([]);

    /** 加载状态标识 */
    const isLoading = ref(false);

    /** 筛选结果缓存 Map<cacheKey, filteredResult> */
    const filterCache = reactive(new Map());

    /** 待应用的筛选状态（防抖用） */
    const pendingFilters = reactive({
      category: DEFAULT_CATEGORY,
      tag: '',
      search: '',
      scene: [],
      season: [],
      style: [],
    });

    /** 防抖后的筛选应用函数 */
    let applyFiltersDebounced = null;

    // --- 计算属性 ---

    /**
     * 从 clothingStore 获取所有衣物数据
     * 缓存优化：避免直接访问 store 的响应式数据
     */
    const allClothes = computed(() => clothingStore.clothingItems);

    /**
     * 从 outfitStore 获取所有已保存的搭配
     * 统一处理数组安全转换
     */
    const savedOutfits = computed(() => {
      const outfits = outfitStore.allOutfits;
      return Array.isArray(outfits) ? outfits : [];
    });

    /**
     * 获取衣物分类列表
     * @returns {string[]} 包含"全部"选项的分类名称数组
     */
    const categories = computed(() => {
      return [{ id: DEFAULT_CATEGORY, displayName: '全部' }, ...clothingStore.categories];
    });

    /**
     * 获取所有可用标签
     * @returns {string[]} 去重后的标签数组
     */
    const tags = computed(() => {
      const uniqueTags = new Set([DEFAULT_TAG]);
      allClothes.value.forEach(item => {
        if (Array.isArray(item.tags)) {
          item.tags.forEach(tag => uniqueTags.add(tag));
        }
      });
      return Array.from(uniqueTags);
    });

    /**
     * 根据当前筛选条件过滤后的衣物列表
     * 性能优化：使用缓存减少重复计算
     * @returns {object[]} 符合条件的衣物数组
     */
    const filteredClothes = computed(() => {
      // 生成缓存Key
      const cacheKey = generateFilterCacheKey(filters);

      // 命中缓存直接返回
      if (filterCache.has(cacheKey)) {
        return filterCache.get(cacheKey);
      }

      // 执行筛选计算
      const result = allClothes.value.filter(item => {
        // 分类匹配：选中"全部"或分类名称匹配
        const matchCategory =
          filters.category === DEFAULT_CATEGORY || item.category === filters.category;

        // 标签匹配：未选择标签或标签包含在衣物属性中
        const matchTag = !filters.tag || item.tags?.includes(filters.tag);

        // 搜索匹配：支持名称和类型字段模糊搜索
        const searchLower = filters.search.toLowerCase();
        const matchSearch =
          !filters.search ||
          item.name?.toLowerCase().includes(searchLower) ||
          item.type?.toLowerCase().includes(searchLower);

        return matchCategory && matchTag && matchSearch;
      });

      // 缓存结果，管理缓存大小
      if (filterCache.size >= FILTER_CACHE_MAX_SIZE) {
        // 清除最早的缓存（Map的entries().next()获取第一个）
        const firstKey = filterCache.keys().next().value;
        if (firstKey) {
          filterCache.delete(firstKey);
        }
      }
      filterCache.set(cacheKey, result);

      return result;
    });

    /**
     * 分页加载的搭配数据
     * @returns {object[]} 当前页的搭配数据
     */
    const visibleOutfits = computed(() => {
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      return savedOutfits.value.slice(start, end);
    });

    /**
     * 是否还有更多数据可加载（兼容属性）
     * @returns {boolean} 是否有更多数据
     */
    const hasMore = computed(() => pagination.hasMore);

    // --- 方法定义 ---

    /**
     * 设置筛选条件
     * 性能优化：搜索和普通筛选使用防抖，避免频繁计算
     * @param {string} type - 筛选类型：category/tag/search/scene/season/style
     * @param {string|object} value - 筛选值
     * @param {boolean} immediate - 是否立即应用（用于下拉选择等非频繁操作）
     */
    const setFilter = (type, value, immediate = false) => {
      // 初始化防抖函数（延迟执行，仅用于搜索类型）
      if (!applyFiltersDebounced) {
        applyFiltersDebounced = debounce((pending, current) => {
          // 将待应用的筛选值同步到当前筛选状态
          Object.assign(current, pending);
          // 重置分页
          pagination.page = 1;
        }, FILTER_DEBOUNCE_DELAY);
      }

      // 搜索类型使用防抖
      if (type === 'search') {
        if (immediate) {
          filters.search = value;
          pagination.page = 1;
        } else {
          pendingFilters.search = value;
          applyFiltersDebounced(pendingFilters, filters);
        }
        return;
      }

      // 其他类型（category, tag, scene, season, style）直接应用
      switch (type) {
        case 'category':
          filters.category = String(value);
          break;
        case 'tag':
          filters.tag = value;
          break;
        case 'scene':
        case 'season':
        case 'style':
          // 数组类型：切换（添加/移除）筛选值
          toggleArrayFilter(filters[type], value);
          break;
      }
      // 切换筛选条件时重置分页
      pagination.page = 1;
    };

    /**
     * 设置分类筛选
     * @param {string|number} category - 分类名称
     */
    const setCategory = category => {
      filters.category = String(category);
      pagination.page = 1;
      console.log('setCategory', category);
    };

    /**
     * 设置标签筛选
     * @param {string} tag - 标签名称
     */
    const setTag = tag => {
      filters.tag = tag;
      pagination.page = 1;
    };

    /**
     * 切换数组中的筛选值（添加或移除）
     * @param {array} arr - 目标数组
     * @param {*} value - 要切换的值
     */
    const toggleArrayFilter = (arr, value) => {
      const index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      } else {
        arr.push(value);
      }
    };

    /**
     * 重置所有筛选条件为默认值
     * 性能优化：同时清除筛选缓存
     */
    const resetFilters = () => {
      filters.category = DEFAULT_CATEGORY;
      filters.tag = '';
      filters.search = '';
      filters.scene = [];
      filters.season = [];
      filters.style = [];
      // 清除筛选缓存
      filterCache.clear();
      // 重置待应用的筛选状态
      pendingFilters.category = DEFAULT_CATEGORY;
      pendingFilters.tag = '';
      pendingFilters.search = '';
      pendingFilters.scene = [];
      pendingFilters.season = [];
      pendingFilters.style = [];
      pagination.page = 1;
    };

    /**
     * 切换衣物的选中状态
     * @param {object} item - 衣物对象
     */
    const toggleCloth = item => {
      const index = selectedClothes.value.findIndex(i => i.id === item.id);
      if (index === -1) {
        selectedClothes.value.push(item);
      } else {
        selectedClothes.value.splice(index, 1);
      }
    };

    /**
     * 移除指定索引的已选衣物
     * @param {number} index - 衣物在选中列表中的索引
     */
    const removeCloth = index => {
      selectedClothes.value.splice(index, 1);
    };

    /**
     * 清空所有已选衣物
     */
    const resetClothes = () => {
      selectedClothes.value = [];
    };

    /**
     * 加载更多搭配数据
     * 自动判断是否还有更多数据并更新分页状态
     */
    const loadMore = () => {
      const currentEnd = pagination.page * pagination.pageSize;
      const totalLength = savedOutfits.value.length;

      pagination.hasMore = currentEnd < totalLength;

      if (pagination.hasMore) {
        pagination.page++;
      }
    };

    /**
     * 保存当前选中的衣物组合为新搭配
     * @param {object} outfitInfo - 搭配信息对象
     * @param {string} outfitInfo.name - 搭配名称
     * @param {string} outfitInfo.description - 搭配描述
     * @param {array} [outfitInfo.scenes] - 适用场景数组
     * @param {array} [outfitInfo.seasons] - 适用季节数组
     * @param {array} [outfitInfo.styles] - 适用风格数组
     * @throws {Error} 未选择任何衣物时抛出
     */
    const saveOutfit = async outfitInfo => {
      if (selectedClothes.value.length === 0) {
        throw new Error('请至少选择一件衣物');
      }

      const newOutfit = {
        id: `outfit_${Date.now()}`,
        title: outfitInfo.name,
        description: outfitInfo.description || '',
        items: [...selectedClothes.value],
        scenes: outfitInfo.scenes || [],
        seasons: outfitInfo.seasons || [],
        styles: outfitInfo.styles || [],
        // tag: outfitInfo.tag || '未分类',
        liked: false,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      console.log('newOutfit', newOutfit);
      await outfitStore.addOutfit(newOutfit);
      resetClothes();
    };

    /**
     * 加载已保存的搭配到选中列表并跳转到详情页
     * @param {object} outfit - 搭配对象
     */
    const loadOutfit = outfit => {
      selectedClothes.value = [...(outfit.items || [])];
      // 跳转到详情页
      router.push(`/preview/${outfit.id}`);
    };

    /**
     * 删除指定的搭配
     * @param {object} outfit - 要删除的搭配对象
     */
    const deleteOutfit = async outfit => {
      await outfitStore.removeOutfit(outfit.id);
    };

    /**
     * 初始化数据
     * 并行加载分类、衣物和搭配数据
     */
    const initialize = async () => {
      isLoading.value = true;

      try {
        await Promise.all([
          outfitStore.fetchOutfits(),
          clothingStore.fetchCategories(true),
          clothingStore.fetchClothingItems(true),
        ]);

        // 根据数据量更新分页状态
        pagination.hasMore = savedOutfits.value.length > pagination.pageSize;
      } finally {
        isLoading.value = false;
      }
    };

    // --- 导出 ---

    return {
      // 状态
      filters,
      pagination,
      selectedClothes,
      isLoading,
      filterCache, // 导出缓存供调试使用

      // 计算属性
      categories,
      tags,
      savedOutfits,
      filteredClothes,
      visibleOutfits,
      hasMore,

      // 方法
      setFilter,
      setCategory,
      setTag,
      resetFilters,
      toggleCloth,
      removeCloth,
      resetClothes,
      loadMore,
      saveOutfit,
      loadOutfit,
      deleteOutfit,
      initialize,
    };
  },
  {
    // 持久化配置
    persist: {
      key: 'stylevault-inspiration',
      paths: ['filters', 'selectedClothes', 'pagination'],
      storage: localStorage,
    },
  }
);
