import { ref, computed } from 'vue';
import { outfitCreatorApi } from '../apiClient';
import { useInspirationStore } from '@/stores/modules/inspirationStore';
import { useEnumsStore } from '@/stores/modules/enumsStore';
import { useOutfitStore } from '@/stores/modules/outfitStore';
import { showToast } from '@/utils/toast';

// 搭配创建器服务
export function useOutfitCreator() {
  const inspirationStore = useInspirationStore();
  const enumsStore = useEnumsStore();
  const outfitStore = useOutfitStore();

  // 状态管理 - 直接引用 inspirationStore 的 selectedClothes，统一数据源
  const outfitName = ref('');
  const outfitScene = ref('');
  const outfitSeason = ref('');
  const outfitStyle = ref('');
  const loading = ref(false);

  // 从枚举store获取分类和标签
  const categories = computed(() => {
    return enumsStore.getOptions('categories') || [];
  });

  const tags = computed(() => {
    // 这里可以从enumsStore获取更多标签类型
    const allTags = [];

    // 添加风格标签
    const styleOptions = enumsStore.getOptions('styles');
    if (styleOptions) {
      styleOptions.forEach(style => {
        allTags.push({ ...style, type: 'style' });
      });
    }

    // 添加季节标签
    const seasonOptions = enumsStore.getOptions('seasons');
    if (seasonOptions) {
      seasonOptions.forEach(season => {
        allTags.push({ ...season, type: 'season' });
      });
    }

    return allTags;
  });

  // 过滤后的衣物
  const filteredClothes = computed(() => {
    return inspirationStore.clothes || [];
  });

  // 切换衣物选中状态 - 使用 inspirationStore 的方法
  const toggleCloth = cloth => {
    inspirationStore.toggleClothSelection(cloth);
  };

  // 移除衣物 - 使用 inspirationStore 的方法
  const removeCloth = clothId => {
    inspirationStore.removeFromSelection(clothId);
  };

  // 重置选中的衣物
  const resetClothes = () => {
    inspirationStore.clearSelection();
    outfitName.value = '';
    outfitScene.value = '';
    outfitSeason.value = '';
    outfitStyle.value = '';
  };

  // 设置分类
  const setCategory = category => {
    inspirationStore.setCategoryFilter(category);
  };

  // 设置标签
  const setTag = tag => {
    if (tag.type === 'style') {
      inspirationStore.setStyleFilter(tag.value);
    } else if (tag.type === 'season') {
      inspirationStore.setSeasonFilter(tag.value);
    }
  };

  // 重置过滤器
  const resetFilters = () => {
    inspirationStore.resetFilters();
  };

  // 保存搭配
  const saveOutfit = async () => {
    if (!outfitName.value.trim()) {
      showToast('请输入搭配名称', 'warning');
      return;
    }

    // 使用统一的 selectedClothes 数据源
    const selectedItems = inspirationStore.selectedClothes;
    if (selectedItems.length === 0) {
      showToast('请至少选择一件衣物', 'warning');
      return;
    }

    loading.value = true;

    try {
      const outfitData = {
        name: outfitName.value,
        scene: outfitScene.value,
        season: outfitSeason.value,
        style: outfitStyle.value,
        clothingIds: selectedItems.map(cloth => cloth.id),
        clothingItems: selectedItems,
      };

      const response = await outfitCreatorApi.saveOutfit(outfitData);

      showToast('搭配保存成功', 'success');
      resetClothes();

      // 刷新搭配列表
      outfitStore.fetchOutfits();

      return response;
    } catch (error) {
      showToast('保存失败，请重试', 'error');
      console.error('保存搭配失败:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 初始化 - 加载必要数据
  const initialize = async () => {
    try {
      // 确保枚举数据已加载
      if (!enumsStore.isLoaded) {
        await enumsStore.fetchAllEnums();
      }

      // 加载衣物数据
      await inspirationStore.initialize();
    } catch (error) {
      console.error('初始化搭配创建器失败:', error);
    }
  };

  // 初始化服务
  initialize();

  return {
    // 状态
    outfitName,
    outfitScene,
    outfitSeason,
    outfitStyle,
    // selectedClothes 统一使用 inspirationStore.selectedClothes
    loading,
    categories,
    tags,
    filteredClothes,
    inspirationStore,

    // 方法
    toggleCloth,
    removeCloth,
    resetClothes,
    setCategory,
    setTag,
    resetFilters,
    saveOutfit,
  };
}
