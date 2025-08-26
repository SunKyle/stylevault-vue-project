<template>
  <div id="create-section" class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
    <!-- 左侧：穿搭预览 -->
    <div class="lg:col-span-1">
      <div class="bg-white rounded-2xl p-5 shadow-md h-full flex flex-col border border-neutral-100">
        <div class="flex justify-between items-center mb-5">
          <h3 class="font-bold text-lg flex items-center">
            <font-awesome-icon :icon="['fas', 'lightbulb']" class="text-secondary mr-2" />
            搭配灵感
          </h3>
          <div class="flex items-center gap-2">
            <span class="bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-medium text-sm">
              {{ selectedClothes.length }}件
            </span>
          </div>
        </div>

        <!-- 搭配预览区 -->
        <div class="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 md:p-6 h-64 md:h-80 flex flex-col items-center justify-center mb-6 border-2 border-dashed border-neutral-200 relative overflow-hidden">
          <!-- 装饰元素 -->
          <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full"></div>
          <div class="absolute -top-8 -left-8 w-32 h-32 bg-secondary/5 rounded-full"></div>

          <!-- 空状态 -->
          <div v-if="selectedClothes.length === 0" class="text-center relative z-10">
            <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <font-awesome-icon :icon="['fas', 'tshirt']" class="text-primary text-2xl" />
            </div>
            <p class="text-neutral-600 text-sm md:text-base font-medium">从右侧添加衣物进行搭配</p>
          </div>

          <!-- 有衣物时的预览 -->
          <div v-else class="w-full h-full flex flex-wrap justify-center items-center gap-3 md:gap-4 relative z-10">
            <div v-for="(item, idx) in selectedClothes.slice(0, 8)" :key="idx"
                 class="relative group"
                 :class="idx >= 6 ? 'opacity-70 scale-95' : ''"
                 :style="{ transform: `translateY(${(idx % 3 - 1) * 10}px)` }">
              <img :src="item.img" :alt="item.name"
                   class="w-14 h-14 md:w-18 md:h-18 rounded-lg object-cover shadow-md border-2 border-white transition-transform duration-300 group-hover:scale-110"
                   loading="lazy" />
              <div v-if="idx === 7 && selectedClothes.length > 8"
                   class="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                +{{ selectedClothes.length - 8 }}
              </div>
              <div class="absolute inset-x-0 -bottom-6 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center truncate z-10 whitespace-nowrap">
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- 衣物列表 -->
        <div class="flex-1 flex flex-col">
          <div class="mb-3 flex justify-between items-center">
            <span class="text-sm font-medium text-neutral-700">衣物清单 ({{ selectedClothes.length }})</span>
            <button v-if="selectedClothes.length > 0" class="text-xs text-primary hover:text-primary/80 transition-colors" @click="$emit('reset-clothes')">
              清空全部
            </button>
          </div>

          <div class="h-48 md:h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent space-y-2">
            <div v-if="selectedClothes.length === 0" class="text-center text-neutral-400 py-8 border border-dashed border-neutral-200 rounded-xl">
              <p class="text-sm">尚未选择衣物</p>
            </div>
            <div v-else v-for="(item, idx) in selectedClothes" :key="idx"
                 class="flex items-center gap-3 bg-neutral-50 rounded-lg px-3 py-2.5 group hover:bg-white transition-all duration-300 transform hover:translate-x-1 border border-transparent hover:border-primary/20">
              <div class="relative">
                <img :src="item.img" :alt="item.name" class="w-10 h-10 rounded-lg object-cover shadow-sm" loading="lazy" />
                <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <span class="text-white text-xs font-bold">{{ idx + 1 }}</span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-neutral-800 truncate">{{ item.name }}</p>
                <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
              </div>
              <button class="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      @click="$emit('remove-cloth', idx)">
                <span class="text-lg">×</span>
              </button>
            </div>
          </div>

          <!-- 操作按钮 - 增强视觉反馈和交互体验 -->
          <div class="mt-4 space-y-3">
            <button class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group/button"
                    @click="$emit('save-outfit')"
                    :disabled="selectedClothes.length === 0">
              <!-- 按钮装饰效果 -->
              <div class="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>

              <font-awesome-icon :icon="['fas', 'heart']" class="mr-2 transition-transform duration-300 group-hover/button:scale-110" />
              <span class="transition-transform duration-300 group-hover/button:scale-105">保存穿搭方案</span>
            </button>
            <button class="w-full bg-white border border-neutral-200 text-neutral-700 font-medium py-2.5 rounded-xl hover:bg-neutral-50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-sm hover:shadow-md flex items-center justify-center"
                    @click="$emit('reset-clothes')">
              <font-awesome-icon :icon="['fas', 'undo']" class="mr-2 transition-transform duration-300 hover:rotate-180" />
              重置搭配
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：衣物选择 -->
    <div class="lg:col-span-2">
      <div class="bg-white rounded-2xl p-6 shadow-md border border-neutral-100">
        <h3 class="font-bold text-lg mb-5 flex items-center">
          <font-awesome-icon :icon="['fas', 'hanger']" class="text-primary mr-2" />
          选择衣物
        </h3>

        <!-- 过滤工具栏 -->
        <div class="bg-neutral-50 rounded-xl p-4 mb-6">
          <!-- 分类选项卡 -->
          <div class="flex border-b border-neutral-200 mb-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent -mx-1 px-1">
            <button v-for="cat in categories" :key="cat" class="px-4 py-2 font-medium whitespace-nowrap text-sm"
                    :class="activeCategory === cat ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary'"
                    @click="$emit('category-change', cat)">
              {{ cat }}
            </button>
          </div>

          <!-- 标签过滤 -->
          <div class="flex flex-wrap gap-2 -mx-1 px-1">
            <button v-for="tag in tags" :key="tag"
                    class="text-xs px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                    :class="activeTag === tag ? 'bg-primary text-white shadow-sm' : 'bg-white text-neutral-700 border border-neutral-200'"
                    @click="$emit('tag-change', tag)">
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- 衣物列表 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
          <transition-group name="fade" tag="div" class="contents">
            <div v-for="item in filteredClothes" :key="item.name" class="group relative">
              <div class="aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 cursor-pointer relative transform hover:-translate-y-1"
                   :class="selectedClothes.some(i => i.name === item.name) ? 'border-primary ring-1 ring-primary/30' : 'border-neutral-100 hover:border-primary/30'"
                   @click="$emit('toggle-cloth', item)">
                <div class="w-full h-full overflow-hidden">
                  <img :src="item.img" :alt="item.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <!-- 选中状态遮罩 -->
                <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute inset-0 bg-primary/20"></div>
                <!-- 悬停效果遮罩 -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                <!-- 选中状态指示器 -->
                <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-lg transform transition-transform duration-300">
                  <span class="text-white font-bold text-lg">✓</span>
                </div>
                <!-- 未选中状态指示器 -->
                <div v-else class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transform transition-transform duration-300 group-hover:scale-110">
                  <span class="text-primary font-bold text-lg">+</span>
                </div>
                <!-- 衣物信息 -->
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p class="text-white text-sm font-medium truncate">{{ item.name }}</p>
                  <p class="text-white/80 text-xs truncate">{{ item.type }}</p>
                </div>
              </div>
              <div class="mt-2 px-1">
                <p class="text-sm font-medium truncate group-hover:text-primary transition-colors">{{ item.name }}</p>
                <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
              </div>
            </div>
          </transition-group>

          <!-- 空状态提示 -->
          <div v-if="filteredClothes.length === 0" class="col-span-full text-center py-12">
            <div class="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-4">
              <font-awesome-icon :icon="['fas', 'search']" class="text-neutral-400 text-2xl" />
            </div>
            <p class="text-neutral-600 font-medium mb-3">没有找到符合条件的衣物</p>
            <button class="text-primary text-sm hover:text-primary/80 underline transition-colors" @click="$emit('reset-filters')">
              查看全部衣物
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  selectedClothes: {
    type: Array,
    default: () => []
  },
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
  }
})

defineEmits([
  'remove-cloth',
  'reset-clothes',
  'save-outfit',
  'category-change',
  'tag-change',
  'toggle-cloth',
  'reset-filters'
])
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
