import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useEnumsStore = defineStore('enums', () => {
  // 状态
  const categories = ref([]);
  const styles = ref([]);
  const seasons = ref([]);
  const occasions = ref([]);
  const materials = ref([]);
  const colors = ref([]);

  const loading = ref(false);
  const error = ref(null);

  // 是否已加载
  const isLoaded = ref(false);

  // 计算属性
  const categoryOptions = computed(() =>
    categories.value.map(item => ({
      value: item.value,
      label: item.label,
    }))
  );

  const styleOptions = computed(() =>
    styles.value.map(item => ({
      value: item.id,
      label: item.label,
    }))
  );

  // 计算属性 - 修复季节选项格式
  const seasonOptions = computed(() =>
    seasons.value.map(item => ({
      value: String(item.id || item.value), // 统一转换为字符串
      label: item.label,
    }))
  );

  const occasionOptions = computed(() =>
    occasions.value.map(item => ({
      value: item.id,
      label: item.label,
    }))
  );

  const materialOptions = computed(() =>
    materials.value.map(item => ({
      value: item.id,
      label: item.label,
    }))
  );

  const colorOptions = computed(() =>
    colors.value.map(item => ({
      value: item.id,
      label: item.label,
      color: item.color,
    }))
  );

  // 获取所有枚举值
  // 在fetchAllEnums方法中添加调试
  const fetchAllEnums = async () => {
    if (isLoaded.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/enums/all');
      const data = response.data || {};

      console.log('=== 枚举数据调试 ===');
      console.log('原始季节数据:', data.seasons);

      // 确保数据结构正确
      categories.value = data.clothingTypes || [];
      styles.value = Array.isArray(data.styles) ? data.styles : [];
      seasons.value = Array.isArray(data.seasons) ? data.seasons : [];
      occasions.value = Array.isArray(data.occasions) ? data.occasions : [];
      materials.value = Array.isArray(data.materials) ? data.materials : [];
      colors.value = Array.isArray(data.colors) ? data.colors : [];

      console.log('处理后季节数据:', seasons.value);
      console.log('季节选项:', seasonOptions.value);

      isLoaded.value = true;
    } catch (err) {
      console.error('获取枚举值失败:', err);
      error.value = err.response?.data?.message || '获取枚举值失败';
    } finally {
      loading.value = false;
    }
  };

  // 获取单个枚举值
  const fetchEnum = async type => {
    const endpoints = {
      categories: '/enums/types',
      styles: '/enums/styles',
      seasons: '/enums/seasons',
      occasions: '/enums/occasions',
    };

    if (!endpoints[type]) {
      console.error(`未知的枚举类型: ${type}`);
      return;
    }

    try {
      const response = await api.get(endpoints[type]);
      const data = response.data.data || [];

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
      }
    } catch (err) {
      console.error(`获取${type}枚举值失败:`, err);
    }
  };

  // 根据值获取标签
  const getLabelByValue = (type, value) => {
    const enumMap = {
      categories: categories.value,
      styles: styles.value,
      seasons: seasons.value,
      occasions: occasions.value,
      materials: materials.value,
      colors: colors.value,
    };

    const item = enumMap[type]?.find(item => item.value === value);
    return item?.label || value;
  };

  // 重置状态
  const reset = () => {
    categories.value = [];
    styles.value = [];
    seasons.value = [];
    occasions.value = [];
    materials.value = [];
    colors.value = [];
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

    // 方法
    fetchAllEnums,
    fetchEnum,
    getLabelByValue,
    reset,
  };
});
