<template>
  <div id="create-section" class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
    <!-- 左侧：穿搭预览 -->
    <div class="lg:col-span-1">
      <OutfitPreviewPanel
        v-model:outfitName="outfitName"
        v-model:outfitScene="outfitScene"
        v-model:outfitSeason="outfitSeason"
        v-model:outfitStyle="outfitStyle"
        :selectedClothes="selectedClothes"
        @remove-cloth="$emit('remove-cloth', $event)"
        @reset-clothes="$emit('reset-clothes')"
        @save-outfit="handleSaveOutfit"
        @add-cloth="$emit('toggle-cloth', $event)"
      />
    </div>

    <!-- 右侧：衣物选择 -->
    <div class="lg:col-span-2">
      <ClothingSelectionPanel
        :selectedClothes="selectedClothes"
        :categories="categories"
        :tags="tags"
        :activeCategory="activeCategory"
        :activeTag="activeTag"
        :clothes="clothes"
        :filteredClothes="filteredClothes"
        @category-change="$emit('category-change', $event)"
        @tag-change="$emit('tag-change', $event)"
        @toggle-cloth="$emit('toggle-cloth', $event)"
        @reset-filters="$emit('reset-filters')"
      />
    </div>
  </div>
</template>

<script setup>
  import { useInspirationStore } from '@/stores/inspirationStore';
  import OutfitPreviewPanel from './OutfitPreviewPanel.vue';
  import ClothingSelectionPanel from './ClothingSelectionPanel.vue';

  const inspirationStore = useInspirationStore();

  // 直接从store获取数据
  const {
    outfitName,
    outfitScene,
    outfitSeason,
    outfitStyle,
    filteredClothes,
    selectedClothes,
    categories,
    tags,
    activeCategory,
    activeTag,
  } = inspirationStore;

  // 方法委托给store
  const { removeCloth, resetClothes, saveOutfit, toggleCloth, setCategory, setTag, resetFilters } =
    inspirationStore;
</script>
