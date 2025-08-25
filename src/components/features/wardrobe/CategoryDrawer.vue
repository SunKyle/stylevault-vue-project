<template>
  <!-- 分类结果展示 - 全屏覆盖层 -->
  <transition name="fade">
    <div v-if="isDrawerOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="$emit('closeDrawer')"></div>
  </transition>

  <!-- 分类结果展示 - 优雅卡片 -->
  <transition
    enter-active-class="animated slide-up-enter-active"
    leave-active-class="animated slide-up-leave-active"
    enter-from-class="slide-up-enter-from"
    enter-to-class="slide-up-enter-to"
    leave-from-class="slide-up-leave-from"
    leave-to-class="slide-up-leave-to"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @after-leave="afterLeave">
    <div v-if="isDrawerOpen" class="fixed inset-x-4 bottom-4 top-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col transform origin-bottom">
      <!-- 顶部导航栏 -->
      <div class="bg-gradient-to-r from-primary to-secondary p-5 text-white">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <font-awesome-icon :icon="isSearchMode ? ['fas', 'search'] : ['fas', getCategoryIcon()]" />
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ getSelectedCategoryName() }}</h2>
              <p class="text-white/80 text-sm">{{ getCategoryItemCount(selectedCategory) }} 件衣物</p>
            </div>
          </div>
          <button @click="$emit('closeDrawer')" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>

        <!-- 筛选和排序栏 -->
        <div class="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            @click="applyFilter('all')" 
            :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors', currentFilter === 'all' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20']"
          >
            <font-awesome-icon :icon="['fas', 'filter']" class="text-xs" />
            <span>全部</span>
          </button>
          <button 
            @click="applyFilter('favorites')" 
            :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors', currentFilter === 'favorites' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20']"
          >
            <font-awesome-icon :icon="['fas', 'heart']" class="text-xs" />
            <span>收藏</span>
          </button>
          <button 
            @click="applyFilter('recent')" 
            :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors', currentFilter === 'recent' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20']"
          >
            <font-awesome-icon :icon="['fas', 'clock']" class="text-xs" />
            <span>最近添加</span>
          </button>
          <button 
            @click="applySort('name')" 
            :class="['px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors', currentSort === 'name' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20']"
          >
            <font-awesome-icon :icon="['fas', 'sort-alpha-down']" class="text-xs" />
            <span>名称</span>
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <!-- 有衣物时的展示 -->
        <div v-if="getCategoryItems(selectedCategory).length > 0" class="space-y-6">
          <!-- 网格视图 -->
          <transition-group name="staggered-fade" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div
              v-for="(item, index) in getCategoryItems(selectedCategory)"
              :key="item.id"
              class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group relative"
              @click="$emit('viewItemDetail', item)"
              :style="{ 'transition-delay': `${index * 50}ms` }"
            >
              <!-- 卡片操作按钮（悬停时显示） -->
              <div class="absolute top-2 right-2 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <!-- 收藏按钮 -->
                <button
                  @click.stop="$emit('toggleFavorite', item)"
                  class="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <font-awesome-icon
                    :icon="['fas', 'heart']"
                    :class="[item.favorite ? 'text-red-500 animate-pulse' : 'text-gray-400']"
                    class="text-sm"
                  />
                </button>
                <!-- 编辑按钮 -->
                <button
                  @click.stop="$emit('editItem', item)"
                  class="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-blue-500 hover:text-blue-600"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" class="text-sm" />
                </button>
                <!-- 删除按钮 -->
                <button
                  @click.stop="$emit('deleteItem', item)"
                  class="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-red-500 hover:text-red-600"
                >
                  <font-awesome-icon :icon="['fas', 'trash-alt']" class="text-sm" />
                </button>
                <!-- 详细信息按钮 -->
                <button
                  @click.stop="$emit('viewItemDetail', item)"
                  class="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-indigo-500 hover:text-indigo-600"
                >
                  <font-awesome-icon :icon="['fas', 'info']" class="text-sm" />
                </button>
              </div>
              
              <!-- 收藏状态标记 -->
              <div v-if="item.favorite" class="absolute top-2 left-2 z-20 animate-bounce-in">
                <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                  <font-awesome-icon :icon="['fas', 'heart']" class="text-white text-sm" />
                </div>
              </div>
              
              <!-- 图片区域 -->
              <div class="aspect-[3/4] overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 z-10"></div>
                <img
                  :src="item.image || `https://picsum.photos/seed/${item.id}/300/300`"
                  :alt="item.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                >
              </div>
              
              <!-- 信息区域 -->
              <div class="p-3 bg-white border-t border-gray-100">
                <h3 class="font-semibold text-gray-900 truncate text-sm mb-1.5">{{ item.name }}</h3>
                
                <div class="flex items-center text-xs text-gray-500 mb-2">
                  <span v-if="item.brand" class="truncate">{{ item.brand }}</span>
                  <span v-else class="text-gray-400">未分类</span>
                </div>
                
                <div class="flex flex-wrap gap-1 mt-1.5">
                  <span class="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{{ item.season || '四季' }}</span>
                  <span v-if="item.color" class="text-xs text-gray-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">{{ item.color }}</span>
                  <span v-if="item.category" class="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">{{ item.category }}</span>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- 空状态展示 -->
        <transition name="fade-up" appear>
          <div v-if="getCategoryItems(selectedCategory).length === 0" class="flex flex-col items-center justify-center h-full py-12 text-center px-4">
            <div class="relative mb-6 animate-float">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <font-awesome-icon :icon="['fas', 'tshirt']" class="text-3xl text-primary animate-pulse-slow" />
              </div>
              <div class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center animate-ping-slow">
                <font-awesome-icon :icon="['fas', 'plus']" class="text-white" />
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 animate-fade-in-delay-1">
              {{ isSearchMode ? '没有找到相关衣物' : `您的 ${getSelectedCategoryName()} 分类还是空的` }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md animate-fade-in-delay-2">
              {{ isSearchMode ? '尝试使用其他关键词搜索' : '添加您的第一件衣物，开始构建您的专属数字衣橱，让每一天都充满时尚感' }}
            </p>
            <button
              @click="$emit('showUpload')"
              class="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2 animate-fade-in-delay-3 hover:animate-bounce-gentle"
            >
              <font-awesome-icon :icon="['fas', 'plus-circle']" />
              <span>{{ isSearchMode ? '添加新衣物' : '添加第一件衣物' }}</span>
            </button>
          </div>
        </transition>
      </div>

      <!-- 底部操作栏 -->
      <div class="bg-white border-t border-gray-200 p-3 flex justify-between items-center">
        <button class="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1">
          <font-awesome-icon :icon="['fas', 'th-large']" />
          <span class="text-sm">网格视图</span>
        </button>
        <button class="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1">
          <font-awesome-icon :icon="['fas', 'list']" />
          <span class="text-sm">列表视图</span>
        </button>
        <button
          @click="$emit('showUpload')"
          class="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors flex items-center space-x-1"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>添加衣物</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { useWardrobeStore } from '../../../stores/wardrobeStore'

export default {
  name: 'CategoryDrawer',
  props: {
    isDrawerOpen: {
      type: Boolean,
      required: true
    },
    isSearchMode: {
      type: Boolean,
      required: true
    },
    selectedCategory: {
      type: [String, null],
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
  },
  emits: ['closeDrawer', 'showUpload', 'toggleFavorite', 'viewItemDetail', 'editItem', 'deleteItem', 'applyFilter', 'applySort'],
  data() {
    return {
      currentFilter: 'all',
      currentSort: null,
      wardrobeStore: useWardrobeStore()
    }
  },
  methods: {
    beforeEnter() {
      console.time('动画持续时间')
    },
    afterEnter() {
      console.timeEnd('动画持续时间')
    },
    beforeLeave() {
      // 动画开始前的处理
    },
    afterLeave() {
      // 动画结束后的处理
    },
    applyFilter(filterType) {
      this.currentFilter = filterType;
      this.$emit('applyFilter', filterType);
    },
    applySort(sortType) {
      // 切换排序状态：如果已经是该排序类型，则取消排序
      this.currentSort = this.currentSort === sortType ? null : sortType;
      this.$emit('applySort', this.currentSort);
    },
    getCategoryIcon() {
      if (this.isSearchMode) return 'search';
      if (!this.selectedCategory || this.selectedCategory === "all") return 'tag';
      const category = this.wardrobeStore.categories.find(c => c.id === this.selectedCategory);
      return category ? category.icon : 'tag';
    }
  }
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.slide-up-enter-active {
  animation-name: slideUpIn;
  animation-duration: 1s;
}

.slide-up-leave-active {
  animation-name: slideUpOut;
  animation-duration: 0.3s;
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes pulse-slow {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes ping-slow {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

@keyframes fade-in-delay-1 {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-delay-1 {
  animation: fade-in-delay-1 0.5s ease-out 0.1s both;
}

@keyframes fade-in-delay-2 {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-delay-2 {
  animation: fade-in-delay-2 0.5s ease-out 0.2s both;
}

@keyframes fade-in-delay-3 {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-delay-3 {
  animation: fade-in-delay-3 0.5s ease-out 0.3s both;
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.hover\:animate-bounce-gentle:hover {
  animation: bounce-gentle 1s ease-in-out infinite;
}

.fade-up-enter-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
