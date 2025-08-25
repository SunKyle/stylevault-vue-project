<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group">
    <div class="relative">
      <img :src="outfit.img" :alt="outfit.title" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div class="p-5 w-full">
          <button class="w-full bg-white text-neutral-800 font-medium py-2.5 rounded-xl hover:bg-neutral-100 transition-colors">
            试穿这套搭配
          </button>
        </div>
      </div>
      <span class="absolute top-4 left-4 bg-white/90 backdrop-blur text-neutral-800 text-xs font-medium px-3 py-1 rounded-full">
        {{ outfit.tag }}
      </span>
    </div>
    <div class="p-5">
      <h4 class="font-bold text-lg mb-2">{{ outfit.title }}</h4>
      <p class="text-neutral-500 text-sm mb-4">{{ outfit.desc }}</p>
      <div class="flex -space-x-2 mb-3">
        <template v-for="(item, idx) in outfit.items" :key="idx">
          <div v-if="item.img" class="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
            <img :src="item.img" :alt="item.alt" class="w-full h-full object-cover">
          </div>
          <div v-else class="w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
            +{{ item.more }}
          </div>
        </template>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <font-awesome-icon :icon="outfit.liked ? ['fas', 'heart'] : ['far', 'heart']" :class="outfit.liked ? 'text-secondary' : 'text-neutral-400'" class="mr-1" />
          <span class="text-sm text-neutral-500">{{ outfit.likes }}</span>
        </div>
        <button class="text-primary text-sm font-medium">保存搭配</button>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  outfit: Object
})
</script>
