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
            :onShareOutfit="shareOutfit"
            @scroll-to-create="scrollToCreateSection"
          />

          <!-- 创建搭配区域 -->
          <OutfitCreator v-show="clothes.length > 0" />
        </div>
      </div>
    </section>
  </ContentLayout>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useInspirationStore } from '@/stores';
  import SavedOutfits from '@/components/inspiration/SavedOutfits.vue';
  import OutfitCreator from '@/components/inspiration/OutfitCreator.vue';
  import ContentLayout from '@/components/layout/ContentLayout.vue';

  const inspirationStore = useInspirationStore();

  // 直接从store解构，只包含使用的变量
  const { clothes, isLoading } = inspirationStore;

  // 方法直接委托给store，只包含使用的方法
  const { loadMoreOutfits, loadOutfit, deleteOutfit, initialize } = inspirationStore;

  const scrollToCreateSection = () => {
    const element = document.querySelector('.outfit-creator');
    element?.scrollIntoView({ behavior: 'smooth' });
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
