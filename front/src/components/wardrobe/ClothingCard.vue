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
        :class="{ 'text-red-500': item.isFavorite, 'text-gray-400': !item.isFavorite }"
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
    <div v-if="item.isFavorite" class="absolute top-2 left-2 z-20 animate-bounce-in-mild">
      <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md">
        <font-awesome-icon :icon="['fas', 'heart']" class="text-white text-sm" />
        <span class="sr-only">已收藏</span>
      </div>
    </div>

    <!-- 图片区域（新增骨架屏，优化加载体验） -->
    <div class="aspect-[3/4] overflow-hidden relative">
      <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 z-10"></div>
      
      <!-- 骨架屏 -->
      <div v-if="!imgLoaded && !imgError" class="absolute inset-0 bg-gray-100 skeleton-pulse"></div>
      
      <!-- 主图片（懒加载+加载状态） -->
      <img
        v-show="!imgError"
        :src="getImageUrl(item)"
        :alt="item.name || '衣物图片'"
        :class="['w-full h-full object-cover transition-transform duration-500 group-hover:scale-105', imgLoaded ? 'loaded' : '']"
        @load="imgLoaded = true"
        @error="handleImgError"
        loading="lazy"
      />
      
      <!-- 图片加载失败兜底 -->
      <div v-if="imgError" class="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center gap-2">
        <font-awesome-icon :icon="['fas', 'tshirt']" class="text-gray-400 text-3xl" />
        <p class="text-xs text-gray-500">图片加载失败</p>
        <span class="sr-only">图片加载失败</span>
      </div>
    </div>

    <!-- 信息区域 -->
    <div class="p-3 bg-white border-t border-gray-100">
      <h3 class="font-semibold text-gray-900 truncate text-sm mb-1.5">{{ item.name || '未命名衣物' }}</h3>

      <!-- 标签区域（限制行数，避免溢出；提取通用样式） -->
      <div class="flex flex-wrap gap-1 mt-1.5 max-h-12 overflow-hidden">
          <span v-for="seasonId in validSeasons" :key="seasonId" class="clothing-tag season-tag">
            {{ getEnumLabel('seasons', seasonId) }}
          </span>
        <span
          v-if="item.color"
          class="clothing-tag color-tag"
        >
          {{ getEnumLabel('colors', item.color) }} 
        </span>
        <span
          v-if="item.brand"
          class="clothing-tag category-tag"
        >
          {{ item.brand }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, computed } from 'vue';
import { debounce } from 'lodash';
import { useEnumsStore } from '@/stores/modules/enumsStore';


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

// --- 计算属性（优化模板逻辑，提高可维护性） ---
// 处理季节数组，确保返回有效的季节ID数组
const validSeasons = computed(() => {
  const seasons = props.item?.season;
  if (!seasons) return [];
  
  // 确保是数组
  const seasonArray = Array.isArray(seasons) ? seasons : [seasons];
  // 过滤掉无效值
  return seasonArray.filter(seasonId => seasonId);
});

// 防抖函数（避免高频点击触发多次事件）
const debouncedEmit = debounce((event, data) => {
  isLoading.value = false;
  emit(event, data);
}, 300);

// --- 生命周期（清理资源，重置状态） ---
onUnmounted(() => {
  debouncedEmit.cancel(); // 取消未执行的防抖事件
});

// 获取图片URL（处理多种图片字段情况）
const getImageUrl = (item) => {
  
  let imageUrl = '';
  
  // 优先使用 mainImageUrl（主图URL）
  if (item.mainImageUrl) {
    imageUrl = item.mainImageUrl;
  } 
  // 其次使用 imageUrls 数组的第一张图片
  else if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
    imageUrl = item.imageUrls[0];
  } 
  // 兼容旧版 image 字段
  else if (item.image) {
    imageUrl = item.image;
  } 
  // 最后使用默认图片
  else {
    return `https://picsum.photos/seed/${item.id || 'default'}/300/300`;
  }
  // 处理相对路径，转换为前端代理路径
  if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
    // 使用相对路径，让前端代理处理
    return imageUrl;
  }
  
  return imageUrl;
};

// 监听图片URL变化，只在URL改变时重置图片状态
watch(() => getImageUrl(props.item), () => {
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
  
  if (typeof enumsStore.getLabel === 'function') {
    return enumsStore.getLabel(type, id) || '';
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

/* 骨架屏动画 - 优化为渐变效果 */
.skeleton-pulse {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

/* 图片淡入效果 */
img {
  opacity: 0;
  transition: opacity 0.3s ease-in;
}
img.loaded {
  opacity: 1;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
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