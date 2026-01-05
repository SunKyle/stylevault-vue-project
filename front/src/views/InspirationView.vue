<template>
  <ContentLayout>
    <section class="py-10">
      <div class="container mx-auto px-4">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span class="ml-3 text-gray-600">加载搭配灵感中...</span>
        </div>

        <!-- 主要内容 -->
        <div v-else>
          <!-- 已保存搭配展示区域 -->
          <SavedOutfits
      :loadMore="loadMoreOutfits"
      :onLoadOutfit="loadOutfit"
      :onDeleteOutfit="deleteOutfit"
      @scroll-to-create="scrollToCreateSection"
    />

          <!-- 创建搭配区域 -->
          <div v-if="clothingItems.length > 0">
            <OutfitCreator />
          </div>
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center mb-12">
            <div class="text-gray-400 mb-4">
              <i class="fas fa-tshirt text-6xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">还没有添加衣物</h3>
            <p class="text-gray-600 mb-6">请先添加一些衣物，然后开始创建你的搭配方案</p>
            <router-link to="/clothing/add" class="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
              <i class="fas fa-plus mr-2"></i> 添加衣物
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </ContentLayout>
</template>

<script setup>
  import { onMounted, computed } from 'vue';
  import { useInspirationStore, useClothingStore } from '@/stores';
  import SavedOutfits from '@/components/features/inspiration/SavedOutfits.vue';
  import OutfitCreator from '@/components/organisms/OutfitCreator.vue';
  import ContentLayout from '@/components/layouts/ContentLayout.vue';

  const inspirationStore = useInspirationStore();
  const clothingStore = useClothingStore();
  const { isLoading, loadMoreOutfits, loadOutfit, deleteOutfit, initialize } = inspirationStore;

  const clothingItems = computed(() => clothingStore.clothingItems);



  const scrollToCreateSection = () => {
    const element = document.getElementById('create-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始化数据
  onMounted(() => {
    initialize();
  });
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
