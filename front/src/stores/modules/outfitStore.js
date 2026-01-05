import { defineStore } from 'pinia';
import { outfitApi } from '../../services/apiClient';
import { showToast } from '../../utils/toast';

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
        const result = await outfitApi.getOutfits();
        console.log('outfits!!!???', result);
        this.outfits = Array.isArray(result?.data) ? result.data : [];
        return this.outfits;
      } catch (error) {
        this.setError('获取搭配列表失败');
        showToast('获取搭配列表失败', 'error');
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
        const result = await outfitApi.getOutfitsByTag(tag);
        // 修复：API返回的数据结构是{ status, message, data }，所以需要访问result.data
        return result?.data;
      } catch (error) {
        this.setError(`获取标签为"${tag}"的搭配失败`);
        showToast(`获取标签为"${tag}"的搭配失败`, 'error');
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
        const result = await outfitApi.addOutfit(outfit);
        if (result && result.data) {
          this.outfits.push(result.data);
          showToast('搭配添加成功', 'success');
          return result.data;
        } else {
          throw new Error('无效的搭配数据');
        }
      } catch (error) {
        this.setError('添加搭配失败');
        showToast('添加搭配失败', 'error');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 删除搭配
    async removeOutfit(outfitId) {
      this.setLoading(true);
      this.clearError();

      try {
        const result = await outfitApi.deleteOutfit(outfitId);
        // 修复：API返回的数据结构是{ status, message, data }，所以需要访问result.data
        if (result?.data) {
          this.outfits = this.outfits.filter(outfit => outfit.id !== outfitId);
          showToast('搭配删除成功', 'success');
        }
        return result?.data;
      } catch (error) {
        this.setError('删除搭配失败');
        showToast('删除搭配失败', 'error');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    // 切换搭配的喜欢状态
    async toggleLike(outfitId) {
      this.setLoading(true);
      this.clearError();

      try {
        const result = await outfitApi.toggleLike(outfitId);
        // 修复：API返回的数据结构是{ status, message, data }，所以需要访问result.data
        if (result?.data) {
          const index = this.outfits.findIndex(outfit => outfit.id === outfitId);
          if (index !== -1) {
            // 使用splice替换数组中的元素，确保Vue能够检测到变化
            this.outfits.splice(index, 1, result.data);
          }
          showToast(`搭配${result.data.liked ? '已收藏' : '已取消收藏'}`, 'success');
        }
        return result?.data;
      } catch (error) {
        this.setError('切换喜欢状态失败');
        showToast('切换喜欢状态失败', 'error');
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
        showToast('初始化搭配数据失败，请重试', 'error');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
  },
});
