/**
 * Inspiration Store - 灵感搭配管理模块
 * 
 * 功能职责：
 * - 管理搭配创建流程中的筛选条件、分页状态
 * - 处理衣物选择、搭配保存等核心业务逻辑
 * - 协调 clothingStore 和 outfitStore 的数据交互
 */

import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { useClothingStore } from './clothingStore';
import { useOutfitStore } from './outfitStore';

// ===================== 常量定义 =====================

/** 默认分页大小 */
const DEFAULT_PAGE_SIZE = 12;

/** 默认分类选项 */
const DEFAULT_CATEGORY = '全部';

/** 默认标签选项 */
const DEFAULT_TAG = '最近穿着';

// ===================== Store 定义 =====================

export const useInspirationStore = defineStore('inspiration', () => {
  // --- 依赖注入 ---
  
  const clothingStore = useClothingStore();
  const outfitStore = useOutfitStore();

  // --- 状态定义 ---

  /** 筛选条件状态 */
  const filters = reactive({
    category: DEFAULT_CATEGORY,    // 当前选中的分类
    tag: '',                       // 当前选中的标签
    search: '',                    // 搜索关键词
    scene: [],                     // 场景筛选数组
    season: [],                    // 季节筛选数组
    style: [],                     // 风格筛选数组
  });

  /** 分页状态 */
  const pagination = reactive({
    page: 1,                       // 当前页码（从1开始）
    pageSize: DEFAULT_PAGE_SIZE,   // 每页数量
    hasMore: true,                 // 是否还有更多数据
  });

  /** 已选中的衣物列表 */
  const selectedClothes = ref([]);

  /** 加载状态标识 */
  const isLoading = ref(false);

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
    const categoryNames = clothingStore.categories.map(c => c.name);
    return [DEFAULT_CATEGORY, ...categoryNames];
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
   * @returns {object[]} 符合条件的衣物数组
   */
  const filteredClothes = computed(() => {
    return allClothes.value.filter(item => {
      // 分类匹配：选中"全部"或分类名称匹配
      const matchCategory = 
        filters.category === DEFAULT_CATEGORY || 
        item.category === filters.category;
      
      // 标签匹配：未选择标签或标签包含在衣物属性中
      const matchTag = !filters.tag || item.tags?.includes(filters.tag);
      
      // 搜索匹配：支持名称和类型字段模糊搜索
      const searchLower = filters.search.toLowerCase();
      const matchSearch = !filters.search || 
        item.name?.toLowerCase().includes(searchLower) ||
        item.type?.toLowerCase().includes(searchLower);

      return matchCategory && matchTag && matchSearch;
    });
  });

  /**
   * 分页加载的搭配数据
   * @returns {object[]} 当前页的搭配数据
   */
  const visibleOutfits = computed(() => {
    const end = pagination.page * pagination.pageSize;
    return savedOutfits.value.slice(0, end);
  });

  /**
   * 是否还有更多数据可加载（兼容属性）
   * @returns {boolean} 是否有更多数据
   */
  const hasMore = computed(() => pagination.hasMore);

  // --- 方法定义 ---

  /**
   * 设置筛选条件
   * @param {string} type - 筛选类型：category/tag/search/scene/season/style
   * @param {string|object} value - 筛选值
   */
  const setFilter = (type, value) => {
    switch (type) {
      case 'category':
        filters.category = value;
        break;
      case 'tag':
        filters.tag = value;
        break;
      case 'search':
        filters.search = value;
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
   */
  const resetFilters = () => {
    filters.category = DEFAULT_CATEGORY;
    filters.tag = '';
    filters.search = '';
    filters.scene = [];
    filters.season = [];
    filters.style = [];
    pagination.page = 1;
  };

  /**
   * 切换衣物的选中状态
   * @param {object} item - 衣物对象
   */
  const toggleCloth = (item) => {
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
  const removeCloth = (index) => {
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
   * @param {string} [outfitInfo.description] - 搭配描述
   * @param {string} [outfitInfo.scene] - 适用场景
   * @param {string} [outfitInfo.tag] - 搭配标签
   * @throws {Error} 未选择任何衣物时抛出
   */
  const saveOutfit = async (outfitInfo) => {
    if (selectedClothes.value.length === 0) {
      throw new Error('请至少选择一件衣物');
    }

    const newOutfit = {
      id: `outfit_${Date.now()}`,
      title: outfitInfo.name,
      description: outfitInfo.description || '',
      items: [...selectedClothes.value],
      occasion: outfitInfo.scene || '日常',
      tag: outfitInfo.tag || '未分类',
      liked: false,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    await outfitStore.addOutfit(newOutfit);
    resetClothes();
  };

  /**
   * 加载已保存的搭配到选中列表
   * @param {object} outfit - 搭配对象
   */
  const loadOutfit = (outfit) => {
    selectedClothes.value = [...(outfit.items || [])];
  };

  /**
   * 删除指定的搭配
   * @param {object} outfit - 要删除的搭配对象
   */
  const deleteOutfit = async (outfit) => {
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
        // force=true 表示强制刷新，不使用缓存
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

    // 计算属性
    categories,
    tags,
    filteredClothes,
    visibleOutfits,
    hasMore,

    // 方法
    setFilter,
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
});
