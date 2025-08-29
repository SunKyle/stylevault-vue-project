/**
 * OutfitCreator 服务层
 * 提供创建搭配的独立服务，解耦组件间通信
 */
import { ref, computed } from 'vue';
import { useInspirationStore } from '@/stores/modules/inspirationStore';
import { showToast } from '@/utils/toast';

export class OutfitCreatorService {
  constructor() {
    this.inspirationStore = useInspirationStore();
    this.setupReactivity();
    this.bindMethods();

    // 确保inspirationStore已初始化
    if (!this.inspirationStore) {
      throw new Error('InspirationStore 初始化失败');
    }
  }

  // 响应式数据
  setupReactivity() {
    this.outfitName = ref('');
    this.outfitScene = ref([]);
    this.outfitSeason = ref([]);
    this.outfitStyle = ref([]);
    this.outfitOccasion = ref([]);
    this.outfitColor = ref([]);
  }

  // 绑定方法上下文
  bindMethods() {
    this.toggleCloth = this.toggleCloth.bind(this);
    this.removeCloth = this.removeCloth.bind(this);
    this.resetClothes = this.resetClothes.bind(this);
    this.saveOutfit = this.saveOutfit.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.setTag = this.setTag.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  // 获取store数据
  get selectedClothes() {
    return this.inspirationStore.selectedClothes;
  }

  get filteredClothes() {
    return this.inspirationStore.filteredClothes;
  }

  get categories() {
    return this.inspirationStore.categories;
  }

  get tags() {
    return this.inspirationStore.tags;
  }

  // 核心操作方法
  toggleCloth(item) {
    this.inspirationStore.toggleCloth(item);
  }

  removeCloth(index) {
    this.inspirationStore.removeCloth(index);
    showToast('已从搭配中移除', 'info');
  }

  resetClothes() {
    this.inspirationStore.resetClothes();
    showToast('已清空搭配', 'info');
  }

  async saveOutfit() {
    if (!this.outfitName.value.trim()) {
      showToast('请输入搭配名称', 'error');
      return false;
    }

    if (this.selectedClothes.length === 0) {
      showToast('请至少选择一件衣物', 'error');
      return false;
    }

    try {
      await this.inspirationStore.saveOutfit({
        name: this.outfitName.value,
        scenes: this.outfitScene.value,
        seasons: this.outfitSeason.value,
        styles: this.outfitStyle.value,
      });

      // 重置表单
      this.resetForm();
      showToast('搭配保存成功！', 'success');
      return true;
    } catch (error) {
      showToast(error.message || '保存失败，请重试', 'error');
      return false;
    }
  }

  resetForm() {
    this.outfitName.value = '';
    this.outfitScene.value = [];
    this.outfitSeason.value = [];
    this.outfitStyle.value = [];
  }

  // 过滤器方法
  setCategory(category) {
    this.inspirationStore.setFilter('category', category);
  }

  setTag(tag) {
    this.inspirationStore.setFilter('tag', tag);
  }

  resetFilters() {
    this.inspirationStore.resetFilters();
  }

  // 拖拽支持
  handleDrop(item) {
    this.toggleCloth(item);
    showToast('已添加到搭配', 'success');
  }
}

// 组合式API封装
export function useOutfitCreator() {
  const service = new OutfitCreatorService();

  // 确保服务正确初始化
  if (!service.inspirationStore) {
    console.error('OutfitCreatorService: inspirationStore 未正确初始化');
  }

  return service;
}
