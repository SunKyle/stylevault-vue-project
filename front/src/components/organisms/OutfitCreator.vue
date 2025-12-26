<template>
  <div id="create-section" class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
    <!-- 左侧：穿搭预览 -->
    <div class="lg:col-span-1">
      <OutfitPreviewPanel
        v-model:outfitName="service.outfitName"
        v-model:outfitScene="service.outfitScene"
        v-model:outfitSeason="service.outfitSeason"
        v-model:outfitStyle="service.outfitStyle"
        :selectedClothes="selectedClothes"
        @remove-cloth="service.removeCloth"
        @reset-clothes="service.resetClothes"
        @save-outfit="service.saveOutfit"
        @add-cloth="service.toggleCloth"
      />
    </div>

    <!-- 右侧：衣物选择 -->
    <div class="lg:col-span-2">
      <ClothingSelectionPanel
        :selected-clothes="selectedClothes"
        :categories="categories"
        :tags="tags"
        :active-category="inspirationStore.filters.category"
        :active-tag="inspirationStore.filters.tag"
        :clothes="filteredClothes"
        :filtered-clothes="filteredClothes"
        @category-change="inspirationStore.setCategory"
        @tag-change="inspirationStore.setTag"
        @toggle-cloth="toggleCloth"
        @reset-filters="inspirationStore.resetFilters"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useOutfitCreator } from '@/services/business/outfitCreatorService';
  import OutfitPreviewPanel from './OutfitPreviewPanel.vue';
  import ClothingSelectionPanel from './ClothingSelectionPanel.vue';
  import { useInspirationStore } from '@/stores/modules/inspirationStore';

  const service = useOutfitCreator();
  const inspirationStore = useInspirationStore();

  const categories = computed(() => inspirationStore.categories);
  const tags = computed(() => inspirationStore.tags);
  const filteredClothes = computed(() => inspirationStore.filteredClothes);
  // selectedClothes 统一从 inspirationStore 获取
  const selectedClothes = computed(() => inspirationStore.selectedClothes);
</script>
