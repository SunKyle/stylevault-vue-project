import { defineStore } from 'pinia';

export const useFitStore = defineStore('fit', {
  state: () => ({
    fitPoints: {},
    mappingRules: {
      top: ['chest', 'arms'],
      pants: ['waist', 'legs'],
      dress: ['chest', 'waist', 'legs'],
      shoes: ['feet'],
      hat: ['head'],
      glasses: ['face'],
      bag: ['shoulders', 'waist'],
      accessories: ['hands', 'neck', 'wrists']
    },
    fitStrategies: {
      basic: 'position',
      intermediate: 'deformation',
      advanced: 'physics'
    },
    currentStrategy: 'intermediate',
    adjustments: {},
    loading: false,
    error: null
  }),

  getters: {
    getFitPoints: (state) => (clothingId) => {
      return state.fitPoints[clothingId] || [];
    },
    getMappingForCategory: (state) => (category) => {
      return state.mappingRules[category] || [];
    },
    getCurrentStrategy: (state) => {
      return state.currentStrategy;
    },
    getAdjustments: (state) => (clothingId) => {
      return state.adjustments[clothingId] || {};
    }
  },

  actions: {
    setLoading(status) {
      this.loading = status;
    },

    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    setFitPoints(clothingId, points) {
      this.fitPoints[clothingId] = points;
    },

    updateMappingRule(category, bodyParts) {
      this.mappingRules[category] = bodyParts;
    },

    setFitStrategy(strategy) {
      if (Object.values(this.fitStrategies).includes(strategy)) {
        this.currentStrategy = strategy;
      }
    },

    setAdjustment(clothingId, adjustment) {
      if (!this.adjustments[clothingId]) {
        this.adjustments[clothingId] = {};
      }
      this.adjustments[clothingId] = {
        ...this.adjustments[clothingId],
        ...adjustment
      };
    },

    resetAdjustments(clothingId) {
      delete this.adjustments[clothingId];
    },

    resetAllAdjustments() {
      this.adjustments = {};
    },

    calculateFitPoints(clothingItem, model) {
      return new Promise((resolve, reject) => {
        this.setLoading(true);
        this.clearError();

        try {
          // 这里可以实现更复杂的贴合点计算逻辑
          const category = clothingItem.category || 'accessories';
          const bodyParts = this.getMappingForCategory(category);
          const fitPoints = bodyParts.map(part => ({
            part,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }));

          this.setFitPoints(clothingItem.id, fitPoints);
          resolve(fitPoints);
        } catch (error) {
          this.setError('计算贴合点失败');
          reject(error);
        } finally {
          this.setLoading(false);
        }
      });
    }
  }
});