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
import { ref } from 'vue'
import OutfitPreviewPanel from './OutfitPreviewPanel.vue'
import ClothingSelectionPanel from './ClothingSelectionPanel.vue'

// 搭配信息
const outfitName = ref('')
const outfitScene = ref('')
const outfitSeason = ref('')
const outfitStyle = ref('')

// 定义emit
const emit = defineEmits([
  'remove-cloth',
  'reset-clothes',
  'save-outfit',
  'category-change',
  'tag-change',
  'toggle-cloth',
  'reset-filters'
])

// 处理保存搭配
function handleSaveOutfit(outfitInfo) {
  emit('save-outfit', outfitInfo)
}

defineProps({
  selectedClothes: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  },
  activeCategory: {
    type: String,
    default: '全部'
  },
  activeTag: {
    type: String,
    default: ''
  },
  clothes: {
    type: Array,
    default: () => []
  },
  filteredClothes: {
    type: Array,
    default: () => []
  }
})
</script>