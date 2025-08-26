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
          <!-- 搭配卡片网格布局 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(outfit, index) in currentPageOutfits" :key="outfit.id"
                 class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-neutral-100 flex flex-col h-full transform hover:-translate-y-1">
              <!-- 搭配预览 - 优化后的卡片顶部 -->
              <div class="relative overflow-hidden">
                <!-- 卡片顶部渐变背景 -->
                <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 transform transition-transform duration-700 group-hover:scale-110"></div>

                <!-- 装饰元素 - 增强卡片深度感 -->
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>

                <!-- 卡片内容 -->
                <div class="p-5 h-56 flex flex-col relative z-10">
                  <!-- 评分和操作按钮组 -->
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                      <font-awesome-icon :icon="['fas', 'tshirt']" class="text-yellow-400 text-xs mr-1" />
                      <span class="text-xs font-medium text-neutral-800">
                        {{ getOutfitRating(outfit) }}分
                      </span>
                    </div>
                    <div class="relative group/menu">
                      <button class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-neutral-600 transition-colors hover:bg-primary hover:text-white">
                        <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" class="text-xs" />
                      </button>
                      <!-- 下拉菜单 -->
                      <div class="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform origin-top-right scale-95 group-hover/menu:scale-100">
                        <button @click="$emit('load-outfit', outfit)" class="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center">
                          <font-awesome-icon :icon="['fas', 'redo']" class="text-primary text-xs mr-2" />
                          加载搭配
                        </button>
                        <button @click="$emit('share-outfit', outfit)" class="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center">
                          <font-awesome-icon :icon="['fas', 'share-nodes']" class="text-blue-500 text-xs mr-2" />
                          分享搭配
                        </button>
                        <button @click="$emit('delete-outfit', index)" class="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500 flex items-center">
                          <font-awesome-icon :icon="['fas', 'trash']" class="text-xs mr-2" />
                          删除搭配
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 标题区域 -->
                  <div class="mb-3">
                    <h4 class="font-bold text-neutral-800 text-lg truncate pr-2 group-hover:text-primary transition-colors">
                      {{ outfit.name }}
                    </h4>
                    <div v-if="outfit?.scene" class="flex items-center mt-1">
                      <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary text-xs mr-1" />
                      <span class="text-xs text-primary font-medium">{{ outfit?.scene || '' }}</span>
                    </div>
                  </div>

                  <!-- 衣物预览区 - 增强的3D堆叠效果 -->
                  <div class="flex-1 flex items-center justify-center relative">
                    <div v-for="(item, idx) in (outfit?.items || []).slice(0, 6)" :key="idx"
                         class="absolute group/item transition-all duration-500 ease-out"
                         :style="{
                           transform: `translate(${(idx - 2.5) * 18}px, ${Math.abs(idx - 2.5) * -6}px) rotate(${(idx - 2.5) * 5}deg) scale(${0.85 - Math.abs(idx - 2.5) * 0.08})`,
                           zIndex: 5 - Math.abs(idx - 2.5)
                         }">
                      <img :src="item.img" :alt="item.name"
                           class="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-md border-2 border-white transition-all duration-500 group-hover/item:scale-115 group-hover/item:z-30 group-hover/item:rotate-0"
                           loading="lazy" />
                      <div class="absolute inset-x-0 -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none text-center whitespace-nowrap z-10">
                        {{ item.name }}
                      </div>
                    </div>

                    <!-- 更多衣物指示器 - 改进样式 -->
                    <div v-if="outfit?.items?.length > 6" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md animate-pulse">
                      +{{ (outfit?.items?.length || 0) - 6 }}
                    </div>

                    <!-- 空状态 - 增强设计 -->
                    <div v-if="(outfit?.items?.length || 0) === 0" class="text-center text-neutral-400 p-4">
                      <div class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2">
                        <font-awesome-icon :icon="['fas', 'tshirt']" class="text-xl" />
                      </div>
                      <p class="text-sm">暂无衣物</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 搭配信息 -->
              <div class="p-5 flex-1 flex flex-col bg-white">
                <!-- 日期和操作按钮（移动端） -->
                <div class="flex justify-between items-center mb-3 md:hidden">
                  <span class="text-xs text-neutral-500">{{ outfit?.createdAt ? formatDate(outfit.createdAt) : '-' }}</span>
                  <div class="flex gap-1">
                    <button @click="$emit('load-outfit', outfit)"
                            class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                            title="加载搭配">
                      <font-awesome-icon :icon="['fas', 'redo']" class="text-xs" />
                    </button>
                    <button @click="$emit('delete-outfit', index)"
                            class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            title="删除搭配">
                      <font-awesome-icon :icon="['fas', 'trash']" class="text-xs" />
                    </button>
                  </div>
                </div>

                <!-- 衣物类型统计 - 优化样式和交互 -->
                <div class="mb-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3 transform transition-all duration-300 group-hover:shadow-md">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-medium text-neutral-700 flex items-center">
                      <font-awesome-icon :icon="['fas', 'layer-group']" class="mr-1 text-primary" />
                      衣物组成
                    </span>
                    <span class="text-xs bg-white text-primary px-2 py-0.5 rounded-full font-medium shadow-sm">
                      {{ outfit?.items?.length || 0 }}件
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(count, type) in getOutfitStats(outfit?.items || [])" :key="type"
                          class="text-xs bg-white text-neutral-700 px-3 py-1.5 rounded-md border border-neutral-100 shadow-sm flex items-center transform transition-all duration-300 hover:scale-105 hover:bg-primary/5 hover:border-primary/20">
                      <span class="w-2 h-2 rounded-full bg-primary mr-1.5"></span>
                      {{ type }}: {{ count }}
                    </span>
                  </div>
                </div>

                <!-- 场景和标签 - 增强视觉层次 -->
                <div class="mb-4 space-y-3">
                  <!-- 场景信息 - 增强视觉吸引力 -->
                  <div v-if="outfit?.scene" class="transform transition-all duration-300 group-hover:translate-x-1">
                    <div class="text-xs font-medium text-neutral-700 mb-2 flex items-center">
                      <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary mr-1" />
                      适用场景
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span class="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-100 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-300">
                        <span class="w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>
                        {{ outfit?.scene || '' }}
                      </span>
                    </div>
                  </div>

                  <!-- 风格标签 - 增强交互体验 -->
                  <div v-if="getOutfitTags(outfit?.items || []).length > 0" class="transform transition-all duration-300 group-hover:translate-x-1">
                    <div class="text-xs font-medium text-neutral-700 mb-2">风格标签</div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="tag in getOutfitTags(outfit?.items || []).slice(0, 4)" :key="tag"
                            class="inline-flex items-center bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-md text-xs font-medium border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <span class="w-2 h-2 rounded-full bg-primary mr-1.5"></span>
                        {{ tag }}
                      </span>
                      <span v-if="getOutfitTags(outfit?.items || []).length > 4"
                            class="inline-flex items-center bg-neutral-50 text-neutral-600 px-3 py-1.5 rounded-md text-xs font-medium border border-neutral-200 hover:border-neutral-300 transition-all duration-300">
                        <span class="w-2 h-2 rounded-full bg-neutral-300 mr-1.5"></span>
                        +{{ getOutfitTags(outfit?.items || []).length - 4 }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 底部信息 - 增强交互体验和视觉层次 -->
                <div class="mt-auto pt-4 border-t border-neutral-100">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-xs text-neutral-500 hidden md:block flex items-center">
                      <font-awesome-icon :icon="['fas', 'calendar']" class="mr-1" />
                      {{ outfit?.createdAt ? formatDate(outfit.createdAt) : '-' }}
                    </span>
                    <!-- 互动数据 - 增强视觉反馈 -->
                    <div class="hidden md:flex items-center gap-3 text-xs text-neutral-500">
                      <button class="flex items-center hover:text-primary transition-colors group/like">
                        <font-awesome-icon :icon="['far', 'heart']" class="mr-1 group-hover/like:text-red-500 transition-colors duration-300" />
                        <span>{{ getRandomLikes() }}</span>
                      </button>
                      <button class="flex items-center hover:text-primary transition-colors group/comment">
                        <font-awesome-icon :icon="['far', 'comment']" class="mr-1 group-hover/comment:text-blue-500 transition-colors duration-300" />
                        <span>{{ getRandomComments() }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- 主要操作按钮 - 增强视觉反馈 -->
                  <button @click="$emit('load-outfit', outfit)"
                          class="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md transform hover:-translate-y-1 active:translate-y-0">
                    <font-awesome-icon :icon="['fas', 'eye']" class="mr-2" />
                    <span>查看详情</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页控件 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-110"
            :class="{
              'bg-primary text-white shadow-md': currentPage === page,
              'bg-neutral-100 text-neutral-600 hover:bg-neutral-200': currentPage !== page
            }"
            @click="$emit('page-change', page)"
          >
            {{ page }}
          </button>
        </div>

        <!-- 空状态 - 增强视觉吸引力 -->
        <div v-else class="text-center py-20 border border-dashed border-neutral-200 rounded-xl relative z-10 bg-gradient-to-b from-white to-neutral-50">
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

// 获取搭配评分（模拟）
function getOutfitRating(outfit) {
  // 基于衣物数量和搭配多样性计算评分
  if (!outfit.items || outfit.items.length === 0) return 0

  // 基础分 5 分
  let baseScore = 5

  // 衣物数量加分 (最多 3 分)
  const quantityBonus = Math.min(Math.floor(outfit.items.length / 2), 3)

  // 搭配多样性加分 (最多 2 分)
  const types = new Set(outfit.items.map(item => item.type.split(' · ')[0]))
  const diversityBonus = Math.min(types.size - 1, 2)

  return baseScore + quantityBonus + diversityBonus
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
