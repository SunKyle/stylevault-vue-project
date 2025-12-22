import { defineStore } from 'pinia';
import { enumsApi } from '../../services/apiClient';

// 枚举类型列表（统一管理，避免硬编码）
const ENUM_TYPES = [
  'categories', 'styles', 'colors', 'seasons',
  'materials', 'patterns', 'sizes', 'conditions',
  'statuses', 'occasions'
];

export const useEnumsStore = defineStore('enums', {
  state: () => ({
    enumsData: Object.fromEntries(ENUM_TYPES.map(type => [type, []])),
    loading: false,
    error: null,
    // 标记数据是否已加载完成，避免重复请求
    isLoaded: false
  }),

  getters: {
    // 根据类型和id获取label
    getLabel: state => (type, id) => {
      // 校验：类型不存在/ID为空/枚举数据为空 → 返回原ID
      if (!ENUM_TYPES.includes(type) || !id || !state.enumsData[type].length) return id;
      const item = state.enumsData[type].find(item => item.value === String(id));
      return item ? item.label : id;
    },

    // 根据类型获取选项列表
    getOptions: state => (type) => {
      return ENUM_TYPES.includes(type) ? state.enumsData[type] : [];
    },
  },

  actions: {
    async fetchAllEnums() {
      // 防重复请求：正在加载 或 已加载完成 → 直接返回
      if (this.loading || this.isLoaded) return;

      this.loading = true;
      this.error = null;

      try {
        const response = await enumsApi.getAllEnums();
        const data = response.data;

        if (data && typeof data === 'object') {
          Object.keys(data).forEach(key => {
            if (ENUM_TYPES.includes(key)) {
              this.enumsData[key] = Array.isArray(data[key]) ? data[key] : [];
            }
          });
        }
        this.isLoaded = true; // 标记加载完成
        console.log('✅ 枚举数据加载成功');
      } catch (error) {
        const errorMsg = error.message || '加载枚举数据失败';
        console.error('❌ 加载枚举数据失败:', errorMsg);
        this.error = errorMsg; // 存储错误信息，供组件使用
      } finally {
        this.loading = false;
      }
    },

    // 优化：增加类型校验
    setEnums(type, data) {
      if (ENUM_TYPES.includes(type)) {
        this.enumsData[type] = Array.isArray(data) ? data : [];
        this.isLoaded = true; // 手动设置数据后标记为已加载
      }
    },

    // 优化：复用初始化逻辑，清空后重置标记
    clearEnums() {
      ENUM_TYPES.forEach(type => {
        this.enumsData[type] = [];
      });
      this.isLoaded = false; // 清空后允许重新加载
      this.error = null;
    },

    // 优化：异步初始化，支持等待完成
    async initializeStore() {
      await this.fetchAllEnums(); // 等待请求完成
    }
  },
});