<template>
<section :key="forceUpdateKey">
  <!-- 搜索和上传区 -->
  <WardrobeHeader :handleSearch="handleSearch" @showUpload="$emit('showUpload')" @viewAll="viewAllCategories" />

  <!-- 加载状态 -->
  <div v-if="loading" class="container mx-auto px-4 mb-12">
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="error" class="container mx-auto px-4 mb-12">
    <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-500 text-3xl mb-3" />
      <h3 class="text-lg font-medium text-red-800 mb-2">加载失败</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="initializeData" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
        重试
      </button>
    </div>
  </div>

  <!-- 衣物分类 -->
  <div v-else class="container mx-auto px-4 mb-12">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold">衣物分类</h3>
      <a href="#" @click.prevent="viewAllCategories" class="text-primary font-medium flex items-center group">
        <span>查看全部</span>
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-1 text-sm group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
    <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
      <ClothingCategory
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :count="getCategoryItemCount(category.id)"
        @click="selectCategory(category.id)"
        :selected="selectedCategory === category.id"
      />
    </div>
  </div>

  <!-- 我的收藏 -->
  <FavoriteSection />

  <!-- 精选搭配 -->
  <FeaturedOutfits v-if="!loading && !error" :outfits="outfits" />
    <div v-if="getCategoryItems(selectedCategory).length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
      <ClothingItem
        v-for="item in getCategoryItems(selectedCategory)"
        :key="item.id"
        :item="item"
        @like="toggleFavorite(item)"
        @viewDetail="viewItemDetail"
        class="transform transition-transform hover:scale-105"
      />
    </div>


  <!-- 最近添加的衣物 -->
  <div v-if="!loading && !error && !selectedCategory" class="container mx-auto px-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold">最近添加</h3>
      <a href="#" class="text-primary font-medium flex items-center group">
        <span>管理所有衣物</span>
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-1 text-sm group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
    <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
      <ClothingItem
        v-for="item in recentlyAddedItems"
        :key="item.id"
        :item="item"
        @like="toggleFavorite(item)"
      />
      <!-- 添加更多 -->
      <div class="group relative">
        <div class="aspect-square bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 mb-3 border-2 border-dashed border-neutral-200 flex items-center justify-center">
          <div class="text-center p-6 group-hover:scale-110 transition-transform">
            <div class="w-14 h-14 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-3">
              <font-awesome-icon :icon="['fas', 'plus']" class="text-neutral-400 text-xl" />
            </div>
            <p class="text-neutral-500 font-medium">添加更多衣物</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 分类结果展示 -->
  <CategoryDrawer 
    :isDrawerOpen="isDrawerOpen" 
    :isSearchMode="isSearchMode" 
    :selectedCategory="selectedCategory"
    :getCategoryItems="getCategoryItems"
    :getSelectedCategoryName="getSelectedCategoryName"
    :getCategoryItemCount="getCategoryItemCount"
    @closeDrawer="closeDrawer"
    @showUpload="$emit('showUpload')"
    @toggleFavorite="toggleFavorite"
    @viewItemDetail="viewItemDetail"
    @editItem="editItem"
    @deleteItem="deleteItem"
    @applyFilter="handleFilter"
    @applySort="handleSort"
  />
  
  <!-- 衣物编辑器 -->
  <ClothingItemEditor 
    :isOpen="isEditorOpen" 
    :item="editingItem"
    :readOnly="isReadOnlyMode"
    @close="closeEditor"
    @saved="handleEditSaved"
  />
</section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import ClothingCategory from '../../common/ui/ClothingCategory.vue'
import OutfitCard from '../../common/ui/OutfitCard.vue'
import ClothingItem from '../../common/ui/ClothingItem.vue'
import FavoriteSection from './FavoriteSection.vue'
import SearchBar from '../../common/ui/SearchBar.vue'
import FeaturedOutfits from './FeaturedOutfits.vue'
import WardrobeHeader from './WardrobeHeader.vue'
import CategoryDrawer from './CategoryDrawer.vue'
import ClothingItemEditor from './ClothingItemEditor.vue'
import { useWardrobeStore } from '../../../stores/wardrobeStore'
import { outfitService } from '../../../services/outfitService'
import { useRouter } from 'vue-router'
import { showToast } from '../../../utils/toast'

