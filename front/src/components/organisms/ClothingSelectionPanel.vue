<template>
  <div class="cloth-selector-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <h3 class="header-title">
        <div class="icon-wrapper">
          <font-awesome-icon :icon="['fas', 'shirt']" class="icon" />
        </div>
        选择衣物
      </h3>
    </div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <!-- 筛选工具栏 -->
      <div class="filter-toolbar">
        <!-- 分类筛选 -->
        <div class="filter-section">
          <h4 class="section-title">衣物分类</h4>
          <div class="category-list">
            <button
              v-for="cat in safeCategories"
              :key="cat"
              class="category-btn"
              :class="{ active: activeCategory === cat }"
              @click="$emit('category-change', cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- 标签筛选 -->
        <div class="filter-section">
          <h4 class="section-title">标签筛选</h4>
          <div class="tag-list">
            <button
              v-for="tag in safeTags"
              :key="tag"
              class="tag-btn"
              :class="{ active: activeTag === tag }"
              @click="$emit('tag-change', tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- 衣物列表 -->
      <div class="cloth-list" v-if="safeFilteredClothes.length > 0">
        <div class="cloth-item-wrapper">
          <div
            v-for="item in safeFilteredClothes"
            :key="item.id"
            class="cloth-item-wrapper-item"
          >
            <div class="cloth-item" :data-id="item.id">
              <!-- 衣物卡片 -->
              <div
                class="cloth-card"
                :class="{ selected: isItemSelected(item) }"
                @click="$emit('toggle-cloth', item)"
                draggable="true"
                @dragstart="handleDragStart($event, item)"
                @dragend="handleDragEnd"
              >
                <!-- 衣物图片 -->
                <div class="img-wrapper">
                  <img
                    :src="item.img"
                    :alt="item.name"
                    class="cloth-img"
                    loading="lazy"
                  />
                </div>

                <!-- 状态遮罩 -->
                <div class="selected-mask" v-if="isItemSelected(item)"></div>
                <div class="hover-mask"></div>

                <!-- 选择指示器 -->
                <div class="indicator" :class="{ selected: isItemSelected(item) }">
                  <font-awesome-icon 
                    :icon="isItemSelected(item) ? ['fas', 'check'] : ['fas', 'plus']" 
                    class="indicator-icon"
                  />
                </div>

                <!-- 衣物信息（图片下方） -->
                <div class="card-info">
                  <p class="name">{{ item.name }}</p>
                  <p class="type">{{ item.type }}</p>
                </div>
              </div>

              <!-- 衣物信息（卡片下方） -->
              <div class="item-info">
                <p class="name">{{ item.name }}</p>
                <p class="type">{{ item.type }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-icon-wrapper">
          <font-awesome-icon :icon="['fas', 'search']" class="empty-icon" />
        </div>
        <p class="empty-text">没有找到符合条件的衣物</p>
        <button
          class="reset-btn"
          @click="$emit('reset-filters')"
        >
          <font-awesome-icon :icon="['fas', 'sync-alt']" class="mr-2" />
          查看全部衣物
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// ===================== 核心类型与常量 =====================
// 衣物对象基础类型（精简定义）
const CLOTH_ITEM_KEYS = ['id', 'name', 'type', 'img', 'category', 'tags', 'isFavorite'];

// ===================== Props 定义 =====================
const props = defineProps({
  categories: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  activeCategory: { type: String, default: '全部' },
  activeTag: { type: String, default: '' },
  clothes: { type: Array, default: () => [] },
  filteredClothes: { type: Array, default: () => [] },
  selectedClothes: { type: Array, default: () => [] },
});

// ===================== 响应式数据 =====================
// 拖拽状态
const draggedItem = ref(null);

// ===================== 计算属性（精简版） =====================
// 安全化数组（通用方法）
const safeArray = (arr) => Array.isArray(arr) ? arr : [];

// 过滤后的衣物列表（去重属性）
const safeFilteredClothes = computed(() => 
  safeArray(props.filteredClothes).map(item => 
    Object.fromEntries(CLOTH_ITEM_KEYS.map(key => [key, item[key]]))
  )
);

// 选中的衣物列表（仅保留核心属性）
const safeSelectedClothes = computed(() => 
  safeArray(props.selectedClothes).map(item => ({
    id: item.id,
    name: item.name,
    type: item.type,
    img: item.img
  }))
);

// 安全化分类/标签列表
const safeCategories = computed(() => safeArray(props.categories));
const safeTags = computed(() => safeArray(props.tags));

// ===================== 通用方法 =====================
// 判断衣物是否选中（封装重复逻辑）
const isItemSelected = (item) => 
  safeSelectedClothes.value.some(i => i.id === item.id);

// 处理拖拽开始
const handleDragStart = (event, item) => {
  // 序列化核心数据（避免循环引用）
  const serializableItem = { id: item.id, name: item.name, type: item.type, img: item.img };
  event.dataTransfer.setData('text/plain', JSON.stringify(serializableItem));
  
  // 设置拖拽状态
  draggedItem.value = item;
  event.dataTransfer.effectAllowed = 'copy';
  
  // 创建拖拽预览图
  const dragIcon = createDragIcon(item.img);
  event.dataTransfer.setDragImage(dragIcon, 40, 40);
  event.target.classList.add('dragging');
  
  // 清理预览图
  setTimeout(() => dragIcon.parentNode && dragIcon.parentNode.removeChild(dragIcon), 0);
};

// 处理拖拽结束
const handleDragEnd = (event) => {
  event.target.classList.remove('dragging');
  draggedItem.value = null;
};

// 创建拖拽预览图标（抽离重复DOM操作）
const createDragIcon = (imgSrc) => {
  const dragIcon = document.createElement('div');
  dragIcon.className = 'drag-icon';
  dragIcon.innerHTML = `<img src="${imgSrc}" class="w-16 h-16 object-cover rounded-lg shadow-lg" />`;
  document.body.appendChild(dragIcon);
  return dragIcon;
};
</script>

<style scoped>
/* 核心卡片样式 */
.cloth-selector-card {
  background: linear-gradient(to bottom right, #eef2ff, #ffffff, #f5f3ff);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  border: 1px solid #e0e7ff;
  transition: all 0.3s ease;
}
.cloth-selector-card:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(99 102 241 / 0.1);
}

/* 卡片头部 */
.card-header {
  background: linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  padding: 1.25rem;
  border-bottom: 1px solid #e0e7ff;
  backdrop-filter: blur(8px);
}
.header-title {
  font-weight: bold;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  color: #1e293b;
}
.icon-wrapper {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(to right, #6366f1, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.icon {
  color: white;
  font-size: 0.875rem;
}

/* 卡片内容 */
.card-content {
  padding: 1.25rem;
}

/* 筛选工具栏 */
.filter-toolbar {
  background: linear-gradient(to bottom right, rgba(234, 240, 255, 0.5), #ffffff, rgba(245, 243, 255, 0.5));
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e0e7ff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  backdrop-filter: blur(8px);
}
.filter-section {
  margin-bottom: 1rem;
}
.filter-section:last-child {
  margin-bottom: 0;
}
.section-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4338ca;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 分类列表 */
.category-list {
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  margin: 0 -0.25rem;
  padding: 0 0.25rem 0.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) transparent;
}
.category-btn {
  padding: 0.625rem 1rem;
  font-weight: 500;
  white-space: nowrap;
  font-size: 0.875rem;
  border-radius: 1rem;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
  background: white;
  color: #4338ca;
  border: none;
  cursor: pointer;
}
.category-btn.active {
  background: linear-gradient(to right, #6366f1, #a855f7);
  color: white;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.category-btn:not(.active):hover {
  background: #e0e7ff;
  color: #1e293b;
}

/* 标签列表 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 -0.25rem;
  padding: 0 0.25rem;
}
.tag-btn {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
  background: white;
  color: #4338ca;
  border: 1px solid #e0e7ff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  cursor: pointer;
}
.tag-btn.active {
  background: linear-gradient(to right, #6366f1, #a855f7);
  color: white;
  border-color: transparent;
}
.tag-btn:not(.active):hover {
  background: #6366f1;
  color: white;
}

/* 衣物列表 */
.cloth-list {
  height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) transparent;
}
@media (min-width: 640px) {
  .cloth-list { height: 700px; }
}
@media (min-width: 768px) {
  .cloth-list { height: 800px; }
}
@media (min-width: 1024px) {
  .cloth-list { height: 900px; }
}

/* 网格布局容器 */
.cloth-item-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  padding: 0 0.25rem;
}
@media (min-width: 640px) {
  .cloth-item-wrapper { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 768px) {
  .cloth-item-wrapper { grid-template-columns: repeat(4, 1fr); }
}
@media (min-width: 1024px) {
  .cloth-item-wrapper { grid-template-columns: repeat(5, 1fr); }
}

/* 衣物项包装器 */
.cloth-item-wrapper-item {
  width: 100%;
}

.cloth-item {
  position: relative;
  width: 100%;
}

/* 衣物卡片 */
.cloth-card {
  aspect-ratio: 3/4;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
  border: 2px solid #e0e7ff;
  cursor: pointer;
  position: relative;
  transform: translateY(0);
}
.cloth-card:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  border-color: #c7d2fe;
  transform: translateY(-0.5rem);
}
.cloth-card.selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

/* 图片容器 */
.img-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cloth-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}
.cloth-item:hover .cloth-img {
  transform: scale(1.1);
}

/* 状态遮罩 */
.selected-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
}
.hover-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}
.cloth-item:hover .hover-mask {
  opacity: 1;
}

