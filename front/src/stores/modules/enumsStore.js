import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { enumsApi } from '../../services/apiClient';

// 枚举类型列表（统一管理，避免硬编码）
const ENUM_TYPES = [
  'categories', 'styles', 'colors', 'seasons',
  'materials', 'patterns', 'sizes', 'conditions',
  'statuses', 'occasions'
];

export const useEnumsStore = defineStore('enums', () => {
  // 状态
  const enumsData = ref(Object.fromEntries(ENUM_TYPES.map(type => [type, []])));
  const loading = ref(false);
  const error = ref(null);
  const isLoaded = ref(false);
  let requestPromise = null;

  // 缓存管理（5分钟有效期）
  const CACHE_KEY = 'stylevault-enums';
  const CACHE_DURATION = 5 * 60 * 1000;

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (e) {
      console.error('读取枚举缓存失败:', e);
    }
    return null;
  };

  const setCachedData = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error('保存枚举缓存失败:', e);
    }
  };

  // 计算属性：统一处理枚举选项
  const createEnumOptions = (items, includeColor = false) => {
    return items.map(item => {
      const option = {
        value: item.id !== undefined ? item.id : item.value !== undefined ? item.value : '',
        label: item.label || item.name || '未命名',
      };
      if (includeColor && item.color) {
        option.color = item.color;
      }
      return option;
    });
  };

  const categoryOptions = computed(() => createEnumOptions(enumsData.value.categories));
  const styleOptions = computed(() => createEnumOptions(enumsData.value.styles));
  const seasonOptions = computed(() => createEnumOptions(enumsData.value.seasons));
  const occasionOptions = computed(() => createEnumOptions(enumsData.value.occasions));
  const materialOptions = computed(() => createEnumOptions(enumsData.value.materials));
  const colorOptions = computed(() => createEnumOptions(enumsData.value.colors, true));
  const sizeOptions = computed(() => createEnumOptions(enumsData.value.sizes));
  const conditionOptions = computed(() => createEnumOptions(enumsData.value.patterns));
  const statusOptions = computed(() => createEnumOptions(enumsData.value.statuses));

  // 获取选项列表
  const getOptions = (type) => {
    if (!ENUM_TYPES.includes(type)) return [];
    
    const optionsMap = {
      categories: categoryOptions.value,
      styles: styleOptions.value,
      seasons: seasonOptions.value,
      occasions: occasionOptions.value,
      materials: materialOptions.value,
      colors: colorOptions.value,
      sizes: sizeOptions.value,
      conditions: conditionOptions.value,
      patterns: enumsData.value.patterns,
      statuses: statusOptions.value
    };
    
    return optionsMap[type] || enumsData.value[type];
  };

  // 根据类型和id获取label
  const getLabel = (type, id) => {
    if (!ENUM_TYPES.includes(type) || !id || !enumsData.value[type]?.length) {
      return id;
    }
    const item = enumsData.value[type].find(item => 
      item.value === String(id) || item.id === id
    );
    return item?.label || item?.name || id;
  };

  // 获取所有枚举数据
  const fetchAllEnums = async (forceRefresh = false) => {
    if (loading.value || (isLoaded.value && !forceRefresh)) return;

    // 检查缓存
    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        Object.keys(cached).forEach(key => {
          if (ENUM_TYPES.includes(key)) {
            enumsData.value[key] = Array.isArray(cached[key]) ? cached[key] : [];
          }
        });
        isLoaded.value = true;
        return;
      }
    }

    // 防止并发请求
    if (requestPromise) return requestPromise;

    loading.value = true;
    error.value = null;

    try {
      console.log('开始获取枚举数据...');
      requestPromise = enumsApi.getAllEnums();
      const response = await requestPromise;
      const data = response.data || response;

      if (data && typeof data === 'object') {
        Object.keys(data).forEach(key => {
          if (ENUM_TYPES.includes(key)) {
            enumsData.value[key] = Array.isArray(data[key]) ? data[key] : [];
          }
        });
      }

      setCachedData(enumsData.value);
      isLoaded.value = true;
      console.log('✅ 枚举数据加载成功');
    } catch (err) {
      error.value = err.message || '加载枚举数据失败';
      console.error('❌ 加载枚举数据失败:', err);
    } finally {
      loading.value = false;
      requestPromise = null;
    }
  };

  // 获取单个枚举值
  const fetchEnum = async (type) => {
    if (!ENUM_TYPES.includes(type)) return;
    
    try {
      const data = await enumsApi.getEnumsByType(type);
      enumsData.value[type] = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`获取${type}枚举值失败:`, err);
    }
  };

  // 手动设置枚举数据
  const setEnums = (type, data) => {
    if (ENUM_TYPES.includes(type)) {
      enumsData.value[type] = Array.isArray(data) ? data : [];
      isLoaded.value = true;
    }
  };

  // 清空枚举数据
  const clearEnums = () => {
    ENUM_TYPES.forEach(type => {
      enumsData.value[type] = [];
    });
    isLoaded.value = false;
    error.value = null;
    localStorage.removeItem(CACHE_KEY);
  };

  return {
    // 状态
    enumsData,
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
    patternOptions: enumsData.value.patterns,
    statusOptions,

    // 方法
    fetchAllEnums,
    fetchEnum,
    setEnums,
    clearEnums,
    getOptions,
    getLabel
  };
});