const router = useRouter()
const wardrobeStore = useWardrobeStore()
const emit = defineEmits(['showUpload'])

// 状态
const isDrawerOpen = ref(false)
const searchResults = ref([])
const isSearchMode = ref(false)
const currentSearchKeyword = ref('')
const currentFilter = ref('all')
const currentSort = ref(null)
const editingItem = ref(null)
const isEditorOpen = ref(false)
const isReadOnlyMode = ref(false)

// 动画事件处理函数
const beforeEnter = () => {
  console.time('动画持续时间')
}

const afterEnter = () => {
  console.timeEnd('动画持续时间')
}

const beforeLeave = () => {
  // 动画开始前的处理
}

const afterLeave = () => {
  // 动画结束后的处理
}

// 计算属性
const categories = computed(() => wardrobeStore.categories)
const selectedCategory = computed(() => wardrobeStore.selectedCategory)
const loading = computed(() => wardrobeStore.loading)
const error = computed(() => wardrobeStore.error)
const recentlyAddedItems = computed(() => wardrobeStore.recentlyAddedItems)
const favoriteItems = computed(() => wardrobeStore.favoriteItems)

// 精选搭配数据
const outfits = ref(outfitService.getOutfits())

function getCategoryItemCount(categoryId) {
  if (isSearchMode.value) return searchResults.value.length;
  if (categoryId === "all") return wardrobeStore.clothingItems.length;
  return wardrobeStore.itemsByCategory[categoryId]?.length || 0
}

function getSelectedCategoryName() {
  if (isSearchMode.value) return `搜索结果: "${currentSearchKeyword.value}"`;
  if (!selectedCategory.value) return '';
  if (selectedCategory.value === "all") return '全部衣物';
  const category = categories.value.find(c => c.id === selectedCategory.value);
  return category ? category.name : '';
}

function getCategoryItems(categoryId) {
  // 获取基础数据
  let items;
  if (isSearchMode.value) {
    // 返回搜索结果
    items = [...searchResults.value];
  } else if (categoryId === "all") {
    // 返回所有衣物
    items = [...wardrobeStore.clothingItems];
  } else {
    items = [...(wardrobeStore.itemsByCategory[categoryId] || [])];
  }
  
  // 应用筛选
  if (currentFilter.value === 'favorites') {
    items = items.filter(item => item.favorite);
  } else if (currentFilter.value === 'recent') {
    // 假设每个物品有createdAt属性，按添加时间排序并取最近添加的
    items = [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  }
  
  // 应用排序
  if (currentSort.value === 'name') {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return items;
}

// 强制更新组件的key
const forceUpdateKey = ref(0);

function forceUpdate() {
  forceUpdateKey.value++;
  nextTick(() => {
    console.log("组件已强制更新");
  });
}

function selectCategory(categoryId) {
  console.log("点击分类，ID:", categoryId);
  console.log("当前选中分类:", wardrobeStore.selectedCategory);
  console.log("所有分类:", categories.value);
  console.log("所有衣物:", wardrobeStore.clothingItems);

  // 如果当前是搜索模式，先退出搜索模式
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }

  // 重置筛选和排序状态
  currentFilter.value = 'all';
  currentSort.value = null;

  if (wardrobeStore.selectedCategory === categoryId) {
    console.log("清除选中分类");
    wardrobeStore.clearSelectedCategory();
    // 关闭抽屉
    isDrawerOpen.value = false;
  } else {
    console.log("设置选中分类:", categoryId);
    wardrobeStore.setSelectedCategory(categoryId);
    // 打开抽屉
    isDrawerOpen.value = true;
  }

  console.log("更新后选中分类:", wardrobeStore.selectedCategory);

  // 强制更新组件
  forceUpdate();
}

async function toggleFavorite(item) {
  try {
    await wardrobeStore.updateClothingItem(item.id, { favorite: !item.favorite })
    showToast(item.favorite ? '已取消收藏' : '已添加到收藏', 'success')
  } catch (error) {
    showToast('操作失败，请重试', 'error')
  }
}

async function handleSearch(keyword) {
  if (!keyword.trim()) return

  try {
    // 保存搜索关键词
    currentSearchKeyword.value = keyword
    const results = await wardrobeStore.searchClothingItems(keyword)
    showToast(`找到 ${results.length} 件相关衣物`, 'success')
    // 保存搜索结果并打开抽屉展示
    searchResults.value = results
    isSearchMode.value = true
    isDrawerOpen.value = true
  } catch (error) {
    showToast('搜索失败，请重试', 'error')
  }
}

function initializeData() {
  wardrobeStore.initializeData()
}

function closeDrawer() {
  // 如果是搜索模式，清除搜索状态
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  } else {
    wardrobeStore.clearSelectedCategory();
  }
  // 重置筛选和排序状态
  currentFilter.value = 'all';
  currentSort.value = null;
  isDrawerOpen.value = false;
}

