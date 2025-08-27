<template>
  <div class="fixed right-8 bottom-8 z-50">
    <!-- 背景模糊效果层 - 菜单展开时显示 -->
    <div 
      class="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10 transition-all duration-500 ease-out"
      :style="showMenu ? { opacity: '1' } : { opacity: '0', pointerEvents: 'none' }"
      @click="showMenu = false"
    ></div>
    
    <!-- 扇形展开的功能菜单容器 - 使用统一的布局参考系 -->
    <div class="relative w-72 h-72">
      
      <!-- 添加衣物按钮 - 扇形位置1 (左下位置) -->
      <button 
        class="absolute w-14 h-14 rounded-full bg-white text-indigo-600 shadow-lg flex items-center justify-center transition-all duration-600 ease-out"
        :style="showMenu ? 
          { 
            right: '78px', 
            bottom: '0',
            opacity: '1', 
            boxShadow: '0 6px 25px rgba(99, 102, 241, 0.25)',
            transform: 'scale(1) rotate(0deg)' 
          } : 
          { 
            right: '0', 
            bottom: '0',
            opacity: '0', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transform: 'scale(0.7) rotate(30deg)' 
          }
        "
        @click="handleAddClothing"
        aria-label="添加衣物"
      >
        <font-awesome-icon icon="shirt" class="text-xl" />
      </button>
      
      <!-- 添加搭配按钮 - 扇形位置2 (左上位置) -->
      <button 
        class="absolute w-14 h-14 rounded-full bg-white text-purple-600 shadow-lg flex items-center justify-center transition-all duration-600 ease-out"
        :style="showMenu ? 
          { 
            right: '64px', 
            bottom: '63px',
            opacity: '1', 
            boxShadow: '0 6px 25px rgba(168, 85, 247, 0.25)',
            transform: 'scale(1) rotate(0deg)' 
          } : 
          { 
            right: '0', 
            bottom: '0',
            opacity: '0', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transform: 'scale(0.7) rotate(60deg)' 
          }
        "
        @click="handleAddOutfit"
        aria-label="添加搭配"
      >
        <font-awesome-icon icon="lightbulb" class="text-xl" />
      </button>
      
      <!-- 查看全部衣物按钮 - 扇形位置3 (正上位置) -->
      <button 
        class="absolute w-14 h-14 rounded-full bg-white text-blue-600 shadow-lg flex items-center justify-center transition-all duration-600 ease-out"
        :style="showMenu ? 
          { 
            right: '0', 
            bottom: '80px',
            opacity: '1', 
            boxShadow: '0 6px 25px rgba(59, 130, 246, 0.25)',
            transform: 'scale(1) rotate(0deg)' 
          } : 
          { 
            right: '0', 
            bottom: '0',
            opacity: '0', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transform: 'scale(0.7) rotate(90deg)' 
          }
        "
        @click="handleViewAllClothing"
        aria-label="查看全部衣物"
      >
        <font-awesome-icon icon="th-large" class="text-xl" />
      </button>
      
      <!-- 主按钮 - 增强静置状态的阴影效果 -->
      <button 
        class="absolute right-0 bottom-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl flex items-center justify-center transition-all duration-300 ease-out transform hover:scale-110 active:scale-95"
        @click="toggleMenu"
        aria-label="打开快捷操作菜单"
      >
        <font-awesome-icon 
          :icon="showMenu ? 'times' : 'plus'" 
          class="text-2xl transition-transform duration-500 ease-in-out"
          :style="showMenu ? { transform: 'rotate(135deg) scale(1.2)' } : { transform: 'rotate(0deg) scale(1)' }"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showMenu = ref(false)

const emit = defineEmits(['addClothing', 'addOutfit', 'upload', 'viewAllClothing'])

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function handleAddClothing() {
  emit('addClothing')
  showMenu.value = false
}

function handleAddOutfit() {
  emit('addOutfit')
  showMenu.value = false
}

function handleUpload() {
  emit('upload')
  showMenu.value = false
}

function handleViewAllClothing() {
  emit('viewAllClothing')
  showMenu.value = false
}

// 点击页面其他地方关闭菜单
const handleClickOutside = (event) => {
  const fabContainer = document.querySelector('.fixed.right-8.bottom-8.z-50')
  if (fabContainer && !fabContainer.contains(event.target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 自定义动画 */
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}

/* 增强主按钮的阴影效果 */
.shadow-xl {
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4), 0 4px 10px rgba(79, 70, 229, 0.2);
}

/* 优化功能按钮的阴影层次 */
.shadow-lg {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>