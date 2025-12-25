<template>
  <transition name="fade-up" appear>
    <div class="flex flex-col items-center justify-center h-full py-12 text-center px-4">
      <div class="relative mb-6 animate-float">
        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
           <img :src="'/src/assets/icons/' + props.categoryIcon" class="w-8 h-8 object-contain" />
        </div>
        <div class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center animate-ping-slow">
          <font-awesome-icon :icon="['fas', 'plus']" class="text-white" />      
        </div>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2 animate-fade-in" style="animation-delay: 0.1s">
        {{ props.isSearchMode ? '没有找到相关衣物' : `您的 ${props.categoryName} 分类还是空的` }}
      </h3>
      <p class="text-gray-600 mb-6 max-w-md animate-fade-in" style="animation-delay: 0.2s">
        {{ props.isSearchMode ? '尝试使用其他关键词搜索' : `添加您的第一件${props.categoryName}，开始构建您的专属数字衣橱` }}
      </p>
      <button
        @click="emit('show-upload')"
        class="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2 animate-fade-in"
        style="animation-delay: 0.3s"
        hover:animate-bounce-gentle
      >
        <font-awesome-icon :icon="['fas', 'plus-circle']" />
        <span>{{ isSearchMode ? '添加新衣物' : `添加第一件${props.categoryName}` }}</span>
      </button>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  isSearchMode: Boolean,
  categoryName: String,
  categoryIcon: String
});

const emit = defineEmits(['show-upload']);
</script>

<style scoped>
/* 空状态动画（合并重复定义） */
.animate-float {
  animation: float 3s ease-in-out infinite;
}
.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out both;
}
.hover\:animate-bounce-gentle:hover {
  animation: bounce-gentle 1s ease-in-out infinite;
}

/* 动画关键帧 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes ping-slow {
  75%, 100% { transform: scale(1.5); opacity: 0; }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 过渡动画 */
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