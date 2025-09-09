import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useEnumsStore = defineStore('enums', () => {
  // 状态
  const categories = ref([]);
  const styles = ref([]);
  const seasons = ref([]);
  const occasions = ref([]);
  
  const loading = ref(false);
  const error = ref(null);
  
  // 是否已加载
  const isLoaded = ref(false);

  // 计算属性
  const categoryOptions = computed(() => 
    categories.value.map(item => ({
      value: item.value,
      label: item.label
    }))
  );

  const styleOptions = computed(() => 
    styles.value.map(item => ({
      value: item.value,
      label: item.label
    }))
  );

  const seasonOptions = computed(() => 
    seasons.value.map(item => ({
      value: item.value,
      label: item.label
    }))
  );

  const occasionOptions = computed(() => 
    occasions.value.map(item => ({
      value: item.value,
      label: item.label
    }))
  );

  // 获取所有枚举值
  const fetchAllEnums = async () => {
    if (isLoaded.value) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.get('/api/v1/enums/all');
      const data = response.data.data || {};
      
      categories.value = data.clothingTypes || [];
      styles.value = data.styles || [];
      seasons.value = data.seasons || [];
      occasions.value = data.occasions || [];
      
      isLoaded.value = true;
    } catch (err) {
      console.error('获取枚举值失败:', err);
      error.value = err.response?.data?.message || '获取枚举值失败';
    } finally {
      loading.value = false;
    }
  };

  // 获取单个枚举值
  const fetchEnum = async (type) => {
    const endpoints = {
      categories: '/enums/types',
      styles: '/enums/styles',
      seasons: '/enums/seasons',
      occasions: '/enums/occasions'
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
      occasions: occasions.value
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
    loading,
    error,
    isLoaded,
    
    // 计算属性
    categoryOptions,
    styleOptions,
    seasonOptions,
    occasionOptions,
    
    // 方法
    fetchAllEnums,
    fetchEnum,
    getLabelByValue,
    reset
  };
});