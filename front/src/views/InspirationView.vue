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
          <!-- 标题区域 -->
          <div
            class="relative py-16 px-6 mb-12 overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-indigo-50 via-white to-purple-50"
          >
            <!-- 异形背景基础层 - 使用clip-path创建流动形状 -->
            <div
              class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50"
              style="clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 15% 100%, 0 85%)"
            ></div>

            <!-- 异形背景装饰层1 - 增强流动感 -->
            <div
              class="absolute inset-0 -z-20 opacity-40 bg-gradient-to-br from-primary/10 via-white to-secondary/10"
              style="clip-path: polygon(0 5%, 100% 0, 100% 80%, 90% 100%, 10% 100%, 0 80%)"
            ></div>

            <!-- 异形背景装饰层2 - 创造层次感 -->
            <div
              class="absolute inset-x-0 top-0 h-32 -z-30 opacity-30 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"
              style="clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%)"
            ></div>

            <!-- 装饰性椭圆元素 - 增强视觉层次 -->
            <div
              class="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"
            ></div>
            <div
              class="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow"
              style="animation-delay: 1s"
            ></div>

            <!-- 动态装饰点 - 增加灵动性 -->
            <div class="absolute top-1/4 right-1/4 w-3 h-3 bg-primary rounded-full animate-ping"></div>
            <div
              class="absolute bottom-1/4 left-1/4 w-3 h-3 bg-secondary rounded-full animate-ping"
              style="animation-delay: 0.7s"
            ></div>

            <!-- 标题容器 -->
            <div class="text-center max-w-4xl mx-auto relative group">
              <!-- 装饰线条 -->
              <div class="flex items-center justify-center space-x-4 mb-6">
                <span class="h-[1px] w-16 bg-gradient-to-r from-transparent to-primary/30"></span>
                <span class="text-primary/70 text-sm uppercase tracking-widest font-medium">
                  Style Vault
                </span>
                <span class="h-[1px] w-16 bg-gradient-to-r from-primary/30 to-transparent"></span>
              </div>

              <!-- 标题文字 -->
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight inline-block">
                <!-- 主标题文本 - 柔和渐变效果 -->
                <span
                  class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-secondary"
                >
                  我的时尚灵感
                </span>
              </h1>

              <!-- 副标题 -->
              <p class="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
                探索和创建完美的服装搭配，展现你的个人风格。从已有的衣物中寻找灵感，打造独特造型。
              </p>

              <!-- 底部装饰元素 - 呼应异形背景 -->
              <div
                class="absolute -bottom-6 left-1/4 right-1/4 h-3 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                style="clip-path: polygon(0 50%, 100% 50%, 85% 100%, 15% 100%)"
              ></div>
            </div>
          </div>

          <!-- 视图切换按钮 -->
          <div class="flex justify-center mb-10">
            <div class="bg-gray-100 p-1 rounded-full inline-flex shadow-sm">
              <button
                @click="currentView = 'saved'"
                class="px-6 py-2 rounded-full font-medium transition-all duration-300"
                :class="currentView === 'saved' ? 'bg-white text-primary shadow-md' : 'text-gray-600 hover:text-gray-800'"
              >
                <i class="fas fa-heart mr-2"></i> 我的搭配
              </button>
              <button
                @click="currentView = 'create'"
                :disabled="clothingItems.length === 0"
                class="px-6 py-2 rounded-full font-medium transition-all duration-300"
                :class="currentView === 'create' ? 'bg-white text-primary shadow-md' : 'text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'"
              >
                <i class="fas fa-plus mr-2"></i> 创建搭配
              </button>
            </div>
          </div>

          <!-- 已保存搭配展示区域 -->
          <div v-show="currentView === 'saved'" class="transition-all duration-500 ease-in-out">
            <SavedOutfits
            :loadMore="loadMoreOutfits"
            :onLoadOutfit="loadOutfit"
            :onDeleteOutfit="deleteOutfit"
            @scroll-to-create="switchToCreateView"
            />
          </div>

          <!-- 创建搭配区域 -->
          <div v-show="currentView === 'create'" class="transition-all duration-500 ease-in-out">
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
      </div>
    </section>
  </ContentLayout>
</template>

<script setup>
  import { onMounted, computed, ref } from 'vue';
  import { useInspirationStore, useClothingStore } from '@/stores';
  import SavedOutfits from '@/components/features/inspiration/SavedOutfits.vue';
  import OutfitCreator from '@/components/organisms/OutfitCreator.vue';
  import ContentLayout from '@/components/layouts/ContentLayout.vue';

  const inspirationStore = useInspirationStore();
  const clothingStore = useClothingStore();
  const { isLoading, loadMoreOutfits, loadOutfit, deleteOutfit, initialize } = inspirationStore;

  const clothingItems = computed(() => clothingStore.clothingItems);

  // 当前视图状态，默认显示已保存的搭配
  const currentView = ref('saved');

  // 切换到创建搭配视图
  const switchToCreateView = () => {
    currentView.value = 'create';
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
