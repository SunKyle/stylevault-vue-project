<template>
  <div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        @click="!disabled && toggleSeason(option.value)"
        :disabled="disabled"
        :class="[
          'px-3 py-1.5 rounded-lg text-sm border transition-all duration-300 font-medium shadow-sm',
          {
            // 选中状态使用主题色
            'bg-primary text-white border-primary shadow-md': isSelected(option.value),
            // 默认状态 - 与其他组件保持一致的中性色设计
            'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-primary hover:bg-neutral-200': !isSelected(
              option.value
            ),
            // 禁用状态
            'opacity-50 cursor-not-allowed hover:border-neutral-200 hover:bg-neutral-100': disabled,
          },
          // 为不同季节添加特有的微妙背景色
          getSeasonBackgroundClass(option.value),
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const toggleSeason = value => {
    const current = [...props.modelValue];
    const index = current.indexOf(value);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(value);
    }

    emit('update:modelValue', current);
  };

  const isSelected = value => {
    return props.modelValue.includes(value);
  };

  // 为不同季节添加特有的背景色，增强视觉识别性
  const getSeasonBackgroundClass = season => {
    const seasonColors = {
      spring: 'hover:bg-green-50',
      summer: 'hover:bg-yellow-50',
      autumn: 'hover:bg-orange-50',
      winter: 'hover:bg-blue-50',
      // 其他季节可以根据需要添加
    };

    return seasonColors[season.toLowerCase()] || '';
  };
</script>
