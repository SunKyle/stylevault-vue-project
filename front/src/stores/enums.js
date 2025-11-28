import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { enumsApi } from '../services/apiClient.js';

export const useEnumsStore = defineStore('enums', () => {
  // 状态
  const categories = ref([]);
  const styles = ref([]);
  const seasons = ref([]);
  const occasions = ref([]);
  const materials = ref([]);
  const colors = ref([]);
  const sizes = ref([]);
  const conditions = ref([]);

  const loading = ref(false);
  const error = ref(null);

  // 是否已加载
  const isLoaded = ref(false);

  // 计算属性
  // 统一处理枚举选项，优先使用id字段，如果不存在则使用value
  const createEnumOptions = (items, includeColor = false) => {
    return items.map(item => {
      const option = {
        value: item.id !== undefined ? item.id : (item.value !== undefined ? item.value : ''),
        label: item.label || item.name || '未命名'
      };
      if (includeColor && item.color) {
        option.color = item.color;
      }
      return option;
    });
  };

  const categoryOptions = computed(() => createEnumOptions(categories.value));
  const styleOptions = computed(() => createEnumOptions(styles.value));
  const seasonOptions = computed(() => createEnumOptions(seasons.value));
  const occasionOptions = computed(() => createEnumOptions(occasions.value));
  const materialOptions = computed(() => createEnumOptions(materials.value));
  const colorOptions = computed(() => createEnumOptions(colors.value, true));
  const sizeOptions = computed(() => createEnumOptions(sizes.value));
  const conditionOptions = computed(() => createEnumOptions(conditions.value));

  // 缓存相关函数
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(`enums_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // 缓存有效期5分钟
        const cacheValidity = 5 * 60 * 1000;
        if (Date.now() - timestamp < cacheValidity) {
          return data;
        }
      }
    } catch (error) {
      console.error('读取缓存失败:', error);
    }
    return null;
  };

  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(`enums_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('设置缓存失败:', error);
    }
  };

  // 请求锁，用于防止并发请求
  let requestPromise = null;
  
  // 获取所有枚举值 - 从attributes表获取数据
  const fetchAllEnums = async (forceRefresh = false) => {
    // 使用缓存和标志防止重复调用
    if (!forceRefresh && isLoaded.value) return;

    // 检查缓存
    if (!forceRefresh) {
      const cachedData = getCachedData('all');
      if (cachedData) {
        categories.value = Array.isArray(cachedData.categories) ? cachedData.categories : [];
        styles.value = Array.isArray(cachedData.styles) ? cachedData.styles : [];
        seasons.value = Array.isArray(cachedData.seasons) ? cachedData.seasons : [];
        occasions.value = Array.isArray(cachedData.occasions) ? cachedData.occasions : [];
        materials.value = Array.isArray(cachedData.materials) ? cachedData.materials : [];
        colors.value = Array.isArray(cachedData.colors) ? cachedData.colors : [];
        sizes.value = Array.isArray(cachedData.sizes) ? cachedData.sizes : [];
        conditions.value = Array.isArray(cachedData.conditions) ? cachedData.conditions : [];
        isLoaded.value = true;
        return;
      }
    }

    // 关键优化：如果已有请求正在进行，返回同一个Promise
    if (requestPromise) {
      return requestPromise;
    }
    
    loading.value = true;
    error.value = null;

    try {
      // 直接从enumsApi获取枚举数据
      console.log('开始获取枚举数据...');
      const data = await enumsApi.getAllEnums();
      console.log('枚举API调用成功，响应数据:', data);

      // 确保数据结构正确，并且从attributes表获取的数据正确映射
      categories.value = Array.isArray(data.categories) ? data.categories : [];
      styles.value = Array.isArray(data.styles) ? data.styles : [];
      seasons.value = Array.isArray(data.seasons) ? data.seasons : [];
      occasions.value = Array.isArray(data.occasions) ? data.occasions : [];
      materials.value = Array.isArray(data.materials) ? data.materials : [];
      colors.value = Array.isArray(data.colors) ? data.colors : [];
      sizes.value = Array.isArray(data.sizes) ? data.sizes : [];
      conditions.value = Array.isArray(data.conditions) ? data.conditions : [];
      
      // 记录枚举数据详情
      console.log('分类数据:', categories.value);
      console.log('颜色数据:', colors.value);
      console.log('风格数据:', styles.value);

      // 缓存数据
      setCachedData('all', {
        categories: categories.value,
        styles: styles.value,
        seasons: seasons.value,
        occasions: occasions.value,
        materials: materials.value,
        colors: colors.value,
        sizes: sizes.value,
        conditions: conditions.value
      });
      console.log('枚举数据缓存完成');

      isLoaded.value = true;
    } catch (err) {
      console.error('获取枚举值失败:', err);
      error.value = err.response?.data?.message || '获取枚举值失败';
    } finally {
        loading.value = false;
        // 清除请求锁，允许后续请求
        requestPromise = null;
      }
  };

  // 获取单个枚举值 - 从attributes表获取特定类型的枚举
  const fetchEnum = async type => {
    try {
      const data = await enumsApi.getEnumsByType(type);
      
      switch (type) {
        case 'categories':
          categories.value = data;
          break;
        case 'styles':
          styles.value = data;
          break;
        case 'seasons':
          seasons.value = data;
          break;
        case 'occasions':
          occasions.value = data;
          break;
        case 'materials':
          materials.value = data;
          break;
        case 'colors':
          colors.value = data;
          break;
        case 'sizes':
          sizes.value = data;
          break;
        case 'conditions':
          conditions.value = data;
          break;
        default:
          console.error(`未知的枚举类型: ${type}`);
      }
    } catch (err) {
      console.error(`获取${type}枚举值失败:`, err);
    }
  };

  // 根据值获取标签 - 同时支持id和value字段
  const getLabelByValue = (type, value) => {
    const enumMap = {
      categories: categories.value,
      styles: styles.value,
      seasons: seasons.value,
      occasions: occasions.value,
      materials: materials.value,
      colors: colors.value,
      sizes: sizes.value,
      conditions: conditions.value,
    };

    const items = enumMap[type];
    if (!items) return value;
    
    // 优先查找id匹配，然后查找value匹配
    const item = items.find(item => item.id === value || item.value === value);
    return item?.label || item?.name || value;
  };

  // 重置状态
  const reset = () => {
    categories.value = [];
    styles.value = [];
    seasons.value = [];
    occasions.value = [];
    materials.value = [];
    colors.value = [];
    sizes.value = [];
    conditions.value = [];
    loading.value = false;
    error.value = null;
    isLoaded.value = false;
  };

  return {
    // 状态
    categories,
    styles,
    seasons,
    occasions,
    materials,
    colors,
    sizes,
    conditions,
    loading,
    error,
    isLoaded,

    // 计算属性
    categoryOptions,
    styleOptions,
    seasonOptions,
    occasionOptions,
    materialOptions,
    colorOptions,
    sizeOptions,
    conditionOptions,

    // 方法
    fetchAllEnums,
    fetchEnum,
    getLabelByValue,
    reset,
  };
});