/* 选择指示器 */
.indicator {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
}
.cloth-item:hover .indicator {
  transform: scale(1.1);
  background: white;
}
.indicator.selected {
  background: linear-gradient(to right, #6366f1, #a855f7);
}
.indicator-icon {
  color: #6366f1;
}
.indicator.selected .indicator-icon {
  color: white;
}

/* 卡片内信息 */
.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}
.card-info .name {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-info .type {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 卡片下信息 */
.item-info {
  margin-top: 0.75rem;
  padding: 0 0.25rem;
}
.item-info .name {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}
.cloth-item:hover .item-info .name {
  color: #4f46e5;
}
.item-info .type {
  font-size: 0.75rem;
  color: #6366f1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 空状态 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 0;
}
.empty-icon-wrapper {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #e0e7ff, #f3e8ff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.05);
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.empty-icon {
  color: #6366f1;
  font-size: 2rem;
}
.empty-text {
  color: #4338ca;
  font-weight: 500;
  margin-bottom: 1rem;
}
.reset-btn {
  background: linear-gradient(to right, #6366f1, #a855f7);
  color: white;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
.reset-btn:hover {
  background: linear-gradient(to right, #4f46e5, #9333ea);
  box-shadow: 0 6px 10px -4px rgb(0 0 0 / 0.1);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 拖拽样式 */
.cloth-card.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: grabbing;
}
.drag-icon {
  position: absolute;
  top: -1000px;
  left: -1000px;
  pointer-events: none;
  z-index: 9999;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 动画 */
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
</style>