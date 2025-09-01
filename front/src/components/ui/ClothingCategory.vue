<template>
  <div
    class="bg-white rounded-xl p-5 text-center shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    :class="{ 'ring-2 ring-primary': selected }"
    @click="$emit('click')"
  >
    <div
      class="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3"
      :class="colorClass"
    >
      <font-awesome-icon :icon="['fas', category.icon]" class="text-2xl" />
    </div>
    <p class="font-medium">{{ category.name }}</p>
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

  defineEmits(['click']);

  // 根据类别ID确定颜色
  const colorClass = computed(() => {
    const colorMap = {
      1: 'bg-blue-100 text-blue-500', // 上装
      2: 'bg-green-100 text-green-500', // 下装
      3: 'bg-purple-100 text-purple-500', // 外套
      4: 'bg-yellow-100 text-yellow-500', // 鞋履
      5: 'bg-pink-100 text-pink-500', // 配饰
      6: 'bg-indigo-100 text-indigo-500', // 包包
    };
    return colorMap[props.category.id] || 'bg-gray-100 text-gray-500';
  });
</script>
