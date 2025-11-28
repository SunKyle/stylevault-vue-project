<template>
  <div
    class="bg-white rounded-xl p-5 text-center shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    :class="{ 'ring-2 ring-primary': selected }"
    @click="handleClick"
  >
    <div
      class="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
      :class="colorClass"
    >
      <font-awesome-icon :icon="iconValue" class="text-2xl" />
    </div>
    <p class="font-medium">{{ categoryName }}</p>
    <p class="text-sm text-neutral-500 mt-1">{{ count }} 件</p>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    category: {
      type: Object,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['click']);

  // 安全获取分类名称，避免undefined错误
  const categoryName = computed(() => {
    return props.category?.name || '未分类';
  });

  // 增强的图标处理，确保总是返回有效的图标
  const iconValue = computed(() => {
    try {
      // 1. 确保category存在
      if (!props.category || typeof props.category !== 'object') {
        return ['fas', 'question-circle'];
      }

      // 2. 确保icon是字符串且不为空
      const icon = props.category.icon;
      if (!icon || typeof icon !== 'string' || icon.trim() === '') {
        return ['fas', 'question-circle'];
      }

      // 3. 确保返回的是有效的图标数组
      const trimmedIcon = icon.trim();

      // 检查是否已经是数组格式
      if (Array.isArray(trimmedIcon)) {
        return trimmedIcon;
      }

      // 检查是否包含品牌图标前缀
      if (typeof trimmedIcon === 'string' && trimmedIcon.startsWith('fab:')) {
        return ['fab', trimmedIcon.substring(4)];
      }

      // 默认使用fas前缀
      return ['fas', trimmedIcon];
    } catch (error) {
      console.error('Error processing icon:', error);
      return ['fas', 'question-circle'];
    }
  });

  // 处理点击事件
  const handleClick = () => {
    if (props.category) {
      emit('click');
    }
  };

  // 根据类别ID确定颜色，使用主题色适配
  const colorClass = computed(() => {
    // 使用主题色的渐变效果，提升视觉体验
    const gradientMap = {
      1: 'bg-gradient-to-br from-primary/10 to-primary/20 text-primary', // 上装 - 主要主题色
      2: 'bg-gradient-to-br from-secondary/10 to-secondary/20 text-secondary', // 下装 - 次要主题色
      3: 'bg-gradient-to-br from-primary/15 to-primary/25 text-primary', // 外套 - 主要主题色变体
      4: 'bg-gradient-to-br from-secondary/15 to-secondary/25 text-secondary', // 鞋履 - 次要主题色变体
      5: 'bg-gradient-to-br from-primary/20 to-primary/30 text-primary', // 配饰 - 主要主题色变体
      6: 'bg-gradient-to-br from-secondary/20 to-secondary/30 text-secondary', // 包包 - 次要主题色变体
    };

    // 确保category存在且id有效
    if (!props.category || !props.category.id) {
      return 'bg-gray-100 text-gray-500';
    }

    return (
      gradientMap[props.category.id] ||
      'bg-gradient-to-br from-primary/10 to-primary/20 text-primary'
    );
  });
</script>
