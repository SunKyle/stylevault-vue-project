import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { enumsAdaptorApi } from '@/services/api/adapter';

export const useEnumsStore = defineStore('enums', () => {
  // 状态
  const categories = ref([]);
  const styles = ref([]);
  const seasons = ref([]);
  const occasions = ref([]);
  const materials = ref([]);
  const colors = ref([]);
  const sizes = ref([]);

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

  // 获取所有枚举值 - 从attributes表获取数据
  const fetchAllEnums = async () => {
    if (isLoaded.value) return;

    loading.value = true;
    error.value = null;

    try {
      // 直接从enumsAdaptorApi获取枚举数据
      const data = await enumsAdaptorApi.getAllEnums();

      // 确保数据结构正确，并且从attributes表获取的数据正确映射
      categories.value = Array.isArray(data.categories) ? data.categories : [];
      styles.value = Array.isArray(data.styles) ? data.styles : [];
      seasons.value = Array.isArray(data.seasons) ? data.seasons : [];
      occasions.value = Array.isArray(data.occasions) ? data.occasions : [];
      materials.value = Array.isArray(data.materials) ? data.materials : [];
      colors.value = Array.isArray(data.colors) ? data.colors : [];
      sizes.value = Array.isArray(data.sizes) ? data.sizes : [];

      isLoaded.value = true;
    } catch (err) {
      console.error('获取枚举值失败:', err);
      error.value = err.response?.data?.message || '获取枚举值失败';
    } finally {
      loading.value = false;
    }
  };

  // 获取单个枚举值 - 从attributes表获取特定类型的枚举
  const fetchEnum = async type => {
    try {
      const data = await enumsAdaptorApi.getEnumsByType(type);
      
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

    // 方法
    fetchAllEnums,
    fetchEnum,
    getLabelByValue,
    reset,
  };
});
