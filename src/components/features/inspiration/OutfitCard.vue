<template>
  <div class="bg-gradient-to-br from-white via-white to-neutral-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-white/80 flex flex-col transform hover:-translate-y-1.5 h-full">
    <!-- 搭配预览 - 优化后的卡片顶部 -->
    <div class="relative overflow-hidden">
      <!-- 卡片顶部渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-white/80 transform transition-transform duration-700 group-hover:scale-110"></div>

      <!-- 装饰元素 - 增强卡片深度感 -->
      <div class="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl opacity-70"></div>
      <div class="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-2xl opacity-70"></div>
      <div class="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/30 animate-pulse"></div>
      <div class="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-secondary/30 animate-pulse"></div>

      <!-- 卡片内容 -->
      <div class="p-5 h-56 flex flex-col relative z-10">
        <!-- 顶部信息区 -->
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-neutral-800 text-lg truncate pr-2 group-hover:text-primary transition-colors">
              {{ outfit.name }}
            </h4>
            <div v-if="outfit?.scene" class="flex items-center mt-1.5">
              <div class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-1.5">
                <font-awesome-icon icon="map-marker-alt" class="text-primary text-xs" />
              </div>
              <span class="text-xs text-primary font-medium bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full">
                {{ outfit?.scene || '' }}
              </span>
            </div>
          </div>

        </div>

        <!-- 衣物预览区 - 堆叠效果 -->
        <div class="flex-1 flex items-center justify-center relative" @mouseleave="resetStack" style="height: 220px;">
          <div v-if="(outfit?.items?.length || 0) === 0" class="text-center text-neutral-400">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/50">
              <font-awesome-icon icon="tshirt" class="text-primary text-2xl" />
            </div>
            <p class="text-sm text-neutral-500">暂无衣物</p>
          </div>
          <div v-else class="relative w-full h-full overflow-visible">
            <!-- 衣物图片堆叠效果 - 重新设计 -->
            <div class="relative w-full h-full flex items-center justify-center">
              <template v-for="(item, idx) in (outfit?.items || []).slice(0, 4)" :key="idx">
              <div 
                v-if="item.img"
                  class="absolute w-28 h-36 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-out cursor-pointer border-2 border-white"
                  :class="{ 'ring-2 ring-primary/30 ring-offset-1': hoveredIndex === idx }"
                  :style="{
                    zIndex: 30 - idx,
                    transform: expanded ? 
                      (hoveredIndex === idx ? 'translateY(0) translateX(0) rotate(0) scale(1.1)' : 
                       `translateY(${idx * 2}px) translateX(${idx % 2 === 0 ? -idx * 6 : idx * 6}px) rotate(${idx % 2 === 0 ? -1 - idx * 0.5 : 1 + idx * 0.5}deg)`) :
                      `translateY(${idx * 3}px) translateX(${idx % 2 === 0 ? -idx * 8 : idx * 8}px) rotate(${idx % 2 === 0 ? -2 - idx : 2 + idx}deg)`,
                    opacity: expanded ? (hoveredIndex === idx ? 1 : 0.8) : 1,
                    filter: expanded && hoveredIndex !== idx ? 'blur(1px)' : 'none'
                  }"
                @mouseenter="hoveredIndex = idx"
                @click="toggleExpanded">
                  <!-- 图片容器 -->
                  <div class="relative w-full h-full overflow-hidden">
                    <img 
                      :src="item.img" 
                      :alt="item.name" 
                      class="w-full h-full object-cover transition-transform duration-500"
                      :class="{ 'scale-110': hoveredIndex === idx }"
                    >
                    <!-- 悬停时的渐变遮罩 -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-400" 
                         :class="{ 'opacity-100': hoveredIndex === idx }"></div>
                    
                    <!-- 物品标签 -->
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white transition-opacity duration-300"
                         :class="{ 'opacity-0': hoveredIndex !== idx && !expanded, 'opacity-100': hoveredIndex === idx || expanded }">
                      <div class="text-xs font-medium truncate">{{ item.name || `物品 ${idx + 1}` }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            
            <!-- 更多衣物指示器 -->
            <div 
              v-if="(outfit?.items?.length || 0) > 4" 
              class="absolute bottom-1 right-1 bg-gradient-to-r from-primary to-secondary text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md text-sm font-bold border-2 border-white z-40 transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer flex-shrink-0"
              :class="{ 'animate-pulse': !expanded }"
              @click="toggleExpanded"
            >
              +{{ (outfit?.items?.length || 0) - 4 }}
            </div>
            
            <!-- 提示 -->
            <div 
              v-if="!expanded" 
              class="absolute bottom-0 left-0 right-0 text-center text-xs font-medium text-primary/70 transition-opacity duration-300"
            >
              点击展开查看更多
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- 优化的搭配信息 -->
    <div class="p-5 flex-1 flex flex-col bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm" style="min-height: 200px;">
      <!-- 衣物数量统计 -->
      <div class="mb-4 flex items-center justify-between">
        <span class="text-sm font-medium text-neutral-600 flex items-center bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <div class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            <font-awesome-icon icon="layer-group" class="text-primary text-xs" />
          </div>
          {{ outfit?.items?.length || 0 }}件衣物
        </span>
        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button @click="toggleEditMode"
                  class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-white/70"
                  title="编辑搭配">
            <font-awesome-icon icon="edit" class="text-xs" />
          </button>
          <button @click="$emit('load-outfit', outfit)"
                  class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-white/70"
                  title="加载搭配">
            <font-awesome-icon icon="redo" class="text-xs" />
          </button>
          <button @click="$emit('delete-outfit', outfit.id)"
                  class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-white/70"
                  title="删除搭配">
            <font-awesome-icon icon="trash" class="text-xs" />
          </button>
        </div>
      </div>

      <!-- 编辑表单 -->
      <div v-if="isEditing" class="space-y-4 mt-auto">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <div class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <font-awesome-icon icon="tag" class="text-primary text-xs" />
            </div>
            搭配名称
          </label>
          <input 
            v-model="editOutfit.name" 
            type="text" 
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            placeholder="输入搭配名称"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1">适用场景</label>
          <input 
            v-model="editOutfit.scene" 
            type="text" 
            class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            placeholder="输入适用场景"
          />
        </div>
        <div class="flex gap-2">
          <button @click="saveEdit"
                  class="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'save']" class="mr-1 text-xs" />
            保存
          </button>
          <button @click="cancelEdit"
                  class="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
            取消
          </button>
        </div>
      </div>

      <!-- 主要操作按钮 -->
      <button v-else @click="$emit('load-outfit', outfit)"
              class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 mt-auto">
        <font-awesome-icon :icon="['fas', 'eye']" class="mr-2" />
        <span>查看详情</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Props定义
const props = defineProps({
  outfit: {
    type: Object,
    required: true
  }
})

// 事件定义
const emit = defineEmits(['load-outfit', 'delete-outfit', 'edit-outfit'])

// 状态管理
const expanded = ref(false);
const hoveredIndex = ref(-1);

// 切换展开状态
const toggleExpanded = () => {
  expanded.value = !expanded.value;
  if (!expanded.value) {
    hoveredIndex.value = -1;
  }
};

// 重置堆叠状态
const resetStack = () => {
  if (!expanded.value) {
    hoveredIndex.value = -1;
  }
};

// 编辑状态
const isEditing = ref(false)
const editOutfit = reactive({})

// 切换编辑模式
function toggleEditMode() {
  if (!isEditing.value) {
    // 进入编辑模式，复制当前数据
    Object.assign(editOutfit, {
      id: props.outfit.id,
      name: props.outfit.name,
      scene: props.outfit.scene || ''
    })
  }
  isEditing.value = !isEditing.value
}

// 保存编辑
function saveEdit() {
  // 验证数据
  if (!editOutfit.name.trim()) {
    alert('搭配名称不能为空')
    return
  }

  // 发送编辑事件
  emit('edit-outfit', { ...editOutfit })
  // 退出编辑模式
  isEditing.value = false
}

// 取消编辑
function cancelEdit() {
  isEditing.value = false
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
