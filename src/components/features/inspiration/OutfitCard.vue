<template>
  <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-neutral-100 flex flex-col transform hover:-translate-y-1 h-full">
    <!-- 搭配预览 - 优化后的卡片顶部 -->
    <div class="relative overflow-hidden">
      <!-- 卡片顶部渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 transform transition-transform duration-700 group-hover:scale-110"></div>

      <!-- 装饰元素 - 增强卡片深度感 -->
      <div class="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
      <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>

      <!-- 卡片内容 -->
      <div class="p-4 h-48 flex flex-col relative z-10">
        <!-- 顶部信息区 -->
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-bold text-neutral-800 text-base truncate pr-2 group-hover:text-primary transition-colors">
              {{ outfit.name }}
            </h4>
            <div v-if="outfit?.scene" class="flex items-center mt-1">
              <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary text-xs mr-1" />
              <span class="text-xs text-primary font-medium">{{ outfit?.scene || '' }}</span>
            </div>
          </div>
          <div class="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
            <font-awesome-icon :icon="['fas', 'tshirt']" class="text-yellow-400 text-xs mr-1" />
            <span class="text-xs font-medium text-neutral-800">
              {{ getOutfitRating(outfit) }}分
            </span>
          </div>
        </div>

        <!-- 衣物预览区 - 简化布局 -->
        <div class="flex-1 flex items-center justify-center relative">
          <div v-if="(outfit?.items?.length || 0) === 0" class="text-center text-neutral-400">
            <div class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2">
              <font-awesome-icon :icon="['fas', 'tshirt']" class="text-xl" />
            </div>
            <p class="text-sm">暂无衣物</p>
          </div>
          <div v-else class="grid grid-cols-3 gap-2 w-full">
            <div v-for="(item, idx) in (outfit?.items || []).slice(0, 6)" :key="idx"
                 class="aspect-square relative overflow-hidden rounded-lg shadow-sm group/item">
              <img :src="item.img" :alt="item.name"
                   class="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                   loading="lazy" />
              <div class="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors duration-300"></div>
              <!-- 更多衣物指示器 -->
              <div v-if="idx === 5 && (outfit?.items?.length || 0) > 6" 
                   class="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs font-bold">
                +{{ (outfit?.items?.length || 0) - 6 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 简化的搭配信息 -->
    <div class="p-4 flex-1 flex flex-col bg-white">
      <!-- 衣物数量统计 -->
      <div class="mb-3 flex items-center justify-between">
        <span class="text-sm text-neutral-600 flex items-center">
          <font-awesome-icon :icon="['fas', 'layer-group']" class="mr-1 text-primary" />
          {{ outfit?.items?.length || 0 }}件衣物
        </span>
        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button @click="toggleEditMode"
                  class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                  title="编辑搭配">
            <font-awesome-icon :icon="['fas', 'edit']" class="text-xs" />
          </button>
          <button @click="$emit('load-outfit', outfit)"
                  class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  title="加载搭配">
            <font-awesome-icon :icon="['fas', 'redo']" class="text-xs" />
          </button>
          <button @click="$emit('delete-outfit', outfit.id)"
                  class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  title="删除搭配">
            <font-awesome-icon :icon="['fas', 'trash']" class="text-xs" />
          </button>
        </div>
      </div>

      <!-- 编辑表单 -->
      <div v-if="isEditing" class="space-y-3 mt-auto">
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1">搭配名称</label>
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
