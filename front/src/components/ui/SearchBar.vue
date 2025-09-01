<template>
  <div class="relative mb-6 group">
    <div
      class="absolute inset-0 bg-white/20 rounded-2xl blur-md transform scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"
    ></div>
    <input
      type="text"
      :placeholder="placeholder"
      class="w-full py-4 px-6 pr-14 rounded-2xl shadow-medium focus:outline-none focus:ring-2 focus:ring-white/30 transition-all bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/60 text-base"
      v-model="searchQuery"
      @keyup.enter="handleSearch"
    />
    <font-awesome-icon
      :icon="['fas', 'search']"
      class="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 group-hover:text-white transition-colors text-lg"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    placeholder: {
      type: String,
      default: '搜索衣物、风格或场合...',
    },
  });

  const emit = defineEmits(['search']);

  const searchQuery = ref('');

  function handleSearch() {
    if (searchQuery.value.trim()) {
      emit('search', searchQuery.value);
    }
  }
</script>
