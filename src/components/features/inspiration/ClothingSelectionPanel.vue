<template>
  <div class="bg-gradient-to-br from-white to-neutral-50 rounded-2xl shadow-lg overflow-hidden border border-neutral-100 transform transition-all duration-300 hover:shadow-xl">
    <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-5 border-b border-neutral-100">
      <h3 class="font-bold text-lg flex items-center text-neutral-800">
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-2 shadow-sm">
          <font-awesome-icon :icon="['fas', 'hanger']" class="text-white text-sm" />
        </div>
        选择衣物
      </h3>
    </div>

    <div class="p-5">
      <!-- 过滤工具栏 -->
      <div class="bg-gradient-to-br from-white to-neutral-50 rounded-2xl p-5 mb-6 border border-neutral-100 shadow-sm">
        <!-- 分类选项卡 -->
        <div class="mb-4">
          <h4 class="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">衣物分类</h4>
          <div class="flex overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent -mx-1 px-1">
            <button v-for="cat in categories" :key="cat" class="px-4 py-2.5 font-medium whitespace-nowrap text-sm rounded-xl mx-1 transition-all duration-300"
                    :class="activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white text-neutral-600 hover:bg-primary/10 hover:text-primary'"
                    @click="$emit('category-change', cat)">
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- 标签过滤 -->
        <div>
          <h4 class="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">标签筛选</h4>
          <div class="flex flex-wrap gap-2 -mx-1 px-1">
            <button v-for="tag in tags" :key="tag"
                    class="text-xs px-3 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    :class="activeTag === tag ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-white text-neutral-700 border border-neutral-200'"
                    @click="$emit('tag-change', tag)">
              {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- 衣物列表 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
        <transition-group name="fade" tag="div" class="contents">
          <div v-for="item in filteredClothes" :key="item.name" class="group relative">
            <div class="aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 cursor-pointer relative transform hover:-translate-y-2"
                 :class="selectedClothes.some(i => i.name === item.name) ? 'border-primary ring-2 ring-primary/30' : 'border-neutral-100 hover:border-primary/30'"
                 @click="$emit('toggle-cloth', item)">
              <div class="w-full h-full overflow-hidden">
                <img :src="item.img" :alt="item.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              </div>
              <!-- 选中状态遮罩 -->
              <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30"></div>
              <!-- 悬停效果遮罩 -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <!-- 选中状态指示器 -->
              <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute top-3 right-3 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white shadow-lg transform transition-transform duration-300">
                <font-awesome-icon :icon="['fas', 'check']" class="text-white" />
              </div>
              <!-- 未选中状态指示器 -->
              <div v-else class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                <font-awesome-icon :icon="['fas', 'plus']" class="text-primary" />
              </div>
              <!-- 衣物信息 -->
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p class="text-white text-sm font-semibold truncate">{{ item.name }}</p>
                <p class="text-white/90 text-xs truncate">{{ item.type }}</p>
              </div>
            </div>
            <div class="mt-3 px-1">
              <p class="text-sm font-semibold truncate group-hover:text-primary transition-colors">{{ item.name }}</p>
              <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
            </div>
          </div>
        </transition-group>

        <!-- 空状态提示 -->
        <div v-if="filteredClothes.length === 0" class="col-span-full text-center py-12">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <font-awesome-icon :icon="['fas', 'search']" class="text-primary text-2xl" />
          </div>
          <p class="text-neutral-600 font-medium mb-4">没有找到符合条件的衣物</p>
          <button class="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-2.5 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center" @click="$emit('reset-filters')">
            <font-awesome-icon :icon="['fas', 'sync-alt']" class="mr-2" />
            查看全部衣物
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits([
  'category-change',
  'tag-change',
  'toggle-cloth',
  'reset-filters'
])

defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  },
  activeCategory: {
    type: String,
    default: '全部'
  },
  activeTag: {
    type: String,
    default: ''
  },
  clothes: {
    type: Array,
    default: () => []
  },
  filteredClothes: {
    type: Array,
    default: () => []
  },
  selectedClothes: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

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
</style>
