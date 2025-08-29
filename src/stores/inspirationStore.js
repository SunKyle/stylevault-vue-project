import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { useClothingStore } from './clothingStore';
import { useOutfitStore } from './outfitStore';

export const useInspirationStore = defineStore('inspiration', () => {
  // 依赖其他store
  const clothingStore = useClothingStore();
  const outfitStore = useOutfitStore();

  // 本地状态
  const filters = reactive({
    category: '全部',
    tag: '',
    search: '',
    scene: [],
    season: [],
    style: [],
  });

  const pagination = reactive({
    page: 1,
    pageSize: 12,
    hasMore: true,
  });

  const selectedClothes = ref([]);
  const isLoading = ref(false);

  // 计算属性 - 缓存优化
  const clothes = computed(() => clothingStore.clothingItems);
  const savedOutfits = computed(() => outfitStore.allOutfits);

  const categories = computed(() => ['全部', ...clothingStore.categories.map(c => c.name)]);

  const tags = computed(() => {
    const uniqueTags = new Set(['最近穿着']);
    clothes.value.forEach(item => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach(tag => uniqueTags.add(tag));
      }
    });
    return Array.from(uniqueTags);
  });

  // 筛选后的衣物
  const filteredClothes = computed(() => {
    return clothes.value.filter(item => {
      const matchCategory = filters.category === '全部' || item.category === filters.category;
      const matchTag = !filters.tag || item.tags?.includes(filters.tag);
      const matchSearch =
        !filters.search ||
        item.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.type?.toLowerCase().includes(filters.search.toLowerCase());

      return matchCategory && matchTag && matchSearch;
    });
  });

  // 分页数据
  const visibleOutfits = computed(() => {
    const start = 0;
    const end = pagination.page * pagination.pageSize;
    return savedOutfits.value.slice(start, end);
  });

  // 兼容属性
  const hasMore = computed(() => pagination.hasMore);
  const loadMoreOutfits = loadMore;

  // 方法
  const setFilter = (type, value) => {
    if (type === 'category') filters.category = value;
    else if (type === 'tag') filters.tag = value;
    else if (type === 'search') filters.search = value;
    else if (['scene', 'season', 'style'].includes(type)) {
      const arr = filters[type];
      const index = arr.indexOf(value);
      index > -1 ? arr.splice(index, 1) : arr.push(value);
    }
    pagination.page = 1; // 重置分页
  };

  const resetFilters = () => {
    filters.category = '全部';
    filters.tag = '';
    filters.search = '';
    filters.scene = [];
    filters.season = [];
    filters.style = [];
    pagination.page = 1;
  };

  const toggleCloth = item => {
    const index = selectedClothes.value.findIndex(i => i.id === item.id);
    index === -1 ? selectedClothes.value.push(item) : selectedClothes.value.splice(index, 1);
  };

  const removeCloth = index => {
    selectedClothes.value.splice(index, 1);
  };

  const resetClothes = () => {
    selectedClothes.value = [];
  };

  const loadMore = () => {
    const currentEnd = pagination.page * pagination.pageSize;
    pagination.hasMore = currentEnd < savedOutfits.value.length;
    if (pagination.hasMore) {
      pagination.page++;
    }
  };

  const saveOutfit = async outfitInfo => {
    if (selectedClothes.value.length === 0) {
      throw new Error('请至少选择一件衣物');
    }

    const newOutfit = {
      title: outfitInfo.name,
      description: outfitInfo.description || '',
      items: [...selectedClothes.value],
      occasion: outfitInfo.scene || '日常',
      tag: outfitInfo.tag || '未分类',
      liked: false,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    await outfitStore.addOutfit(newOutfit);
    resetClothes();
  };

  const loadOutfit = outfit => {
    selectedClothes.value = [...(outfit.items || [])];
  };

  const deleteOutfit = async outfit => {
    await outfitStore.removeOutfit(outfit.title);
  };

  // 初始化
  const initialize = async () => {
    isLoading.value = true;
    try {
      const promises = [outfitStore.fetchOutfits()];

      if (clothingStore.categories.length === 0) {
        promises.push(clothingStore.fetchCategories());
      }
      if (clothingStore.clothingItems.length === 0) {
        promises.push(clothingStore.fetchClothingItems());
      }

      await Promise.all(promises);
      pagination.hasMore = savedOutfits.value.length > pagination.pageSize;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // 状态
    filters,
    pagination,
    selectedClothes,
    isLoading,

    // 计算属性
    clothes,
    savedOutfits,
    categories,
    tags,
    filteredClothes,
    visibleOutfits,
    hasMore,

    // 方法
    setFilter,
    resetFilters,
    toggleCloth,
    removeCloth,
    resetClothes,
    loadMore,
    loadMoreOutfits,
    saveOutfit,
    loadOutfit,
    deleteOutfit,
    initialize,
  };
});
