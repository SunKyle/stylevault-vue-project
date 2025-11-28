<template>
  <div class="container mx-auto px-4 mb-12">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold">精选搭配</h3>
      <div class="flex space-x-2">
        <button
          @click="prevOutfit"
          :disabled="currentIndex === 0"
          class="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-neutral-600 text-xs" />
        </button>
        <button
          @click="nextOutfit"
          :disabled="Array.isArray(outfits) ? currentIndex >= outfits.length - itemsPerPage : true"
          class="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-neutral-600 text-xs" />
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <OutfitCard v-for="outfit in displayedOutfits" :key="outfit.title" :outfit="outfit" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import OutfitCard from '../ui/molecules/OutfitCard.vue';

  const props = defineProps({
    outfits: {
      type: Array,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 3,
    },
  });

  const currentIndex = ref(0);

  const displayedOutfits = computed(() => {
    // 确保outfits是数组
    const outfitsArray = Array.isArray(props.outfits) ? props.outfits : [];
    return outfitsArray.slice(currentIndex.value, currentIndex.value + props.itemsPerPage);
  });

  function prevOutfit() {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }

  function nextOutfit() {
    // 确保outfits是数组
    const outfitsArray = Array.isArray(props.outfits) ? props.outfits : [];
    if (currentIndex.value < outfitsArray.length - props.itemsPerPage) {
      currentIndex.value++;
    }
  }
</script>
