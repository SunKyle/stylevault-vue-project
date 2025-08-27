<template>
  <div class="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-indigo-100/80 flex flex-col transform hover:-translate-y-1.5 h-full">
    <!-- 搭配预览 - 优化后的卡片顶部 -->
    <div class="relative overflow-hidden">
      <!-- 卡片顶部渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-white/80 transform transition-transform duration-700 group-hover:scale-110"></div>

      <!-- 装饰元素 - 增强卡片深度感 -->
      <div class="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl opacity-70 animate-pulse-slow"></div>
      <div class="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-2xl opacity-70 animate-pulse-slow animation-delay-1000"></div>
      <div class="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-indigo-400/30 animate-ping"></div>
      <div class="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-purple-400/30 animate-ping animation-delay-700"></div>

      <!-- 卡片内容 -->
      <div class="p-5 h-56 flex flex-col relative z-10">
        <!-- 顶部信息区 -->
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-indigo-900 text-lg truncate pr-2 group-hover:text-indigo-600 transition-colors">
              {{ outfit.name }}
            </h4>
            <div v-if="outfit?.scene" class="flex items-center mt-1.5">
              <div class="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-1.5 shadow-sm">
                <font-awesome-icon icon="map-marker-alt" class="text-indigo-600 text-xs" />
              </div>
              <span class="text-xs text-indigo-600 font-medium bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full border border-indigo-100/50">
                {{ outfit?.scene || '' }}
              </span>
            </div>

            <!-- 季节信息 -->
            <div v-if="outfit?.season" class="flex items-center mt-1.5">
              <div class="w-5 h-5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 flex items-center justify-center mr-1.5 shadow-sm">
                <font-awesome-icon icon="leaf" class="text-green-600 text-xs" />
              </div>
              <span class="text-xs text-green-600 font-medium bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full border border-green-100/50">
                {{ getSeasonLabel(outfit.season) }}
              </span>
            </div>

            <!-- 风格信息 -->
            <div v-if="outfit?.style" class="flex items-center mt-1.5">
              <div class="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center mr-1.5 shadow-sm">
                <font-awesome-icon icon="palette" class="text-purple-600 text-xs" />
              </div>
              <span class="text-xs text-purple-600 font-medium bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full border border-purple-100/50">
                {{ getStyleLabel(outfit.style) }}
              </span>
            </div>
          </div>

        </div>

        <!-- 衣物预览区 - 堆叠效果 -->
        <div class="flex-1 flex items-center justify-center relative" @mouseleave="resetStack" style="height: 220px;">
          <div v-if="(outfit?.items?.length || 0) === 0" class="text-center text-indigo-400">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100/80 to-purple-100/50 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-lg border border-indigo-100/50">
              <font-awesome-icon icon="tshirt" class="text-indigo-500 text-2xl" />
            </div>
            <p class="text-sm text-indigo-500">暂无衣物</p>
          </div>
          <div v-else class="relative w-full h-full overflow-visible">
            <!-- 衣物图片堆叠效果 - 重新设计 -->
            <div class="relative w-full h-full flex items-center justify-center">
              <template v-for="(item, idx) in (outfit?.items || []).slice(0, 4)" :key="idx">
              <div
                v-if="item.img"
                  class="absolute w-28 h-36 bg-gradient-to-br from-white to-indigo-50/50 rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-out cursor-pointer border-2 border-white/80 backdrop-blur-sm"
                  :class="{ 'ring-2 ring-indigo-400/30 ring-offset-1': hoveredIndex === idx }"
                  :style="getItemStyle(idx)"
                  @mouseenter="hoveredIndex = idx"
                  @click="openImagePreview(item)"
                >
                  <img :src="item.img" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p class="text-white text-xs font-medium truncate">{{ item.name }}</p>
                    <p class="text-white/80 text-xs truncate">{{ item.type }}</p>
                  </div>
                </div>
              </template>
            </div>

            <!-- 更多衣物指示器 -->
            <div v-if="(outfit?.items?.length || 0) > 4" class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-lg z-10">
              +{{ (outfit?.items?.length || 0) - 4 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 优化的搭配信息 -->
    <div class="p-5 flex-1 flex flex-col bg-gradient-to-br from-indigo-50/80 via-white/90 to-purple-50/80 backdrop-blur-sm">
      <!-- 衣物数量统计 -->
      <div class="mb-4 flex items-center justify-between">
        <span class="text-sm font-medium text-indigo-700 flex items-center bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-indigo-100/50">
          <div class="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-2 shadow-sm">
            <font-awesome-icon icon="layer-group" class="text-indigo-600 text-xs" />
          </div>
          {{ outfit?.items?.length || 0 }}件衣物
        </span>
        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button @click="toggleEditMode"
                  class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-indigo-100/50"
                  title="编辑搭配">
            <font-awesome-icon icon="edit" class="text-xs" />
          </button>
          <button @click="$emit('load-outfit', outfit)"
                  class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-indigo-100/50"
                  title="加载搭配">
            <font-awesome-icon icon="redo" class="text-xs" />
          </button>
          <button @click="$emit('delete-outfit', outfit.id)"
                  class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-indigo-100/50"
                  title="删除搭配">
            <font-awesome-icon icon="trash" class="text-xs" />
          </button>
        </div>
      </div>



      <!-- 主要操作按钮 -->
      <button v-if="!isEditing" @click="$emit('load-outfit', outfit)"
              class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 mt-auto">
        <font-awesome-icon :icon="['fas', 'eye']" class="mr-2" />
        <span>查看详情</span>
      </button>
    </div>
    
    <!-- 编辑表单 - 延伸区域 -->
    <div v-if="isEditing" class="p-5 bg-gradient-to-br from-indigo-50/80 via-white/90 to-purple-50/80 backdrop-blur-sm border-t border-indigo-100/50 transition-all duration-500 ease-in-out">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
            <div class="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-2 shadow-sm">
              <font-awesome-icon icon="tag" class="text-indigo-600 text-xs" />
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
        
        <!-- 季节选择 -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1">适用季节</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="season in seasonOptions"
              :key="season.value"
              @click="selectSeason(season.value)"
              class="py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center"
              :class="editOutfit.season === season.value 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'"
            >
              <span>{{ season.label }}</span>
            </button>
          </div>
        </div>
        
        <!-- 风格选择 -->
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1">搭配风格</label>
          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="style in styleOptions"
              :key="style.value"
              @click="selectStyle(style.value)"
              class="py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center"
              :class="editOutfit.style === style.value 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100'"
            >
              <span>{{ style.label }}</span>
            </button>
          </div>
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

// 季节选项映射
const seasonOptions = [
  { value: 'spring', label: '春季' },
  { value: 'summer', label: '夏季' },
  { value: 'autumn', label: '秋季' },
  { value: 'winter', label: '冬季' }
]

// 风格选项映射
const styleOptions = [
  { value: 'casual', label: '休闲' },
  { value: 'formal', label: '正式' },
  { value: 'business', label: '商务' },
  { value: 'street', label: '街头' },
  { value: 'vintage', label: '复古' },
  { value: 'minimalist', label: '极简' }
]

// 获取季节标签
function getSeasonLabel(value) {
  const season = seasonOptions.find(option => option.value === value)
  return season ? season.label : value
}

// 获取风格标签
function getStyleLabel(value) {
  const style = styleOptions.find(option => option.value === value)
  return style ? style.label : value
}

// 选择季节
function selectSeason(value) {
  if (editOutfit.season === value) {
    editOutfit.season = '' // 如果已选中，则取消选择
  } else {
    editOutfit.season = value
  }
}

// 选择风格
function selectStyle(value) {
  if (editOutfit.style === value) {
    editOutfit.style = '' // 如果已选中，则取消选择
  } else {
    editOutfit.style = value
  }
}
const hoveredIndex = ref(-1);

// 切换展开状态
function toggleExpand() {
  expanded.value = !expanded.value;
}

// 获取堆叠样式
function getItemStyle(index) {
  const totalItems = Math.min((props.outfit?.items?.length || 0), 4);
  const maxRotation = 15; // 最大旋转角度
  const maxOffset = 15; // 最大偏移量

  // 根据索引计算位置和旋转
  const rotation = (index - (totalItems - 1) / 2) * (maxRotation / totalItems);
  const offset = (index - (totalItems - 1) / 2) * (maxOffset / totalItems);

  return {
    transform: `translateX(${offset}px) rotate(${rotation}deg)`,
    zIndex: 10 + index,
    opacity: hoveredIndex.value === -1 || hoveredIndex.value === index ? 1 : 0.7
  };
}

// 重置堆叠效果
function resetStack() {
  hoveredIndex.value = -1;
}

// 图片预览
const previewImage = ref({
  show: false,
  url: '',
  name: '',
  type: ''
});

// 打开图片预览
function openImagePreview(item) {
  previewImage.value = {
    show: true,
    url: item.img,
    name: item.name,
    type: item.type
  };
}

// 关闭图片预览
function closeImagePreview() {
  previewImage.value.show = false;
}

// 编辑状态
const isEditing = ref(false);
const editOutfit = reactive({
  id: '',
  name: '',
  scene: '',
  season: '',
  style: ''
});

// 切换编辑模式
function toggleEditMode() {
  if (isEditing.value) {
    cancelEdit();
  } else {
    // 进入编辑模式，初始化编辑数据
    editOutfit.id = props.outfit.id;
    editOutfit.name = props.outfit.name;
    editOutfit.scene = props.outfit.scene || '';
    editOutfit.season = props.outfit.season || '';
    editOutfit.style = props.outfit.style || '';
    isEditing.value = true;
  }
}

// 保存编辑
function saveEdit() {
  emit('edit-outfit', {
    id: editOutfit.id,
    name: editOutfit.name,
    scene: editOutfit.scene,
    season: editOutfit.season,
    style: editOutfit.style
  });
  isEditing.value = false;
}

// 取消编辑
function cancelEdit() {
  isEditing.value = false;
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

/* 图片预览模态框 */
:deep(.modal-backdrop) {
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
