<template>
  <div class="mb-12">

    <!-- 已保存搭配区域 -->
    <div class="mb-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div class="flex items-center">
          <h2 class="text-2xl font-bold flex items-center">
            <font-awesome-icon :icon="['fas', 'heart']" class="text-primary mr-2" />
            我的搭配
          </h2>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium ml-3">
            {{ savedOutfits.length }}套方案
          </span>
        </div>

        <!-- 搜索和筛选区域 -->
        <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <!-- 搜索框 -->
          <div class="relative w-full md:w-64">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <font-awesome-icon :icon="['fas', 'search']" class="text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              placeholder="搜索搭配名称或标签..."
            />
          </div>

          <!-- 筛选按钮 -->
          <div class="relative">
            <button
              @click="toggleFilterPanel"
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-colors"
            >
              <font-awesome-icon :icon="['fas', 'filter']" />
              <span>筛选</span>
              <span
                v-if="activeFiltersCount > 0"
                class="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ activeFiltersCount }}
              </span>
            </button>

            <!-- 筛选面板 -->
            <div
              v-if="showFilterPanel"
              class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 p-5"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium text-gray-900">筛选条件</h3>
                <button @click="resetFilters" class="text-sm text-primary hover:text-primary/80">
                  重置
                </button>
              </div>

              <!-- 场景筛选 -->
              <div class="mb-5">
                <h4 class="text-sm font-medium text-gray-700 mb-2">场景</h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="scene in sceneOptions"
                    :key="scene.value"
                    @click="toggleFilter('scene', scene.value)"
                    class="px-3 py-1.5 text-xs rounded-full transition-colors"
                    :class="
                      filters.scene.includes(scene.value)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    "
                  >
                    {{ scene.label }}
                  </button>
                </div>
              </div>

              <!-- 季节筛选 -->
              <div class="mb-5">
                <h4 class="text-sm font-medium text-neutral-700 mb-2">季节</h4>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    v-for="season in seasonOptions"
                    :key="season.value"
                    @click="toggleFilter('season', season.value)"
                    :class="[
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300',
                      {
                        // 选中状态使用主题色
                        'bg-primary text-white shadow-md': filters.season.includes(season.value),
                        // 默认状态
                        'bg-white text-neutral-700 border border-neutral-200 hover:border-primary':
                          !filters.season.includes(season.value),
                      },
                      // 为不同季节添加特有的微妙背景色
                      getSeasonBackgroundClass(season.value),
                    ]"
                  >
                    {{ season.label }}
                  </button>
                </div>
              </div>

              <!-- 风格筛选 -->
              <div class="mb-5">
                <h4 class="text-sm font-medium text-gray-700 mb-2">风格</h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="style in styleOptions"
                    :key="style.value"
                    @click="toggleFilter('style', style.value)"
                    class="px-3 py-1.5 text-xs rounded-full transition-colors"
                    :class="
                      filters.style.includes(style.value)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    "
                  >
                    {{ style.label }}
                  </button>
                </div>
              </div>

              <!-- 应用筛选按钮 -->
              <button
                @click="applyFilters"
                class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors mt-2"
              >
                应用筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前筛选条件显示 -->
      <div v-if="activeFiltersCount > 0" class="mb-6 flex flex-wrap gap-2">
        <span class="text-sm text-gray-600">当前筛选:</span>
        <div v-for="(filter, type) in activeFilters" :key="type" class="flex flex-wrap gap-2">
          <span
            v-for="value in filter"
            :key="value"
            class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {{ getFilterLabel(type, value) }}
            <button @click="removeFilter(type, value)" class="hover:text-primary/80">
              <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
            </button>
          </span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <!-- 装饰元素 -->
        <div class="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/5 rounded-full"></div>

        <!-- 已保存搭配列表 -->
        <div v-if="visibleOutfits.length > 0" class="relative z-10">
          <!-- 搭配卡片自适应网格布局 -->
          <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <OutfitCard
              v-for="outfit in visibleOutfits"
              :key="outfit.id"
              :outfit="outfit"
              @load-outfit="props.onLoadOutfit($event)"
              @delete-outfit="props.onDeleteOutfit($event)"
            />
          </div>

          <!-- 分页控制 -->
          <div class="mt-10 relative z-10">
            <!-- 每页数量选择 -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">每页显示:</span>
                <select
                  v-model="pageSize"
                  @change="handlePageSizeChange"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option v-for="size in pageSizeOptions" :key="size" :value="size">
                    {{ size }}
                  </option>
                </select>
                <span class="text-sm text-gray-600">套</span>
              </div>
              <div class="text-sm text-gray-600">
                共 {{ savedOutfits.length }} 套搭配，显示第 {{ startIndex }}-{{ endIndex }} 套
              </div>
            </div>

            <!-- 分页导航 -->
            <div class="flex justify-center">
              <div class="inline-flex items-center gap-1">
                <!-- 上一页按钮 -->
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-sm" />
                </button>

                <!-- 页码按钮 -->
                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-2 rounded-lg transition-colors',
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>

                <!-- 下一页按钮 -->
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 - 增强视觉吸引力 -->
        <div
          v-else
          class="text-center py-20 border border-dashed border-neutral-200 rounded-xl relative z-10 bg-gradient-to-b from-white to-neutral-50 max-w-2xl mx-auto"
        >
          <!-- 装饰元素 -->
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
          <div
            class="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl"
          ></div>

          <div
            class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 hover:scale-110"
          >
            <font-awesome-icon :icon="['fas', 'heart']" class="text-primary text-3xl" />
          </div>
          <p class="text-neutral-600 text-lg mb-3 font-medium">暂无保存的搭配方案</p>
          <p class="text-neutral-400 text-sm mb-8 max-w-sm mx-auto">
            创建您的第一套搭配方案，开始记录和探索您的时尚灵感
          </p>
          <button
            @click="$emit('scroll-to-create')"
            class="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
          >
            开始创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useInspirationStore } from '@/stores';
  import { useEnumsStore } from '@/stores/modules/enumsStore';
  import OutfitCard from '@/components/molecules/OutfitCard.vue';

  // 定义props
  const props = defineProps({
    onLoadOutfit: {
      type: Function,
      required: true
    },
    onDeleteOutfit: {
      type: Function,
      required: true
    }
  });

  const inspirationStore = useInspirationStore();
  const enumsStore = useEnumsStore();
  const { isLoading } = inspirationStore;
  const savedOutfits = computed(() => inspirationStore.savedOutfits);
  const visibleOutfits = computed(() => inspirationStore.visibleOutfits);
  const seasonOptions = computed(() => enumsStore.getOptions('seasons'));
  const styleOptions = computed(() => enumsStore.getOptions('styles'));
  const sceneOptions = computed(() => enumsStore.getOptions('scenes'));
  const searchQuery = computed(() => inspirationStore.filters.search);
  const filters = computed(() => inspirationStore.filters);
  const showFilterPanel = ref(false);

  // 分页相关状态
  const pageSizeOptions = [4, 8, 12, 16, 20, 24];
  const pageSize = computed({
    get: () => inspirationStore.pagination.pageSize,
    set: (value) => {
      inspirationStore.pagination.pageSize = value;
    }
  });
  const currentPage = computed({
    get: () => inspirationStore.pagination.page,
    set: (value) => {
      inspirationStore.pagination.page = value;
    }
  });

  // 计算属性
  const totalPages = computed(() => {
    return Math.ceil(savedOutfits.value.length / pageSize.value);
  });

  const startIndex = computed(() => {
    return (currentPage.value - 1) * pageSize.value + 1;
  });

  const endIndex = computed(() => {
    const end = currentPage.value * pageSize.value;
    return Math.min(end, savedOutfits.value.length);
  });

  // 页码显示逻辑
  const pageNumbers = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;
    
    // 始终显示第一页
    if (total > 0) {
      pages.push(1);
    }
    
    // 显示当前页附近的页码
    if (current > 3) {
      pages.push('...');
    }
    
    for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
      pages.push(i);
    }
    
    if (current < total - 2) {
      pages.push('...');
    }
    
    // 始终显示最后一页
    if (total > 1) {
      pages.push(total);
    }
    
    return pages;
  });

  // 组件加载时获取枚举值
  onMounted(() => {
    enumsStore.fetchAllEnums();
  });

  // 监听筛选条件变化，重置分页
  watch(() => [
    filters.value.scene.length,
    filters.value.season.length,
    filters.value.style.length,
    filters.value.search
  ], () => {
    currentPage.value = 1;
  });

  // 事件定义
  defineEmits([
    'scroll-to-create'
  ]);

  // 筛选和搜索功能方法
  // 切换筛选面板显示
  function toggleFilterPanel() {
    showFilterPanel.value = !showFilterPanel.value;
  }

  // 切换筛选条件
  function toggleFilter(type, value) {
    const index = filters.value[type].indexOf(value);
    if (index > -1) {
      filters.value[type].splice(index, 1);
    } else {
      filters.value[type].push(value);
    }
  }

  // 应用筛选（仅关闭面板）
  function applyFilters() {
    showFilterPanel.value = false;
  }

  // 重置筛选
  function resetFilters() {
    Object.assign(filters.value, {
      scene: [],
      season: [],
      style: [],
    });
  }

  // 移除单个筛选条件
  function removeFilter(type, value) {
    const index = filters.value[type].indexOf(value);
    if (index > -1) {
      filters.value[type].splice(index, 1);
    }
  }

  // 获取筛选条件标签
  function getFilterLabel(type, value) {
    const optionsMap = {
      scene: sceneOptions.value || [],
      season: seasonOptions.value || [],
      style: styleOptions.value || []
    };
    
    const options = optionsMap[type] || [];
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  // 为不同季节添加特有的背景色，增强视觉识别性
  const getSeasonBackgroundClass = season => {
    const seasonColors = {
      spring: 'hover:bg-green-50',
      summer: 'hover:bg-yellow-50',
      autumn: 'hover:bg-orange-50',
      winter: 'hover:bg-blue-50',
      // 其他季节可以根据需要添加
    };

    return seasonColors[season.toLowerCase()] || '';
  };

  // 计算当前激活的筛选条件数量
  const activeFiltersCount = computed(() => {
    return filters.value.scene.length + filters.value.season.length + filters.value.style.length;
  });

  // 激活的筛选标签
  const activeFilters = computed(() => ({
    scene: filters.value.scene || [],
    season: filters.value.season || [],
    style: filters.value.style || [],
  }));

  // 分页方法
  function handlePageSizeChange() {
    currentPage.value = 1;
    // 滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function goToPage(page) {
    if (page > 0 && page <= totalPages.value && page !== currentPage.value) {
      currentPage.value = page;
      // 滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
</script>

<style scoped>
  /* 自定义滚动条样式 */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  /* 悬停动画增强 */
  .group:hover .text-primary {
    color: theme('colors.primary', #3b82f6);
  }

  /* 卡片悬停效果增强 */
  .shadow-md {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.03);
  }

  .shadow-lg {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.08),
      0 4px 6px -2px rgba(0, 0, 0, 0.04);
  }
</style>
