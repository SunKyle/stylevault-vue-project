<template>
  <div class="mb-12">
    <!-- 页面标题 - 异形背景设计 -->
    <!-- 页面标题 - 调整为与内容区域协调的风格 -->
    <div class="relative py-16 px-6 mb-12 overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <!-- 异形背景基础层 - 使用clip-path创建流动形状 -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50" style="clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 15% 100%, 0 85%);"></div>
      
      <!-- 异形背景装饰层1 - 增强流动感 -->
      <div class="absolute inset-0 -z-20 opacity-40 bg-gradient-to-br from-primary/10 via-white to-secondary/10" style="clip-path: polygon(0 5%, 100% 0, 100% 80%, 90% 100%, 10% 100%, 0 80%);"></div>
      
      <!-- 异形背景装饰层2 - 创造层次感 -->
      <div class="absolute inset-x-0 top-0 h-32 -z-30 opacity-30 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" style="clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);"></div>
      
      <!-- 装饰性椭圆元素 - 增强视觉层次 -->
      <div class="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
      
      <!-- 动态装饰点 - 增加灵动性 -->
      <div class="absolute top-1/4 right-1/4 w-3 h-3 bg-primary rounded-full animate-ping"></div>
      <div class="absolute bottom-1/4 left-1/4 w-3 h-3 bg-secondary rounded-full animate-ping" style="animation-delay: 0.7s;"></div>
      
      <!-- 标题容器 -->
      <div class="text-center max-w-4xl mx-auto relative group">
        <!-- 装饰线条 -->
        <div class="flex items-center justify-center space-x-4 mb-6">
          <span class="h-[1px] w-16 bg-gradient-to-r from-transparent to-primary/30"></span>
          <span class="text-primary/70 text-sm uppercase tracking-widest font-medium">Style Vault</span>
          <span class="h-[1px] w-16 bg-gradient-to-r from-primary/30 to-transparent"></span>
        </div>
        
        <!-- 标题文字 -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight inline-block">
          <!-- 主标题文本 - 柔和渐变效果 -->
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-dark to-secondary">我的时尚灵感</span>
        </h1>
        
        <!-- 副标题 -->
        <p class="text-neutral-600 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
          探索和创建完美的服装搭配，展现你的个人风格。从已有的衣物中寻找灵感，打造独特造型。
        </p>
        
        <!-- 底部装饰元素 - 呼应异形背景 -->
        <div class="absolute -bottom-6 left-1/4 right-1/4 h-3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" style="clip-path: polygon(0 50%, 100% 50%, 85% 100%, 15% 100%);"></div>
      </div>
    </div>

    <!-- 已保存搭配区域 -->
    <div class="mb-12">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div class="flex items-center">
          <h2 class="text-2xl font-bold flex items-center">
            <font-awesome-icon :icon="['fas', 'heart']" class="text-primary mr-2" />
            我的搭配
          </h2>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium ml-3">
            {{ filteredOutfits.length }}套方案
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
              <span v-if="activeFiltersCount > 0" class="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ activeFiltersCount }}
              </span>
            </button>
            
            <!-- 筛选面板 -->
            <div v-if="showFilterPanel" class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 p-5">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium text-gray-900">筛选条件</h3>
                <button @click="resetFilters" class="text-sm text-primary hover:text-primary/80">
                  重置
                </button>
              </div>
              
              <!-- 场景筛选 -->
              <div class="mb-5">
                <h4 class="text-sm font-medium text-gray-700 mb-2">场景</h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="scene in sceneOptions"
                    :key="scene.value"
                    @click="toggleFilter('scene', scene.value)"
                    class="px-3 py-1.5 text-xs rounded-full transition-colors"
                    :class="filters.scene.includes(scene.value) 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  >
                    {{ scene.label }}
                  </button>
                </div>
              </div>
              
              <!-- 季节筛选 -->
              <div class="mb-5">
                <h4 class="text-sm font-medium text-gray-700 mb-2">季节</h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="season in seasonOptions"
                    :key="season.value"
                    @click="toggleFilter('season', season.value)"
                    class="px-3 py-1.5 text-xs rounded-full transition-colors"
                    :class="filters.season.includes(season.value) 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
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
                    :class="filters.style.includes(style.value) 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
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
        <div v-if="currentPageOutfits.length > 0" class="relative z-10">
          <!-- 搭配卡片自适应网格布局 -->
          <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <OutfitCard 
              v-for="outfit in currentPageOutfits" 
              :key="outfit.id" 
              :outfit="outfit"
              @load-outfit="$emit('load-outfit', $event)"
              @delete-outfit="handleDeleteOutfit"
              @edit-outfit="handleEditOutfit"
            />
          </div>

          <!-- 分页控件和显示模式切换 - 优化设计 -->
          <div v-if="filteredOutfits.length > props.itemsPerPage" class="flex justify-between items-center mt-8 px-4">
            <!-- 显示模式切换按钮 -->
            <button
              @click="toggleDisplayMode"
              class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
              :title="expandedDisplay ? '收起显示' : '展开显示'"
            >
              <font-awesome-icon 
                :icon="['fas', expandedDisplay ? 'compress-alt' : 'expand-alt']" 
                class="text-gray-600" 
              />
              <span class="text-sm text-gray-700">{{ expandedDisplay ? '收起' : '展开' }}</span>
            </button>
            
            <!-- 分页控件 -->
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
import { ref, computed } from 'vue'
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
  // 如果处于展开状态，显示双倍数量的卡片
  const itemsToShow = expandedDisplay.value ? props.itemsPerPage * 2 : props.itemsPerPage
  const start = (props.currentPage - 1) * props.itemsPerPage
  const end = start + itemsToShow
  // 使用已经过滤后的搭配数据
  return filteredOutfits.value.slice(start, end)
})

