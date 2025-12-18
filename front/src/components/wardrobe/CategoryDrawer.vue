<template>
  <!-- 遮罩层 -->
  <transition name="fade">
    <div
      v-if="isDrawerOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-55"
      @click="handleCloseDrawer"
    ></div>
  </transition>

  <!-- 抽屉主体 -->
  <transition
    enter-active-class="slide-up-enter-active"
    leave-active-class="slide-up-leave-active"
    enter-from-class="slide-up-enter-from"
    enter-to-class="slide-up-enter-to"
    leave-from-class="slide-up-leave-from"
    leave-to-class="slide-up-leave-to"
    @after-enter="logAnimationTime"
  >
    <div
      v-if="isDrawerOpen"
      class="fixed inset-x-4 bottom-4 top-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col transform origin-bottom"
      @click.stop
    >
      <!-- 顶部导航栏（拆分组件） -->
      <DrawerHeader
        :is-search-mode="isSearchMode"
        :category-name="selectedCategoryName"
        :item-count="categoryItemCount"
        :category-icon="categoryIcon"
        @close="handleCloseDrawer"
        @apply-filter="handleApplyFilter"
        @apply-sort="handleApplySort"
        :current-filter="currentFilter"
        :current-sort="currentSort"
      />

      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex items-center justify-center h-full py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>

        <!-- 衣物列表 -->
        <template v-else>
          <!-- 有数据时 -->
          <div v-if="categoryItems.length > 0" class="space-y-6">
            <transition-group
              name="staggered-fade"
              tag="div"
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            >
              <ClothingCard
                v-for="(item, index) in categoryItems"
                :key="item.id"
                :item="item"
                :delay="index * 50"
                @toggle-favorite="handleToggleFavorite"
                @edit-item="handleEditItem"
                @delete-item="handleDeleteItem"
                @view-detail="handleViewItemDetail"
              />
            </transition-group>
          </div>

          <!-- 空状态（拆分组件） -->
          <EmptyState
            v-else
            :category-icon="categoryIcon"
            :is-search-mode="isSearchMode"
            :category-name="selectedCategoryName"
            @show-upload="handleShowUpload"
          />
        </template>
      </div>

      <!-- 底部操作栏 -->
      <div class="bg-white border-t border-gray-200 p-3 flex justify-between items-center">
        <button
          class="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
          @click="switchView('grid')"
        >
          <font-awesome-icon :icon="['fas', 'th-large']" />
          <span class="text-sm">网格视图</span>
        </button>
        <button
          class="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
          @click="switchView('list')"
        >
          <font-awesome-icon :icon="['fas', 'list']" />
          <span class="text-sm">列表视图</span>
        </button>
        <button
          @click="handleShowUpload"
          class="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-1"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>添加衣物</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { debounce } from 'lodash';
import { useClothingStore } from '@/stores';
import DrawerHeader from './DrawerHeader.vue';
import ClothingCard from './ClothingCard.vue';
import EmptyState from './EmptyState.vue';

// --- Props 定义（新增注释+校验） ---
/**
 * 分类抽屉组件
 * @props {boolean} isDrawerOpen - 是否显示抽屉
 * @props {boolean} isSearchMode - 是否为搜索模式
 * @props {string|null} selectedCategory - 选中的分类ID
 * @props {Function} getCategoryItems - 获取分类衣物列表
 * @props {Function} getSelectedCategoryName - 获取选中分类名称
 * @props {Function} getCategoryItemCount - 获取分类衣物数量
 */
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true
  },
  isSearchMode: {
    type: Boolean,
    required: true
  },
  selectedCategory: {
    type: [String, Number, null],
    required: true
  },
  getCategoryItems: {
    type: Function,
    required: true
  },
  getSelectedCategoryName: {
    type: Function,
    required: true
  },
  getCategoryItemCount: {
    type: Function,
    required: true
  }
});

const emit = defineEmits([
  'closeDrawer',
  'showUpload',
  'toggle-favorite',
  'viewItemDetail',
  'editItem',
  'deleteItem',
  'applyFilter',
  'applySort'
]);

// --- 状态管理 ---
const currentFilter = ref('all');
const currentSort = ref(null);
const isLoading = ref(false);
const viewMode = ref('grid');
const clothingStore = useClothingStore();

// --- 计算属性（缓存结果，避免重复调用） ---
// 缓存分类衣物列表
const categoryItems = computed(() => {
  return props.getCategoryItems(props.selectedCategory) || [];
});

// 缓存分类名称
const selectedCategoryName = computed(() => {
  return props.getSelectedCategoryName() || '未分类';
});

// 缓存分类数量
const categoryItemCount = computed(() => {
  return props.getCategoryItemCount(props.selectedCategory) || 0;
});

// 分类图标
const categoryIcon = computed(() => {
  if (props.isSearchMode) return 'search.png';
  if (!props.selectedCategory || props.selectedCategory === 'all') return 'tag';

  try {
    const categories = Array.isArray(clothingStore.categories) ? clothingStore.categories : [];
    const category = categories.find(c => c.id === props.selectedCategory);
    console.log('找到的分类:', category);
    return (category?.icon?.trim() || 'tag');
  } catch (error) {
    console.error('获取分类图标失败:', error);
    return 'tag';
  }
});

// --- 事件处理（防抖+参数校验） ---
// 防抖函数（300ms）
const debouncedEmit = debounce((event, ...args) => {
  emit(event, ...args);
}, 300);

// 关闭抽屉
const handleCloseDrawer = () => {
  emit('closeDrawer');
};

// 显示上传
const handleShowUpload = () => {
  emit('showUpload');
};

// 切换收藏
const handleToggleFavorite = (item) => {
  if (!item?.id) return;
  debouncedEmit('toggle-favorite', item);
};

// 查看详情
const handleViewItemDetail = (item) => {
  if (!item?.id) return;
  debouncedEmit('viewItemDetail', item);
};

// 编辑物品
const handleEditItem = (item) => {
  if (!item?.id) return;
  debouncedEmit('editItem', item);
};

// 删除物品
const handleDeleteItem = (item) => {
  if (!item?.id) return;
  debouncedEmit('deleteItem', item);
};

// 应用筛选
const handleApplyFilter = (filterType) => {
  if (!filterType) return;
  currentFilter.value = filterType;
  emit('applyFilter', filterType);
};

// 应用排序
const handleApplySort = (sortType) => {
  currentSort.value = currentSort.value === sortType ? null : sortType;
  emit('applySort', currentSort.value);
};

// 切换视图模式
const switchView = (mode) => {
  if (!['grid', 'list'].includes(mode)) return;
  viewMode.value = mode;
};

// 动画时间日志（仅开发环境）
const logAnimationTime = () => {
  if (process.env.NODE_ENV === 'development') {
    console.timeEnd('动画持续时间');
  }
};

// --- 组件卸载清理 ---
onUnmounted(() => {
  debouncedEmit.cancel();
});
</script>

<style scoped>
/* 基础过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 抽屉滑入滑出动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}
.slide-up-enter-active {
  animation-name: slideUpIn;
}
.slide-up-leave-active {
  animation-name: slideUpOut;
}
.slide-up-enter-from {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}
.slide-up-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.slide-up-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.slide-up-leave-to {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}

/* 列表渐入动画 */
.staggered-fade-enter-active {
  transition: all 0.5s;
}
.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.staggered-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 自定义滚动条（跨浏览器兼容） */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.2) transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.4);
}

/* 关键帧动画 */
@keyframes slideUpIn {
  from {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
@keyframes slideUpOut {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
}
</style>