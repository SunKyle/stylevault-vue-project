<template>
  <div class="mb-12">
    <!-- 页面标题 -->
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        我的时尚灵感
      </h1>
      <p class="text-neutral-500 max-w-2xl mx-auto">
        探索和创建完美的服装搭配，展现你的个人风格。从已有的衣物中寻找灵感，打造独特造型。
      </p>
    </div>

    <!-- 已保存搭配区域 -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold flex items-center">
          <font-awesome-icon :icon="['fas', 'heart']" class="text-primary mr-2" />
          我的搭配
        </h2>
        <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {{ savedOutfits.length }}套方案
        </span>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <!-- 装饰元素 -->
        <div class="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/5 rounded-full"></div>

        <!-- 已保存搭配列表 -->
        <div v-if="savedOutfits.length > 0" class="relative z-10">
          <!-- 搭配卡片自适应网格布局 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <OutfitCard 
              v-for="outfit in currentPageOutfits" 
              :key="outfit.id" 
              :outfit="outfit"
              @load-outfit="$emit('load-outfit', $event)"
              @delete-outfit="handleDeleteOutfit"
              @edit-outfit="handleEditOutfit"
            />
          </div>
        </div>

        <!-- 分页控件 - 优化设计 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <div class="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-neutral-100">
            <!-- 上一页按钮 -->
            <button 
              @click="$emit('page-change', Math.max(1, currentPage - 1))"
              :disabled="currentPage === 1"
              class="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
              :class="currentPage === 1 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'"
            >
              <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </button>

            <!-- 页码显示 -->
            <div class="flex items-center px-2">
              <span class="text-sm font-medium text-neutral-700">{{ currentPage }}</span>
              <span class="text-sm text-neutral-400 mx-1">/</span>
              <span class="text-sm text-neutral-500">{{ totalPages }}</span>
            </div>

            <!-- 下一页按钮 -->
            <button 
              @click="$emit('page-change', Math.min(totalPages, currentPage + 1))"
              :disabled="currentPage === totalPages"
              class="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
              :class="currentPage === totalPages ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary'"
            >
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button>
          </div>
        </div>

        <!-- 空状态 - 增强视觉吸引力 -->
        <div v-else class="text-center py-20 border border-dashed border-neutral-200 rounded-xl relative z-10 bg-gradient-to-b from-white to-neutral-50 max-w-2xl mx-auto">
          <!-- 装饰元素 -->
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
          <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/5 rounded-full blur-xl"></div>

          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 hover:scale-110">
            <font-awesome-icon :icon="['fas', 'heart']" class="text-primary text-3xl" />
          </div>
          <p class="text-neutral-600 text-lg mb-3 font-medium">暂无保存的搭配方案</p>
          <p class="text-neutral-400 text-sm mb-8 max-w-sm mx-auto">创建您的第一套搭配方案，开始记录和探索您的时尚灵感</p>
          <button @click="$emit('scroll-to-create')"
                  class="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95">
            开始创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import OutfitCard from './OutfitCard.vue'

// Props定义
const props = defineProps({
  savedOutfits: {
    type: Array,
    default: () => []
  },
  currentPage: {
    type: Number,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    default: 4
  }
})

// 事件定义
const emit = defineEmits(['load-outfit', 'delete-outfit', 'share-outfit', 'page-change', 'scroll-to-create'])

// 计算当前页要显示的搭配
const currentPageOutfits = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  // 过滤掉无效的搭配对象
  return props.savedOutfits.slice(start, end).filter(outfit => outfit && outfit.id && outfit.name)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.savedOutfits.length / props.itemsPerPage)
})

// 格式化日期
function formatDate(date) {
  const d = new Date(date)
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
}

// 获取搭配衣物类型统计
function getOutfitStats(items) {
  const stats = {}
  items.forEach(item => {
    // 提取类型（如"上衣"、"裤子"等）
    const type = item.type.split(' · ')[0]
    if (stats[type]) {
      stats[type]++
    } else {
      stats[type] = 1
    }
  })
  return stats
}

// 获取搭配标签
function getOutfitTags(items) {
  const tags = new Set()
  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
}

// 处理删除搭配事件
function handleDeleteOutfit(outfitId) {
  // 找到搭配在数组中的索引
  const index = props.savedOutfits.findIndex(outfit => outfit.id === outfitId)
  if (index !== -1) {
    emit('delete-outfit', index)
  }
}

// 处理编辑搭配事件
function handleEditOutfit(editedOutfit) {
  // 找到搭配在数组中的索引
  const index = props.savedOutfits.findIndex(outfit => outfit.id === editedOutfit.id)
  if (index !== -1) {
    // 更新搭配信息
    const updatedOutfit = {
      ...props.savedOutfits[index],
      name: editedOutfit.name,
      scene: editedOutfit.scene
    }
    // 发送编辑事件
    emit('edit-outfit', { index, outfit: updatedOutfit })
  }
}

// 获取随机点赞数（模拟）
function getRandomLikes() {
  return Math.floor(Math.random() * 100) + 1
}

// 获取随机评论数（模拟）
function getRandomComments() {
  return Math.floor(Math.random() * 20) + 1
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}
</style>