// 搜索和筛选状态
const searchQuery = ref('')
const showFilterPanel = ref(false)

// 显示模式状态
const expandedDisplay = ref(false)
const filters = ref({
  scene: [],
  season: [],
  style: []
})
const appliedFilters = ref({
  scene: [],
  season: [],
  style: []
})

// 筛选选项
const sceneOptions = [
  { value: 'daily', label: '日常' },
  { value: 'work', label: '工作' },
  { value: 'party', label: '聚会' },
  { value: 'date', label: '约会' },
  { value: 'travel', label: '旅行' },
  { value: 'sports', label: '运动' }
]

const seasonOptions = [
  { value: 'spring', label: '春季' },
  { value: 'summer', label: '夏季' },
  { value: 'autumn', label: '秋季' },
  { value: 'winter', label: '冬季' }
]

const styleOptions = [
  { value: 'casual', label: '休闲' },
  { value: 'formal', label: '正式' },
  { value: 'business', label: '商务' },
  { value: 'street', label: '街头' },
  { value: 'vintage', label: '复古' },
  { value: 'minimalist', label: '极简' }
]

// 计算过滤后的搭配
const filteredOutfits = computed(() => {
  return props.savedOutfits.filter(outfit => {
    // 基本过滤
    if (!outfit || (!outfit.id && !outfit.name)) return false
    
    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const nameMatch = outfit.name && outfit.name.toLowerCase().includes(query)
      const sceneMatch = outfit.scene && outfit.scene.toLowerCase().includes(query)
      const tagsMatch = outfit.tags && outfit.tags.some(tag => tag.toLowerCase().includes(query))
      
      if (!nameMatch && !sceneMatch && !tagsMatch) return false
    }
    
    // 筛选条件过滤
    if (appliedFilters.value.scene.length > 0) {
      if (!outfit.scene || !appliedFilters.value.scene.includes(outfit.scene.toLowerCase())) {
        return false
      }
    }
    
    if (appliedFilters.value.season.length > 0) {
      if (!outfit.season || !appliedFilters.value.season.includes(outfit.season.toLowerCase())) {
        return false
      }
    }
    
    if (appliedFilters.value.style.length > 0) {
      if (!outfit.style || !appliedFilters.value.style.includes(outfit.style.toLowerCase())) {
        return false
      }
    }
    
    return true
  })
})

// 计算总页数
const totalPages = computed(() => {
  // 根据展开状态计算总页数
  const itemsPerPage = expandedDisplay.value ? props.itemsPerPage * 2 : props.itemsPerPage
  return Math.ceil(filteredOutfits.value.length / itemsPerPage)
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

// 筛选和搜索功能方法
// 切换筛选面板显示
function toggleFilterPanel() {
  showFilterPanel.value = !showFilterPanel.value
}

// 切换筛选条件
function toggleFilter(type, value) {
  const index = filters.value[type].indexOf(value)
  if (index > -1) {
    filters.value[type].splice(index, 1)
  } else {
    filters.value[type].push(value)
  }
}

// 应用筛选
function applyFilters() {
  // 深拷贝当前筛选条件
  appliedFilters.value = {
    scene: [...filters.value.scene],
    season: [...filters.value.season],
    style: [...filters.value.style]
  }
  // 关闭筛选面板
  showFilterPanel.value = false
}

// 重置筛选
function resetFilters() {
  filters.value = {
    scene: [],
    season: [],
    style: []
  }
  appliedFilters.value = {
    scene: [],
    season: [],
    style: []
  }
}

// 移除单个筛选条件
function removeFilter(type, value) {
  const index = appliedFilters.value[type].indexOf(value)
  if (index > -1) {
    appliedFilters.value[type].splice(index, 1)
    // 同步更新当前筛选面板中的状态
    const filterIndex = filters.value[type].indexOf(value)
    if (filterIndex > -1) {
      filters.value[type].splice(filterIndex, 1)
    }
  }
}

// 获取筛选条件标签
function getFilterLabel(type, value) {
  let options = []
  switch (type) {
    case 'scene':
      options = sceneOptions
      break
    case 'season':
      options = seasonOptions
      break
    case 'style':
      options = styleOptions
      break
  }
  
  const option = options.find(opt => opt.value === value)
  return option ? option.label : value
}

// 计算当前激活的筛选条件数量
const activeFiltersCount = computed(() => {
  return appliedFilters.value.scene.length + 
         appliedFilters.value.season.length + 
         appliedFilters.value.style.length
})

// 获取当前激活的筛选条件
const activeFilters = computed(() => {
  const result = {}
  
  if (appliedFilters.value.scene.length > 0) {
    result.scene = appliedFilters.value.scene
  }
  
  if (appliedFilters.value.season.length > 0) {
    result.season = appliedFilters.value.season
  }
  
  if (appliedFilters.value.style.length > 0) {
    result.style = appliedFilters.value.style
  }
  
  return result
})

// 切换显示模式
function toggleDisplayMode() {
  expandedDisplay.value = !expandedDisplay.value
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
