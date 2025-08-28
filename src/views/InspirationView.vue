<template>
  <ContentLayout>
    <section class="py-10">
      <div class="container mx-auto px-4">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span class="ml-3 text-gray-600">加载搭配灵感中...</span>
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="!isLoading && savedOutfits.length === 0 && clothes.length === 0"
          class="text-center py-20"
        >
          <div class="text-gray-400 mb-4">
            <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7H2a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zm6 3H9v12h6V6z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无搭配灵感</h3>
          <p class="text-gray-600 mb-4">先添加一些衣物，然后开始创建你的第一个搭配吧！</p>
          <button
            @click="$router.push('/upload')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            添加衣物
          </button>
        </div>

        <!-- 主要内容 -->
        <div v-else>
          <!-- 已保存搭配展示区域 -->
          <SavedOutfits
            v-show="savedOutfits.length > 0"
            :savedOutfits="savedOutfits"
            :currentPage="currentPage"
            :itemsPerPage="itemsPerPage"
            :totalPages="totalPages"
            :currentPageOutfits="currentPageOutfits"
            :isLoading="isLoading"
            @load-outfit="loadOutfit"
            @delete-outfit="deleteOutfit"
            @share-outfit="shareOutfit"
            @page-change="currentPage = $event"
            @scroll-to-create="scrollToCreateSection"
          />

          <!-- 创建搭配区域 -->
          <OutfitCreator
            v-show="clothes.length > 0"
            :selectedClothes="selectedClothes"
            :clothes="clothes"
            :categories="categories"
            :tags="tags"
            :activeCategory="activeCategory"
            :activeTag="activeTag"
            :filteredClothes="filteredClothes"
            :isLoading="isLoading"
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
      </div>
    </section>
  </ContentLayout>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useClothingStore } from '@/stores';
  import { useOutfitStore } from '../stores/outfitStore';
  import { scenesMockData } from '../mock/data';
  import { wardrobeAPI } from '../mock/wardrobe';
  import SavedOutfits from '../components/inspiration/SavedOutfits.vue';
  import OutfitCreator from '../components/inspiration/OutfitCreator.vue';
  import ContentLayout from '../components/layout/ContentLayout.vue';

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
        clothes.value = wardrobeAPI.getClothesWithTags(newItems);
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

<style scoped>
  .inspiration-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  @media (max-width: 768px) {
    .inspiration-container {
      padding: 1rem;
    }
  }
</style>
