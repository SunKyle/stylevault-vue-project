<template>
  <div class="border border-gray-200 rounded-lg p-4 hover:shadow-medium transition-shadow">
    <h2 class="text-xl font-semibold mb-3">{{ title }}</h2>
    <p class="text-gray-500">{{ description }}</p>
    <div v-if="$slots.actions" class="mt-4">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  });
</script>
