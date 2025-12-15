<template>
  <div
    class="clothing-card group relative cursor-pointer rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    :style="{ '--animation-delay': `${delay}ms` }"
    @click="handleCardClick"
  >
    <!-- 操作按钮组（提取公共样式类，减少重复） -->
    <div class="card-actions absolute top-2 right-2 z-20 flex flex-col space-y-2 opacity-0 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
      <!-- 收藏按钮 -->
      <button
        @click.stop="handleToggleFavorite"
        class="card-action-btn"
        :class="{ 'text-red-500': item.favorite, 'text-gray-400': !item.favorite }"
        :disabled="isLoading"
      >
        <font-awesome-icon :icon="['fas', 'heart']" class="text-sm" />
        <span class="sr-only">收藏/取消收藏</span>
      </button>
      <!-- 编辑按钮 -->
      <button
        @click.stop="handleEditItem"
        class="card-action-btn text-blue-500 hover:text-blue-600"
        :disabled="isLoading"
      >
        <font-awesome-icon :icon="['fas', 'edit']" class="text-sm" />
        <span class="sr-only">编辑衣物</span>
      </button>
      <!-- 删除按钮 -->
      <button
        @click.stop="handleDeleteItem"
        class="card-action-btn text-red-500 hover:text-red-600"
        :disabled="isLoading"
      >
        <font-awesome-icon :icon="['fas', 'trash-alt']" class="text-sm" />
        <span class="sr-only">删除衣物</span>
      </button>
      <!-- 详情按钮 -->
      <button
        @click.stop="handleViewDetail"
        class="card-action-btn text-indigo-500 hover:text-indigo-600"
        :disabled="isLoading"
      >
        <font-awesome-icon :icon="['fas', 'info']" class="text-sm" />
        <span class="sr-only">查看详情</span>
      </button>
    </div>

    <!-- 收藏标记（优化动画，更柔和） -->
    <div v-if="item.favorite" class="absolute top-2 left-2 z-20 animate-bounce-in-mild">
      <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md">
        <font-awesome-icon :icon="['fas', 'heart']" class="text-white text-sm" />
        <span class="sr-only">已收藏</span>
      </div>
    </div>

    <!-- 图片区域（新增骨架屏，优化加载体验） -->
    <div class="aspect-[3/4] overflow-hidden relative">
      <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 z-10"></div>
      
      <!-- 图片骨架屏（加载中） -->
      <!-- <div v-if="!imgLoaded && !imgError" class="absolute inset-0 bg-gray-100 skeleton-pulse flex items-center justify-center">
        <font-awesome-icon :icon="['fas', 'tshirt']" class="text-gray-300 text-3xl" />
      </div> -->
      
      <!-- 主图片（懒加载+加载状态） -->
      <img
        v-show="!imgError"
        :src="item.image || `https://picsum.photos/seed/${item.id}/300/300`"
        :alt="item.name || '衣物图片'"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        @load="imgLoaded = true"
        @error="handleImgError"
        loading="lazy"
      />
      
      <!-- 图片加载失败兜底 -->
      <div v-if="imgError" class="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <font-awesome-icon :icon="['fas', 'tshirt']" class="text-gray-400 text-3xl" />
        <span class="sr-only">图片加载失败</span>
      </div>
    </div>

    <!-- 信息区域 -->
    <div class="p-3 bg-white border-t border-gray-100">
      <h3 class="font-semibold text-gray-900 truncate text-sm mb-1.5">{{ item.name || '未命名衣物' }}</h3>

      <div class="flex items-center text-xs text-gray-500 mb-2">
        <span v-if="item.brand" class="truncate">{{ item.brand }}</span>
        <span v-else class="text-gray-400">无品牌</span>
      </div>

      <!-- 标签区域（限制行数，避免溢出；提取通用样式） -->
      <div class="flex flex-wrap gap-1 mt-1.5 max-h-12 overflow-hidden">
        <span class="clothing-tag season-tag">
          {{ getEnumLabel('season', item.season) || '四季' }}
        </span>
        <span
          v-if="item.color"
          class="clothing-tag color-tag"
        >
          {{ item.color }}
        </span>
        <span
          v-if="item.category || item.category_id"
          class="clothing-tag category-tag"
        >
          {{ item.category?.name || getEnumLabel('category', item.category_id) || item.category }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onUpdated } from 'vue';
