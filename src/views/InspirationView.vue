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
          v-else-if="clothes.length === 0 || savedOutfits.length === 0"
          class="text-center py-20"
        >
          <!-- 无衣物状态 -->
          <template v-if="clothes.length === 0">
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
          </template>

          <!-- 有衣物无搭配状态 -->
          <template v-else-if="clothes.length > 0 && savedOutfits.length === 0">
            <div class="text-gray-400 mb-4">
              <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">还没有搭配方案</h3>
            <p class="text-gray-600 mb-4">用你已有的衣物创建第一个搭配吧！</p>
          </template>
        </div>

        <!-- 主要内容 -->
        <div v-else-if="clothes.length > 0 && savedOutfits.length > 0">
          <!-- 已保存搭配展示区域 -->
          <SavedOutfits
            v-show="savedOutfits.length > 0"
            :savedOutfits="visibleOutfits"
            :allOutfits="savedOutfits"
            :hasMore="hasMore"
            :isLoading="isLoading"
            @load-outfit="loadOutfit"
            @delete-outfit="deleteOutfit"
            @share-outfit="shareOutfit"
            @load-more="loadMoreOutfits"
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
  import { useClothingStore } from '@/stores/clothingStore';
  import { useOutfitStore } from '@/stores/outfitStore';
  import SavedOutfits from '@/components/inspiration/SavedOutfits.vue';
  import OutfitCreator from '@/components/inspiration/OutfitCreator.vue';
  import ContentLayout from '@/components/layout/ContentLayout.vue';

  const clothingStore = useClothingStore();
  const outfitStore = useOutfitStore();
  const categories = computed(() => ['全部', ...clothingStore.categories.map(c => c.name)]);

  // 核心状态管理
  const isLoading = ref(true);

  // 从store获取数据
  const clothes = computed(() => clothingStore.clothingItems);
  const savedOutfits = computed(() => outfitStore.allOutfits);

  // 懒加载状态
  const visibleOutfits = ref([]);
  const pageSize = ref(12);
  const hasMore = ref(true);

  // 标签计算 - 使用Set去重，优化性能
  const tags = computed(() => {
    const uniqueTags = new Set(['最近穿着']);
    clothes.value.forEach(item => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach(tag => uniqueTags.add(tag));
      }
    });
    return Array.from(uniqueTags);
  });
  const activeCategory = ref('全部');
  const activeTag = ref('');
  const selectedClothes = ref([]);

  // 懒加载方法
  function updateVisibleOutfits() {
    const start = 0;
    const end = pageSize.value;
    visibleOutfits.value = savedOutfits.value.slice(start, end);
    hasMore.value = end < savedOutfits.value.length;
  }

  function loadMoreOutfits() {
    if (!hasMore.value) return;

    const currentLength = visibleOutfits.value.length;
    const newItems = savedOutfits.value.slice(currentLength, currentLength + pageSize.value);
    visibleOutfits.value = [...visibleOutfits.value, ...newItems];
    hasMore.value = visibleOutfits.value.length < savedOutfits.value.length;
  }

  // 数据初始化
  onMounted(async () => {
    try {
      const promises = [outfitStore.fetchOutfits()];

      // 仅当数据不存在时获取
      if (clothingStore.categories.length === 0) {
        promises.push(clothingStore.fetchCategories());
      }
      if (clothingStore.clothingItems.length === 0) {
        promises.push(clothingStore.fetchClothingItems());
      }

      await Promise.all(promises);
      updateVisibleOutfits();
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      isLoading.value = false;
    }
  });

  // 监听搭配数据变化，更新可见数据
  watch(() => savedOutfits.value, updateVisibleOutfits, { deep: true });

  // 衣物筛选 - 简洁的条件判断
  const filteredClothes = computed(() => {
    return clothes.value.filter(item => {
      const matchCategory =
        activeCategory.value === '全部' || item.category === activeCategory.value;
      const matchTag = !activeTag.value || item.tags?.includes(activeTag.value);
      return matchCategory && matchTag;
    });
  });

  // 操作方法 - 简洁实用
  const toggleCloth = item => {
    const index = selectedClothes.value.findIndex(i => i.id === item.id);
    index === -1 ? selectedClothes.value.push(item) : selectedClothes.value.splice(index, 1);
  };

  const removeCloth = idx => selectedClothes.value.splice(idx, 1);
  const resetClothes = () => (selectedClothes.value = []);

  const scrollToCreateSection = () => {
    const element = document.querySelector('.outfit-creator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // 业务方法 - 统一错误处理
  const saveOutfit = async outfitInfo => {
    if (selectedClothes.value.length === 0) {
      alert('请至少选择一件衣物');
      return;
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

    try {
      await outfitStore.addOutfit(newOutfit);
      alert('穿搭方案已保存！');
      resetClothes();
    } catch (error) {
      console.error('保存搭配失败:', error);
      alert('保存失败，请重试');
    }
  };

  const loadOutfit = outfit => {
    selectedClothes.value = [...(outfit.items || [])];
  };

  const deleteOutfit = async outfit => {
    if (!confirm('确定要删除这个搭配方案吗？')) return;

    try {
      await outfitStore.removeOutfit(outfit.title);
    } catch (error) {
      console.error('删除搭配失败:', error);
      alert('删除失败，请重试');
    }
  };

  const shareOutfit = async outfit => {
    const shareData = {
      title: `搭配方案: ${outfit.title}`,
      text: `分享我的穿搭方案：${outfit.description || '无描述'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        alert('已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请重试');
    }
  };
</script>

<style scoped>
  /* 响应式样式优化 */
  @media (max-width: 768px) {
    section {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  /* 加载动画优化 */
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
