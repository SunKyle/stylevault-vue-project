<template>
  <div class="bg-gradient-to-r from-primary to-secondary p-5 text-white">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center 
            bg-gradient-to-br from-white to-white/75 
            text-primary shadow-xs hover:shadow-sm transition-all duration-300">          
          <img
            :src= "'/src/assets/icons/' + props.categoryIcon"
            class="w-6 h-6 object-contain"
          />
        </div>
        <div>
          <h2 class="text-xl font-bold">{{ categoryName }}</h2>
          <p class="text-white/80 text-sm">{{ itemCount }} 件衣物</p>
        </div>
      </div>
      <button
        @click="emit('close')"
        class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
    </div>

    <!-- 筛选排序栏 -->
    <div class="flex space-x-2 overflow-x-auto pb-1 custom-scrollbar">
      <!-- 全部 -->
      <button
        @click="emit('apply-filter', 'all')"
        :class="[
          'px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors',
          currentFilter === 'all' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20',
        ]"
      >
        <font-awesome-icon :icon="['fas', 'filter']" class="text-xs" />
        <span>全部</span>
      </button>
      <!-- 收藏 -->
      <button
        @click="emit('apply-filter', 'favorites')"
        :class="[
          'px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors',
          currentFilter === 'favorites' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20',
        ]"
      >
        <font-awesome-icon :icon="['fas', 'heart']" class="text-xs" />
        <span>收藏</span>
      </button>
      <!-- 最近添加 -->
      <button
        @click="emit('apply-filter', 'recent')"
        :class="[
          'px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors',
          currentFilter === 'recent' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20',
        ]"
      >
        <font-awesome-icon :icon="['fas', 'clock']" class="text-xs" />
        <span>最近添加</span>
      </button>
      <!-- 名称排序 -->
      <button
        @click="emit('apply-sort', 'name')"
        :class="[
          'px-4 py-2 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 transition-colors',
          currentSort === 'name' ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20',
        ]"
      >
        <font-awesome-icon :icon="['fas', 'sort-alpha-down']" class="text-xs" />
        <span>名称</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isSearchMode: Boolean,
  categoryName: String,
  itemCount: Number,
  categoryIcon: String,
  currentFilter: String,
  currentSort: [String, null]
});


const emit = defineEmits(['close', 'apply-filter', 'apply-sort']);
</script>

<style scoped>
/* 继承父组件的滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>