<template>
  <div id="create-section" class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
    <!-- 左侧：穿搭预览 -->
    <div class="lg:col-span-1">
      <OutfitPreviewPanel
        v-model:outfitName="service.outfitName"
        v-model:outfitScene="service.outfitScene"
        v-model:outfitSeason="service.outfitSeason"
        v-model:outfitStyle="service.outfitStyle"
        :selectedClothes="clothingItems"
        @remove-cloth="service.removeCloth"
        @reset-clothes="service.resetClothes"
        @save-outfit="service.saveOutfit"
        @add-cloth="service.toggleCloth"
      />
    </div>

    <!-- 右侧：衣物选择 -->
    <div class="lg:col-span-2">
      <ClothingSelectionPanel
        :selected-clothes="service.selectedClothes"
        :categories="service.categories"
        :tags="service.tags"
        :active-category="service.inspirationStore.filters.category"
        :active-tag="service.inspirationStore.filters.tag"
        :clothes="service.inspirationStore.clothes"
        :filtered-clothes="service.filteredClothes"
        @category-change="service.setCategory"
        @tag-change="service.setTag"
        @toggle-cloth="service.toggleCloth"
        @reset-filters="service.resetFilters"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useOutfitCreator } from '@/services/business/outfitCreatorService';
  import OutfitPreviewPanel from './OutfitPreviewPanel.vue';
  import ClothingSelectionPanel from './ClothingSelectionPanel.vue';
  import { useClothingStore } from '@/stores/index';
  const service = useOutfitCreator();
  const clothingStore = useClothingStore();
  const clothingItems = computed(() => clothingStore.clothingItems);

</script>
