<template>
  <div class="flex-grow pt-20 pb-20 container mx-auto px-4">
    <slot name="header">
      <h1 v-if="title" class="text-3xl font-bold mb-6">{{ title }}</h1>
    </slot>
    <div class="bg-white rounded-xl shadow-soft p-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      default: '',
    },
  });
</script>
