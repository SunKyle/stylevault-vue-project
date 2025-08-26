<template>
  <section class="py-10">
    <div class="container mx-auto px-4">
      <!-- 已保存搭配展示区域 -->
      <SavedOutfits 
        :savedOutfits="savedOutfits"
        :currentPage="currentPage"
        :itemsPerPage="itemsPerPage"
        :totalPages="totalPages"
        :currentPageOutfits="currentPageOutfits"
        @load-outfit="loadOutfit"
        @delete-outfit="deleteOutfit"
        @share-outfit="shareOutfit"
        @page-change="currentPage = $event"
        @scroll-to-create="scrollToCreateSection"
      />

      <!-- 创建搭配区域 -->
      <OutfitCreator
        :selectedClothes="selectedClothes"
        :clothes="clothes"
        :categories="categories"
        :tags="tags"
        :activeCategory="activeCategory"
        :activeTag="activeTag"
        :filteredClothes="filteredClothes"
        @toggle-cloth="toggleCloth"
        @remove-cloth="removeCloth"
        @reset-clothes="resetClothes"
        @save-outfit="saveOutfit"
        @category-change="activeCategory = $event"
        @tag-change="activeTag = $event"
        @reset-filters="activeCategory = '全部'; activeTag = ''"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useWardrobeStore } from '../../../stores/wardrobeStore'
import { scenesMockData, getClothesWithTags } from '../../../mock/wardrobe'
import SavedOutfits from './SavedOutfits.vue'
import OutfitCreator from './OutfitCreator.vue'

const wardrobeStore = useWardrobeStore()
const categories = computed(() => ['全部', ...wardrobeStore.categories.map(c => c.name)])

// 分页相关数据
const currentPage = ref(1)
const itemsPerPage = ref(4) // 每页显示的卡片数量

// 从wardrobeStore获取转换后的数据
const clothes = ref([])

// 监听clothingItems变化，自动转换数据
watch(
  () => wardrobeStore.clothingItems,
  (newItems) => {
    if (newItems.length > 0) {
      clothes.value = getClothesWithTags(newItems)
    }
  },
  { immediate: true }
)

// 获取所有唯一的标签
const allTags = computed(() => {
  const tagSet = new Set()
  if (Array.isArray(clothes.value)) {
    clothes.value.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagSet.add(tag))
      }
    })
  }
  return Array.from(tagSet)
})

// 添加"最近穿着"标签
const tags = computed(() => {
  return ['最近穿着', ...allTags.value]
})
const activeCategory = ref('全部')
const activeTag = ref('')
const selectedClothes = ref([])
const savedOutfits = ref([])

// 计算当前页要显示的搭配
const currentPageOutfits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  // 过滤掉无效的搭配对象
  return savedOutfits.value.slice(start, end).filter(outfit => outfit && outfit.id && outfit.name)
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(savedOutfits.value.length / itemsPerPage.value)
})

// 组件挂载时加载已保存的搭配
onMounted(() => {
  loadSavedOutfits()
  // 确保从store获取数据
  if (wardrobeStore.categories.length === 0) {
    wardrobeStore.fetchCategories()
  }
  if (wardrobeStore.clothingItems.length === 0) {
    wardrobeStore.fetchClothingItems()
  }
})

const filteredClothes = computed(() => {
  return clothes.value.filter(item => {
    const catMatch = activeCategory.value === '全部' || item.category === activeCategory.value
    const tagMatch = !activeTag.value || item.tags.includes(activeTag.value)
    return catMatch && tagMatch
  })
})

function addCloth(item) {
  if (!selectedClothes.value.find(i => i.name === item.name)) {
    selectedClothes.value.push(item)
  }
}

function removeCloth(idx) {
  selectedClothes.value.splice(idx, 1)
}

function resetClothes() {
  selectedClothes.value = []
}

function toggleCloth(item) {
  const index = selectedClothes.value.findIndex(i => i.name === item.name)
  if (index === -1) {
    // 如果未选中，则添加
    selectedClothes.value.push(item)
  } else {
    // 如果已选中，则移除
    selectedClothes.value.splice(index, 1)
  }
}

// 滚动到创建搭配区域
function scrollToCreateSection() {
  const element = document.getElementById('create-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 加载已保存的搭配
function loadSavedOutfits() {
  const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
  savedOutfits.value = outfits
}

// 保存穿搭方案
function saveOutfit(outfitInfo) {
  if (selectedClothes.value.length === 0) {
    alert('请至少选择一件衣物')
    return
  }

  // 使用从组件传递的搭配信息
  const outfitName = outfitInfo.name
  const outfitScene = outfitInfo.scene

  // 创建一个新的穿搭方案
  const newOutfit = {
    id: Date.now(), // 使用时间戳作为ID
    name: outfitName,
    scene: outfitScene || undefined,
    items: [...selectedClothes.value],
    createdAt: new Date()
  }

  // 保存到本地存储
  const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
  outfits.push(newOutfit)
  localStorage.setItem('savedOutfits', JSON.stringify(outfits))

  // 更新已保存搭配列表
  loadSavedOutfits()

  // 显示成功消息
  alert('穿搭方案已保存！')

  // 重置当前搭配
  resetClothes()
}

// 加载搭配方案
function loadOutfit(outfit) {
  selectedClothes.value = Array.isArray(outfit.items) ? [...outfit.items] : []
  // 滚动到搭配预览区域
  nextTick(() => {
    const element = document.getElementById('create-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// 删除搭配方案
function deleteOutfit(index) {
  if (confirm('确定要删除这个搭配方案吗？')) {
    const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
    outfits.splice(index, 1)
    localStorage.setItem('savedOutfits', JSON.stringify(outfits))

    // 更新已保存搭配列表
    loadSavedOutfits()
  }
}

// 格式化日期
function formatDate(date) {
  const d = new Date(date)
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
}

// 获取搭配衣物类型统计
function getOutfitStats(items) {
  const stats = {}
  items.forEach(item => {
    // 提取类型（如"上衣"、"裤子"等）
    const type = item.type.split(' · ')[0]
    if (stats[type]) {
      stats[type]++
    } else {
      stats[type] = 1
    }
  })
  return stats
}

// 获取搭配标签
function getOutfitTags(items) {
  const tags = new Set()
  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
}

// 获取搭配评分（模拟）
function getOutfitRating(outfit) {
  // 基于衣物数量和搭配多样性计算评分
  if (!outfit.items || outfit.items.length === 0) return 0

  // 基础分 5 分
  let baseScore = 5

  // 衣物数量加分 (最多 3 分)
  const quantityBonus = Math.min(Math.floor(outfit.items.length / 2), 3)

  // 搭配多样性加分 (最多 2 分)
  const types = new Set(outfit.items.map(item => item.type.split(' · ')[0]))
  const diversityBonus = Math.min(types.size - 1, 2)

  return baseScore + quantityBonus + diversityBonus
}

// 获取随机点赞数（模拟）
function getRandomLikes() {
  return Math.floor(Math.random() * 100) + 1
}

// 获取随机评论数（模拟）
function getRandomComments() {
  return Math.floor(Math.random() * 20) + 1
}

// 分享搭配方案
function shareOutfit(outfit) {
  alert('分享功能已触发：' + outfit.name)
  // 实际实现时可以调用系统分享API或生成分享链接
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* 悬停动画增强 */
.group:hover .text-primary {
  color: theme('colors.primary', #3b82f6);
}

/* 卡片悬停效果增强 */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}
</style>
