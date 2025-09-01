<template>
  <div :class="['rounded-lg p-5', bgColor]">
    <h3 :class="['text-lg font-semibold mb-2', titleColor]">{{ title }}</h3>
    <p :class="['text-3xl font-bold', valueColor]">{{ value }}</p>
    <p :class="['text-sm mt-1', subtitleColor]">{{ subtitle }}</p>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    bgColor: {
      type: String,
      default: 'bg-blue-50',
    },
    titleColor: {
      type: String,
      default: 'text-blue-800',
    },
    valueColor: {
      type: String,
      default: 'text-blue-600',
    },
    subtitleColor: {
      type: String,
      default: 'text-blue-500',
    },
  });
</script>