import { debounce } from 'lodash';
import { useEnumsStore } from '@/stores';

// 枚举映射表（集中管理，便于维护）
const ENUM_GETTER_MAP = {
  category: 'getCategoryLabel',
  style: 'getStyleLabel',
  color: 'getColorLabel',
  season: 'getSeasonLabel',
  material: 'getMaterialLabel',
  pattern: 'getPatternLabel',
  size: 'getSizeLabel',
  condition: 'getConditionLabel',
  status: 'getStatusLabel',
  occasion: 'getOccasionLabel',
};

// --- Props 定义（增强校验，减少运行时错误） ---
const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (val) => {
      // 确保item有有效ID
      return val && (typeof val.id === 'string' || typeof val.id === 'number');
    }
  },
  delay: {
    type: Number,
    default: 0,
    validator: (val) => val >= 0 // 确保延迟为非负数
  }
});

const emit = defineEmits(['toggle-favorite', 'edit-item', 'delete-item', 'view-detail']);

// --- 状态管理（优化重置逻辑，避免复用污染） ---
const enumsStore = useEnumsStore();
const imgError = ref(false);
const imgLoaded = ref(false);
const isLoading = ref(false); // 按钮加载状态

// 防抖函数（避免高频点击触发多次事件）
const debouncedEmit = debounce((event, data) => {
  isLoading.value = false;
  emit(event, data);
}, 300);

// --- 生命周期（清理资源，重置状态） ---
onUnmounted(() => {
  debouncedEmit.cancel(); // 取消未执行的防抖事件
});

onUpdated(() => {
  // 组件更新时重置图片状态，避免复用组件时的状态残留
  imgError.value = false;
  imgLoaded.value = false;
});

// --- 事件处理（增加参数校验+加载状态） ---
// 卡片点击（查看详情）
const handleCardClick = () => {
  if (isLoading.value) return;
  emit('view-detail', props.item);
};

// 切换收藏
const handleToggleFavorite = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  debouncedEmit('toggle-favorite', props.item);
};

// 编辑物品
const handleEditItem = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  debouncedEmit('edit-item', props.item);
};

// 删除物品
const handleDeleteItem = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  debouncedEmit('delete-item', props.item);
};

// 查看详情
const handleViewDetail = () => {
  if (isLoading.value) return;
  isLoading.value = true;
  debouncedEmit('view-detail', props.item);
};

// 图片加载失败处理
const handleImgError = () => {
  imgError.value = true;
  imgLoaded.value = true;
};

// 获取枚举标签（复用常量，增加类型校验）
const getEnumLabel = (type, id) => {
  if (!id || !type) return '';
  
  const getter = ENUM_GETTER_MAP[type];
  if (getter && typeof enumsStore[getter] === 'function') {
    return enumsStore[getter](id) || '';
  }
  
  return String(id); // 确保返回字符串，避免渲染错误
};
</script>

<style scoped>
/* 卡片基础样式（语义化命名，减少重复） */
.clothing-card {
  --animation-delay: 0ms;
  transition-delay: var(--animation-delay);
}

/* 操作按钮公共样式（提取重复样式，统一管理） */
.card-actions {
  transition-delay: var(--animation-delay) !important;
}
.card-action-btn {
  @apply w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-sm;
}
/* 按钮禁用状态（避免重复点击） */
.card-action-btn:disabled {
  @apply opacity-70 cursor-not-allowed hover:scale-100;
}

/* 标签通用样式（提取重复样式，分类管理） */
.clothing-tag {
  @apply text-xs px-2 py-1 rounded-md border truncate;
}
.season-tag {
  @apply bg-blue-50 text-gray-600 border-blue-100;
}
.color-tag {
  @apply bg-purple-50 text-gray-600 border-purple-100;
}
.category-tag {
  @apply bg-green-50 text-gray-600 border-green-100;
}

/* 动画优化（更柔和，减少视觉突兀） */
.animate-bounce-in-mild {
  animation: bounce-in-mild 0.5s ease-out;
}

.skeleton-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 无障碍访问样式（适配屏幕阅读器） */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(100%); /* 替代废弃的 clip: rect(0 0 0 0) */
  border: 0;
  white-space: nowrap; /* 关键：防止文字换行暴露 */
}

/* 关键帧动画（集中定义，便于修改） */
@keyframes bounce-in-mild {
  0% { transform: scale(0.9); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>