function viewItemDetail(item) {
  // 设置当前查看的衣物
  editingItem.value = item
  // 打开编辑模态框，设置为只读模式
  isEditorOpen.value = true
  isReadOnlyMode.value = true
}

function editItem(item) {
  // 设置当前编辑的衣物
  editingItem.value = item
  // 打开编辑模态框
  isEditorOpen.value = true
}

async function deleteItem(item) {
  // 删除衣物的逻辑
  if (confirm(`确定要删除 "${item.name}" 吗？此操作不可撤销。`)) {
    try {
      await wardrobeStore.deleteClothingItem(item.id)
      showToast('衣物已成功删除', 'success')
      // 如果删除后当前分类为空，关闭抽屉
      if (getCategoryItems(selectedCategory.value).length === 1) {
        closeDrawer()
      }
    } catch (error) {
      showToast('删除失败，请重试', 'error')
    }
  }
}

function viewAllCategories() {
  // 查看所有分类的逻辑
  // 如果当前是搜索模式，先退出搜索模式
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }
  // 重置筛选和排序状态
  currentFilter.value = 'all';
  currentSort.value = null;
  // 设置一个特殊值表示查看全部
  wardrobeStore.setSelectedCategory("all");
  isDrawerOpen.value = true;
}

// 筛选处理函数
function handleFilter(filterType) {
  currentFilter.value = filterType;
  // 强制更新组件，以应用筛选
  forceUpdate();
}

// 排序处理函数
function handleSort(sortType) {
  currentSort.value = sortType;
  // 强制更新组件，以应用排序
  forceUpdate();
}

// 处理编辑保存
function handleEditSaved() {
  // 编辑保存后强制更新组件，刷新数据
  forceUpdate();
}

// 关闭编辑器
function closeEditor() {
  isEditorOpen.value = false;
  editingItem.value = null;
  isReadOnlyMode.value = false;
}

// 生命周期
onMounted(() => {
  initializeData()
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.slide-up-enter-active {
  animation-name: slideUpIn;
  animation-duration: 1s;
}

.slide-up-leave-active {
  animation-name: slideUpOut;
  animation-duration: 0.3s;
}

.slide-up-enter-from {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}

.slide-up-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.slide-up-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.slide-up-leave-to {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}

@keyframes slideUpIn {
  from {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideUpOut {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
}

/* 隐藏滚动条但保持滚动功能 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 交错淡入动画 */
.staggered-fade-enter-active {
  transition: all 0.5s ease;
}

.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.staggered-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 向上淡入动画 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 慢速脉冲动画 */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 慢速扩散动画 */
@keyframes ping-slow {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* 弹跳进入动画 */
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

/* 延迟淡入动画 */
@keyframes fade-in-delay {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-delay-1 {
  animation: fade-in-delay 0.6s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
  animation: fade-in-delay 0.6s ease-out 0.4s both;
}

.animate-fade-in-delay-3 {
  animation: fade-in-delay 0.6s ease-out 0.6s both;
}

/* 温和弹跳动画 */
@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.hover\:animate-bounce-gentle:hover {
  animation: bounce-gentle 1s ease-in-out infinite;
}
</style>
