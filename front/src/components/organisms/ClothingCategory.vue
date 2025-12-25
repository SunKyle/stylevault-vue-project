<template>
  <div
    class="bg-white rounded-xl p-5 text-center shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    :class="[
      { 'ring-2 ring-primary': selected },
      { 'opacity-50 cursor-not-allowed': disabled } 
    ]"
    @click="handleClick"
    :aria-selected="selected" 
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0" 
  >
    <div 
      class="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
      :class="categoryBgClass"
    >
      <img
        :src= "categoryIcon"
        class="w-8 h-8 object-contain"
      />
    </div>
    <p class="font-medium">{{ categoryName }}</p>
    <p class="text-sm text-neutral-500 mt-1">
      {{ count === 0 ? '暂无' : `${count} 件` }} <!-- 优化空数量显示 -->
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// --- 1. 提取可配置常量（提升可维护性） ---
const CATEGORY_GRADIENT_MAP = {
  1: 'bg-gradient-to-br from-primary/10 to-primary/20 text-primary', // 上装
  2: 'bg-gradient-to-br from-secondary/10 to-secondary/20 text-secondary', // 下装
  3: 'bg-gradient-to-br from-primary/15 to-primary/25 text-primary', // 外套
  4: 'bg-gradient-to-br from-secondary/15 to-secondary/25 text-secondary', // 鞋履
  5: 'bg-gradient-to-br from-primary/20 to-primary/30 text-primary', // 配饰
  6: 'bg-gradient-to-br from-secondary/20 to-secondary/30 text-secondary', // 包包
  default: 'bg-gradient-to-br from-primary/25 to-secondary/40 text-primary'
};

/**
 * 衣物分类卡片组件
 * @props {Object} category - 分类数据对象（必传）
 * @props {number} count - 分类下衣物数量（默认0）
 * @props {boolean} selected - 是否选中（默认false）
 * @props {boolean} disabled - 是否禁用（默认false）
 */
const props = defineProps({
  category: {
    type: Object,
    required: true,
    validator: (val) => val !== null // 确保不是null
  },
  count: {
    type: Number,
    default: 0,
    validator: (val) => val >= 0 // 确保数量非负
  },
  selected: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

/**
 * 点击事件（传递分类ID）
 * @event click
 * @param {number} categoryId - 点击的分类ID
 */
const emit = defineEmits(['click']);

// 分类名称（简化空值判断）
const categoryName = computed(() => {
  return props.category.name?.trim() || '未分类';
});

// 分类图标
const categoryIcon = computed(() => {
  const icon = props.category.icon.trim();
  return '/src/assets/icons/' + icon; 
});

// 分类背景样式
const categoryBgClass = computed(() => {
  const categoryId = props.category.id;
  return CATEGORY_GRADIENT_MAP[categoryId] || CATEGORY_GRADIENT_MAP.default;
});


// 点击事件入口
const handleClick = () => {
  emit('click', props.category.id);
};

</script>

<style scoped>
/* 禁用状态优化：禁止点击事件 */
.opacity-50 {
  pointer-events: none;
}

/* 聚焦样式优化（无障碍） */
:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style>