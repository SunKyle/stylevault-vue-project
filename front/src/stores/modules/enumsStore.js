import { defineStore } from 'pinia';
import { enumsApi } from '../../services/apiClient';

// 定义枚举类型的Store
export const useEnumsStore = defineStore('enums', {
  state: () => ({
    // 存储枚举数据
    enumsData: {
      categories: [],
      styles: [],
      colors: [],
      seasons: [],
      materials: [],
      patterns: [],
      sizes: [],
      conditions: [],
      statuses: [],
      occasions: [],
    },
    loading: false,
    error: null,
  }),

  getters: {
    // 获取所有枚举数据
    getAllEnums: state => state.enumsData,

    // 获取分类标签
    getCategoryLabel: state => id => {
      if (!id || !state.enumsData.categories) return id;
      const item = state.enumsData.categories.find(cat => cat.value === id);
      return item ? item.label : id;
    },

    // 获取风格标签
    getStyleLabel: state => id => {
      if (!id || !state.enumsData.styles) return id;
      const item = state.enumsData.styles.find(style => style.value === id);
      return item ? item.label : id;
    },

    // 获取颜色标签
    getColorLabel: state => id => {
      if (!id || !state.enumsData.colors) return id;
      const item = state.enumsData.colors.find(color => color.value === id);
      return item ? item.label : id;
    },

    // 获取季节标签
    getSeasonLabel: state => id => {
      if (!id || !state.enumsData.seasons) return id;
      const item = state.enumsData.seasons.find(season => season.value === id);
      return item ? item.label : id;
    },

    // 获取材质标签
    getMaterialLabel: state => id => {
      if (!id || !state.enumsData.materials) return id;
      const item = state.enumsData.materials.find(material => material.value === id);
      return item ? item.label : id;
    },

    // 获取图案标签
    getPatternLabel: state => id => {
      if (!id || !state.enumsData.patterns) return id;
      const item = state.enumsData.patterns.find(pattern => pattern.value === id);
      return item ? item.label : id;
    },

    // 获取尺码标签
    getSizeLabel: state => id => {
      if (!id || !state.enumsData.sizes) return id;
      const item = state.enumsData.sizes.find(size => size.value === id);
      return item ? item.label : id;
    },

    // 获取状态标签
    getStatusLabel: state => id => {
      if (!id || !state.enumsData.statuses) return id;
      const item = state.enumsData.statuses.find(status => status.value === id);
      return item ? item.label : id;
    },

    // 获取场合标签
    getOccasionLabel: state => id => {
      if (!id || !state.enumsData.occasions) return id;
      const item = state.enumsData.occasions.find(occasion => occasion.value === id);
      return item ? item.label : id;
    },

    // 获取穿着状态标签
    getConditionLabel: state => id => {
      if (!id || !state.enumsData.conditions) return id;
      const item = state.enumsData.conditions.find(condition => condition.value === id);
      return item ? item.label : id;
    },

    // 获取场景选项
    sceneOptions: state => state.enumsData.occasions || [],

    // 获取季节选项
    seasonOptions: state => state.enumsData.seasons || [],

    // 获取风格选项
    styleOptions: state => state.enumsData.styles || [],

    // 获取分类选项
    categoryOptions: state => state.enumsData.categories || [],

    // 获取材质选项
    materialOptions: state => state.enumsData.materials || [],

    // 获取颜色选项
    colorOptions: state => state.enumsData.colors || [],

    // 获取尺寸选项
    sizeOptions: state => state.enumsData.sizes || [],

    // Computed properties for common access
    categories: state => state.enumsData.categories || [],
    seasons: state => state.enumsData.seasons || [],
    colors: state => state.enumsData.colors || [],
    materials: state => state.enumsData.materials || [],
    sizes: state => state.enumsData.sizes || [],

    // Formatted labels for select options
    categoryLabels: state =>
      (state.enumsData.categories || []).map(cat => ({
        value: cat.value,
        label: cat.label,
      })),

    seasonLabels: state =>
      (state.enumsData.seasons || []).map(season => ({
        value: season.value,
        label: season.label,
      })),
  },

  actions: {
    // 获取所有枚举数据
    async fetchAllEnums() {
      this.loading = true;
      this.error = null;

      try {
        // 从enumsApi获取枚举数据
        const data = await enumsApi.getAllEnums();

        // 合并数据到enumsData对象中
        if (data && typeof data === 'object') {
          Object.keys(data).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(this.enumsData, key)) {
              this.enumsData[key] = Array.isArray(data[key]) ? data[key] : [];
            }
          });
        }
        console.log('✅ 枚举数据加载成功');
      } catch (error) {
        this.error = '加载枚举数据失败';
        console.error('❌ 加载枚举数据失败:', error);
      } finally {
        this.loading = false;
      }
    },

    // 设置特定类型的枚举数据
    setEnums(type, data) {
      if (Object.prototype.hasOwnProperty.call(this.enumsData, type)) {
        this.enumsData[type] = data || [];
      }
    },

    // 清空枚举数据
    clearEnums() {
      this.enumsData = {
        categories: [],
        styles: [],
        colors: [],
        seasons: [],
        materials: [],
        patterns: [],
        sizes: [],
        conditions: [],
        statuses: [],
        occasions: [],
      };
    },

    // 初始化时自动获取数据
    initializeStore() {
      // This can be called from components when needed
      this.fetchAllEnums();
    },
  },
});
