import { defineStore } from 'pinia';

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
      occasions: []
    },
    loading: false,
    error: null
  }),

  getters: {
    // 获取所有枚举数据
    getAllEnums: (state) => state.enumsData,

    // 获取分类标签
    getCategoryLabel: (state) => (id) => {
      const item = state.enumsData.categories.find(cat => cat.id === id);
      return item ? item.name : id;
    },

    // 获取风格标签
    getStyleLabel: (state) => (id) => {
      const item = state.enumsData.styles.find(style => style.id === id);
      return item ? item.name : id;
    },

    // 获取颜色标签
    getColorLabel: (state) => (id) => {
      const item = state.enumsData.colors.find(color => color.id === id);
      return item ? item.name : id;
    },

    // 获取季节标签
    getSeasonLabel: (state) => (id) => {
      const item = state.enumsData.seasons.find(season => season.id === id);
      return item ? item.name : id;
    },

    // 获取材质标签
    getMaterialLabel: (state) => (id) => {
      const item = state.enumsData.materials.find(material => material.id === id);
      return item ? item.name : id;
    },

    // 获取图案标签
    getPatternLabel: (state) => (id) => {
      const item = state.enumsData.patterns.find(pattern => pattern.id === id);
      return item ? item.name : id;
    },

    // 获取尺码标签
    getSizeLabel: (state) => (id) => {
      const item = state.enumsData.sizes.find(size => size.id === id);
      return item ? item.name : id;
    },

    // 获取状态标签
    getConditionLabel: (state) => (id) => {
      const item = state.enumsData.conditions.find(condition => condition.id === id);
      return item ? item.name : id;
    },

    // 获取衣物状态标签
    getStatusLabel: (state) => (id) => {
      const item = state.enumsData.statuses.find(status => status.id === id);
      return item ? item.name : id;
    },

    // 获取场合标签
    getOccasionLabel: (state) => (id) => {
      const item = state.enumsData.occasions.find(occasion => occasion.id === id);
      return item ? item.name : id;
    }
  },

  actions: {
    // 获取所有枚举数据
    async fetchAllEnums() {
      this.loading = true;
      this.error = null;

      try {
        // 这里应该是从API获取数据的逻辑
        // 暂时使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 设置模拟的枚举数据
        this.enumsData = {
          categories: [
            { id: 1, name: '上衣' },
            { id: 2, name: '裤子' },
            { id: 3, name: '裙子' },
            { id: 4, name: '外套' },
            { id: 5, name: '鞋子' },
            { id: 6, name: '配饰' }
          ],
          styles: [
            { id: 1, name: '休闲' },
            { id: 2, name: '正式' },
            { id: 3, name: '运动' },
            { id: 4, name: '复古' },
            { id: 5, name: '时尚' }
          ],
          colors: [
            { id: 1, name: '黑色' },
            { id: 2, name: '白色' },
            { id: 3, name: '红色' },
            { id: 4, name: '蓝色' },
            { id: 5, name: '绿色' },
            { id: 6, name: '黄色' },
            { id: 7, name: '紫色' }
          ],
          seasons: [
            { id: 1, name: '春季' },
            { id: 2, name: '夏季' },
            { id: 3, name: '秋季' },
            { id: 4, name: '冬季' },
            { id: 5, name: '四季通用' }
          ],
          materials: [
            { id: 1, name: '棉质' },
            { id: 2, name: '丝质' },
            { id: 3, name: '羊毛' },
            { id: 4, name: '尼龙' },
            { id: 5, name: '混纺' }
          ],
          patterns: [
            { id: 1, name: '纯色' },
            { id: 2, name: '条纹' },
            { id: 3, name: '格子' },
            { id: 4, name: '花卉' },
            { id: 5, name: '波点' }
          ],
          sizes: [
            { id: 1, name: 'XS' },
            { id: 2, name: 'S' },
            { id: 3, name: 'M' },
            { id: 4, name: 'L' },
            { id: 5, name: 'XL' }
          ],
          conditions: [
            { id: 1, name: '全新' },
            { id: 2, name: '几乎全新' },
            { id: 3, name: '良好' },
            { id: 4, name: '一般' }
          ],
          statuses: [
            { id: 1, name: '在衣橱' },
            { id: 2, name: '已送出' },
            { id: 3, name: '已捐赠' },
            { id: 4, name: '已出售' }
          ],
          occasions: [
            { id: 1, name: '日常' },
            { id: 2, name: '工作' },
            { id: 3, name: '聚会' },
            { id: 4, name: '约会' },
            { id: 5, name: '旅行' }
          ]
        };

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
        this.enumsData[type] = data;
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
        occasions: []
      };
    }
  }
});