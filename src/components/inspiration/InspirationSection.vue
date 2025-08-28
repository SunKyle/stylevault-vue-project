<template>
  <section class="py-10">
    <div class="container mx-auto px-4">
      <!-- 已保存搭配展示区域 -->
      <SavedOutfits
        :savedOutfits="savedOutfits"
        :currentPage="currentPage"
        :itemsPerPage="itemsPerPage"
        :totalPages="totalPages"
        :currentPageOutfits="currentPageOutfits"
        @load-outfit="loadOutfit"
        @delete-outfit="deleteOutfit"
        @share-outfit="shareOutfit"
        @page-change="currentPage = $event"
        @scroll-to-create="scrollToCreateSection"
      />

      <!-- 创建搭配区域 -->
      <OutfitCreator
        :selectedClothes="selectedClothes"
        :clothes="clothes"
        :categories="categories"
        :tags="tags"
        :activeCategory="activeCategory"
        :activeTag="activeTag"
        :filteredClothes="filteredClothes"
        @toggle-cloth="toggleCloth"
        @remove-cloth="removeCloth"
        @reset-clothes="resetClothes"
        @save-outfit="saveOutfit"
        @category-change="activeCategory = $event"
        @tag-change="activeTag = $event"
        @reset-filters="
          activeCategory = '全部';
          activeTag = '';
        "
      />
    </div>
  </section>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useClothingStore } from '@/stores';
  import { useOutfitStore } from '../../stores/outfitStore';
  import { scenesMockData, getClothesWithTags } from '../../mock/wardrobe';
  import SavedOutfits from './SavedOutfits.vue';
  import OutfitCreator from './OutfitCreator.vue';

  const clothingStore = useClothingStore();
  const outfitStore = useOutfitStore();
  const categories = computed(() => ['全部', ...clothingStore.categories.map(c => c.name)]);

  // 分页相关数据
  const currentPage = ref(1);
  const itemsPerPage = ref(4);
  const isLoading = ref(true);

  // 从store获取数据
  const clothes = ref([]);
  const savedOutfits = computed(() => outfitStore.allOutfits);

  // 监听clothingItems变化
  watch(
    () => clothingStore.clothingItems,
    newItems => {
      if (newItems.length > 0) {
        clothes.value = getClothesWithTags(newItems);
      }
    },
    { immediate: true }
  );

  // 获取标签
  const allTags = computed(() => {
    const tagSet = new Set();
    clothes.value.forEach(item => {
      item.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  });

  const tags = computed(() => ['最近穿着', ...allTags.value]);
  const activeCategory = ref('全部');
  const activeTag = ref('');
  const selectedClothes = ref([]);

  // 计算分页数据
  const currentPageOutfits = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return savedOutfits.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(savedOutfits.value.length / itemsPerPage.value);
  });

  // 组件挂载时初始化数据
  onMounted(async () => {
    await outfitStore.fetchOutfits();
    isLoading.value = false;

    // 异步加载其他数据
    Promise.all([
      clothingStore.categories.length === 0 ? clothingStore.fetchCategories() : Promise.resolve(),
      clothingStore.clothingItems.length === 0
        ? clothingStore.fetchClothingItems()
        : Promise.resolve(),
    ]).catch(error => {
      console.error('加载数据失败:', error);
    });
  });

  const filteredClothes = computed(() => {
    return clothes.value.filter(item => {
      const catMatch = activeCategory.value === '全部' || item.category === activeCategory.value;
      const tagMatch = !activeTag.value || item.tags.includes(activeTag.value);
      return catMatch && tagMatch;
    });
  });

  // 操作方法
  function toggleCloth(item) {
    const index = selectedClothes.value.findIndex(i => i.name === item.name);
    if (index === -1) {
      selectedClothes.value.push(item);
    } else {
      selectedClothes.value.splice(index, 1);
    }
  }

  function removeCloth(idx) {
    selectedClothes.value.splice(idx, 1);
  }

  function resetClothes() {
    selectedClothes.value = [];
  }

  function scrollToCreateSection() {
    const element = document.getElementById('create-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // 使用store的方法替代直接localStorage操作
  async function saveOutfit(outfitInfo) {
    if (selectedClothes.value.length === 0) {
      alert('请至少选择一件衣物');
      return;
    }

    const newOutfit = {
      name: outfitInfo.name,
      scene: outfitInfo.scene || undefined,
      items: [...selectedClothes.value],
      createdAt: new Date(),
    };

    try {
      await outfitStore.addOutfit(newOutfit);
      alert('穿搭方案已保存！');
      resetClothes();
    } catch (error) {
      console.error('保存搭配失败:', error);
      alert('保存失败，请重试');
    }
  }

  function loadOutfit(outfit) {
    selectedClothes.value = Array.isArray(outfit.items) ? [...outfit.items] : [];
  }

  async function deleteOutfit(outfit) {
    if (confirm('确定要删除这个搭配方案吗？')) {
      try {
        await outfitStore.removeOutfit(outfit.id);
      } catch (error) {
        console.error('删除搭配失败:', error);
        alert('删除失败，请重试');
      }
    }
  }

  function shareOutfit(outfit) {
    // 使用store的分享功能
    outfitStore.shareOutfit(outfit);
  }
</script>
