import { defineStore } from 'pinia';
import outfitService from '../services/outfitService';

export const useOutfitStore = defineStore('outfit', {
  state: () => ({
    outfits: [],
    selectedOutfit: null,
    loading: false,
    error: null,
  }),

  getters: {
    // 获取所有搭配
    allOutfits: state => state.outfits,

    // 获取收藏的搭配
    favoriteOutfits: state => state.outfits.filter(outfit => outfit.liked),

    // 按标签获取搭配
    outfitsByTag: state => tag => {
      return state.outfits.filter(outfit => outfit.tag === tag);
    },

    // 按场合获取搭配
    outfitsByOccasion: state => occasion => {
      return state.outfits.filter(outfit => outfit.occasion === occasion);
    },

    // 获取最热门的搭配
    popularOutfits: state => {
      return [...state.outfits].sort((a, b) => b.likes - a.likes).slice(0, 5);
    },
  },

  actions: {
    // 设置加载状态
    setLoading(status) {
      this.loading = status;
    },

    // 设置错误信息
    setError(error) {
      this.error = error;
    },

    // 清除错误信息
    clearError() {
      this.error = null;
    },

    // 获取所有搭配
    async fetchOutfits() {
      this.setLoading(true);
      this.clearError();

      try {
        const outfits = outfitService.getOutfits();
        this.outfits = outfits;
        return outfits;
      } catch (error) {
        this.setError('获取搭配列表失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 根据标签获取搭配
    async fetchOutfitsByTag(tag) {
      this.setLoading(true);
      this.clearError();

      try {
        const outfits = outfitService.getOutfitsByTag(tag);
        return outfits;
      } catch (error) {
        this.setError(`获取标签为"${tag}"的搭配失败`);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 添加新搭配
    async addOutfit(outfit) {
      this.setLoading(true);
      this.clearError();

      try {
        const newOutfit = outfitService.addOutfit(outfit);
        this.outfits.push(newOutfit);
        return newOutfit;
      } catch (error) {
        this.setError('添加搭配失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 删除搭配
    async removeOutfit(outfitTitle) {
      this.setLoading(true);
      this.clearError();

      try {
        const removedOutfit = outfitService.removeOutfit(outfitTitle);
        if (removedOutfit) {
          this.outfits = this.outfits.filter(outfit => outfit.title !== outfitTitle);
        }
        return removedOutfit;
      } catch (error) {
        this.setError('删除搭配失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 切换搭配的喜欢状态
    async toggleLike(outfitTitle) {
      this.setLoading(true);
      this.clearError();

      try {
        const updatedOutfit = outfitService.toggleLike(outfitTitle);
        if (updatedOutfit) {
          const index = this.outfits.findIndex(outfit => outfit.title === outfitTitle);
          if (index !== -1) {
            // 使用splice替换数组中的元素，确保Vue能够检测到变化
            this.outfits.splice(index, 1, updatedOutfit);
          }
        }
        return updatedOutfit;
      } catch (error) {
        this.setError('切换喜欢状态失败');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 设置选中的搭配
    setSelectedOutfit(outfit) {
      this.selectedOutfit = outfit;
    },

    // 清除选中的搭配
    clearSelectedOutfit() {
      this.selectedOutfit = null;
    },

    // 初始化搭配数据
    async initializeData() {
      this.setLoading(true);
      this.clearError();

      try {
        await this.fetchOutfits();
      } catch (error) {
        console.error('初始化搭配数据失败:', error);
        this.setError('初始化搭配数据失败，请重试');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
