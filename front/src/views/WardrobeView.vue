<template>
  <ContentLayout>
    <section :key="forceUpdateKey">
      <!-- 搜索和上传区 -->
      <WardrobeHeader
        :handleSearch="handleSearch"
        @showUpload="handleAddClothing"
        @viewAll="viewAllCategories"
      />

      <!-- 加载状态 -->
      <div v-if="loading" class="container mx-auto px-4 mb-12">
        <div class="flex justify-center items-center h-64">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
          ></div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="container mx-auto px-4 mb-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <font-awesome-icon
            :icon="['fas', 'exclamation-circle']"
            class="text-red-500 text-3xl mb-3"
          />
          <h3 class="text-lg font-medium text-red-800 mb-2">加载失败</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="initializeData"
            class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      </div>

      <!-- 衣物分类 -->
      <div v-else class="container mx-auto px-4 mb-12">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl md:text-2xl font-bold">衣物分类</h3>
          <a
            href="#"
            @click.prevent="viewAllCategories"
            class="text-primary font-medium flex items-center group"
          >
            <span>查看全部</span>
            <font-awesome-icon
              :icon="['fas', 'arrow-right']"
              class="ml-1 text-sm group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
        <div
          class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4"
        >
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
      <div
        v-if="getCategoryItems(selectedCategory).length > 0"
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4"
      >
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
            <font-awesome-icon
              :icon="['fas', 'arrow-right']"
              class="ml-1 text-sm group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
        <div
          class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          <ClothingItem
            v-for="item in recentlyAddedItems"
            :key="item.id"
            :item="item"
            @like="toggleFavorite(item)"
          />
          <!-- 添加更多 -->
          <div class="group relative cursor-pointer" @click="handleAddClothing">
            <div
              class="aspect-square bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 mb-3 border-2 border-dashed border-neutral-200 flex items-center justify-center hover:border-primary hover:bg-primary/5"
            >
              <div class="text-center p-6 group-hover:scale-110 transition-transform">
                <div
                  class="w-14 h-14 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10"
                >
                  <font-awesome-icon
                    :icon="['fas', 'plus']"
                    class="text-neutral-400 text-xl group-hover:text-primary"
                  />
                </div>
                <p class="text-neutral-500 font-medium group-hover:text-primary">添加更多衣物</p>
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
        :key="forceUpdateKey"
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
  </ContentLayout>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue';
  import ClothingCategory from '../components/ui/ClothingCategory.vue';
  import ClothingItem from '../components/ui/ClothingItem.vue';
  import FavoriteSection from '../components/wardrobe/FavoriteSection.vue';
  import FeaturedOutfits from '../components/wardrobe/FeaturedOutfits.vue';
  import WardrobeHeader from '../components/wardrobe/WardrobeHeader.vue';
  import CategoryDrawer from '../components/wardrobe/CategoryDrawer.vue';
  import ClothingItemEditor from '../components/wardrobe/ClothingItemEditor.vue';
  import ContentLayout from '../components/layout/ContentLayout.vue';
  import { useClothingStore } from '../stores/index';
  import { useEnumsStore } from '../stores/index';
  import { useRouter } from 'vue-router';
  import { showToast } from '../utils/toast';
  // import { outfitService } from '../services/outfitService'; // 暂时未使用

  const router = useRouter();
  const clothingStore = useClothingStore();
  const enumsStore = useEnumsStore();
  // const emit = defineEmits(['showUpload']); // 暂时未使用

  // 状态
  const isDrawerOpen = ref(false);
  const searchResults = ref([]);
  const isSearchMode = ref(false);
  const currentSearchKeyword = ref('');
  const currentFilter = ref('all');
  const currentSort = ref(null);
  const editingItem = ref(null);
  const isEditorOpen = ref(false);
  const isReadOnlyMode = ref(false);

  // 计算属性
  const categories = computed(() => clothingStore.categories);
  const selectedCategory = computed(() => clothingStore.selectedCategory);
  const loading = computed(() => clothingStore.loading);
  const error = computed(() => clothingStore.error);
  const recentlyAddedItems = computed(() => clothingStore.recentlyAddedItems);
  // const favoriteItems = computed(() => clothingStore.favoriteItems); // 暂时未使用

  // 精选搭配数据
  // const outfits = ref([]); // 暂时未使用

  // 获取搭配数据
  // const fetchOutfits = async () => { // 暂时未使用
  //   try {
  //     const response = await outfitService.getOutfits();
  //     outfits.value = response.data || [];
  //   } catch (error) {
  //     console.error('获取搭配数据失败:', error);
  //     outfits.value = [];
  //   }
  // };

  function getCategoryItemCount(categoryId) {
    if (isSearchMode.value) return searchResults.value.length;
    if (categoryId === 'all') return clothingStore.clothingItems.length;
    return clothingStore.itemsByCategory[categoryId]?.length || 0;
  }

  // 获取枚举属性的显示文本
  function getEnumLabel(type, id) {
    if (!id) return '';
    const getterMap = {
      category: 'getCategoryLabel',
      style: 'getStyleLabel',
      color: 'getColorLabel',
      season: 'getSeasonLabel',
      material: 'getMaterialLabel',
      pattern: 'getPatternLabel',
      size: 'getSizeLabel',
      condition: 'getConditionLabel',
      status: 'getStatusLabel',
      occasion: 'getOccasionLabel'
    };
    
    const getter = getterMap[type];
    if (getter && enumsStore[getter]) {
      return enumsStore[getter](id) || '';
    }
    return id;
  }

  function getSelectedCategoryName() {
    if (isSearchMode.value) return `搜索结果: "${currentSearchKeyword.value}"`;
    if (!selectedCategory.value) return '';
    if (selectedCategory.value === 'all') return '全部衣物';
    const category = categories.value.find(c => c.id === selectedCategory.value);
    return category ? category.name : '';
  }

  function getCategoryItems(categoryId) {
    // 获取基础数据
    let items;
    if (isSearchMode.value) {
      // 返回搜索结果
      items = [...searchResults.value];
    } else if (categoryId === 'all') {
      // 返回所有衣物
      items = [...clothingStore.clothingItems];
    } else {
      // 使用后端API获取特定分类的衣物
      items = clothingStore.itemsByCategory[categoryId] || [];
    }

    // 应用筛选
    if (currentFilter.value === 'favorites') {
      items = items.filter(item => item.favorite);
    } else if (currentFilter.value === 'recent') {
      items = [...items].sort((a, b) => {
        const dateA = new Date(a.purchaseDate || a.createdAt || 0);
        const dateB = new Date(b.purchaseDate || b.createdAt || 0);
        return dateB - dateA;
      });
    }

    // 应用排序
    if (currentSort.value === 'name') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }

  // 定义暴露的方法
  import { defineExpose } from 'vue';

  // 添加一个方法来刷新数据
  function refreshWardrobeData() {
    // 强制更新组件，确保新添加的衣物能立即显示
    forceUpdate();
  }

  // 在<script setup>中使用defineExpose暴露方法
  defineExpose({
    refreshWardrobeData,
  });

  // 强制更新组件的key
  const forceUpdateKey = ref(0);

  function forceUpdate() {
    forceUpdateKey.value++;
    nextTick(() => {
      console.log('组件已强制更新');
    });
  }

  function handleAddClothing() {
    router.push('/upload');
  }

  onMounted(() => {
    initializeData();

    // 监听全局查看全部衣物事件
    document.addEventListener('view-all-clothing', viewAllCategories);
  });

  onUnmounted(() => {
    // 清理事件监听器
    document.removeEventListener('view-all-clothing', viewAllCategories);
  });

  function selectCategory(categoryId) {
    console.log('点击分类，ID:', categoryId);
    console.log('当前选中分类:', clothingStore.selectedCategory);
    console.log('所有分类:', categories.value);
    console.log('所有衣物:', clothingStore.clothingItems);

    // 如果当前是搜索模式，先退出搜索模式
    if (isSearchMode.value) {
      isSearchMode.value = false;
      searchResults.value = [];
    }

    // 重置筛选和排序状态
    currentFilter.value = 'all';
    currentSort.value = null;

    if (clothingStore.selectedCategory === categoryId) {
      console.log('清除选中分类');
      clothingStore.clearSelectedCategory();
      // 关闭抽屉
      isDrawerOpen.value = false;
    } else {
      console.log('设置选中分类:', categoryId);
      clothingStore.setSelectedCategory(categoryId);
      // 打开抽屉
      isDrawerOpen.value = true;
    }

    console.log('更新后选中分类:', clothingStore.selectedCategory);

    // 强制更新组件
    forceUpdate();
  }

  async function toggleFavorite(item) {
    try {
      await clothingStore.updateClothingItem(item.id, { favorite: !item.favorite });
      showToast(item.favorite ? '已取消收藏' : '已添加到收藏', 'success');
    } catch (error) {
      showToast('操作失败，请重试', 'error');
    }
  }

  async function handleSearch(keyword) {
    console.log('开始搜索，关键词:', keyword);

    if (!keyword.trim()) {
      // 搜索关键词为空，退出搜索模式
      isSearchMode.value = false;
      searchResults.value = [];
      clothingStore.clearSelectedCategory();
      return;
    }

    try {
      // 进入搜索模式
      isSearchMode.value = true;

      // 使用后端API进行搜索
      const results = await clothingStore.searchClothingItems(keyword);
      searchResults.value = results;

      // 搜索时清除分类选择
      clothingStore.clearSelectedCategory();

      // 保存搜索关键词
      currentSearchKeyword.value = keyword;
      showToast(`找到 ${results.length} 件相关衣物`, 'success');
      // 打开抽屉展示
      isDrawerOpen.value = true;
    } catch (error) {
      console.error('搜索失败:', error);
      showToast('搜索失败，请重试', 'error');
    }
  }

  async function initializeData() {
    try {
      // 先获取枚举数据，确保其他数据获取前枚举映射已就绪
      await enumsStore.fetchAllEnums();
      // 再获取分类和衣物数据
      await Promise.all([
        clothingStore.fetchCategories(),
        clothingStore.fetchClothingItems()
      ]);
      console.log('衣物数据加载完成:', clothingStore.clothingItems);
      console.log('分类数据加载完成:', clothingStore.categories);
    } catch (error) {
      console.error('初始化数据失败:', error);
      showToast('数据加载失败，请稍后重试', 'error');
    }
  }

  function closeDrawer() {
    // 如果是搜索模式，清除搜索状态
    if (isSearchMode.value) {
      isSearchMode.value = false;
      searchResults.value = [];
    } else {
      clothingStore.clearSelectedCategory();
    }
    // 重置筛选和排序状态
    currentFilter.value = 'all';
    currentSort.value = null;
    isDrawerOpen.value = false;
  }

  function viewItemDetail(item) {
    // 设置当前查看的衣物
    editingItem.value = item;
    // 打开编辑模态框，设置为只读模式
    isEditorOpen.value = true;
    isReadOnlyMode.value = true;
  }

  function editItem(item) {
    // 设置当前编辑的衣物
    editingItem.value = item;
    // 打开编辑模态框
    isEditorOpen.value = true;
  }

  async function deleteItem(item) {
    // 删除衣物的逻辑
    if (confirm(`确定要删除 "${item.name}" 吗？此操作不可撤销。`)) {
      try {
        await clothingStore.deleteClothingItem(item.id);
        showToast('衣物已成功删除', 'success');
        // 如果删除后当前分类为空，关闭抽屉
        if (getCategoryItems(selectedCategory.value).length === 1) {
          closeDrawer();
        }
      } catch (error) {
        showToast('删除失败，请重试', 'error');
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
    clothingStore.setSelectedCategory('all');

    // 强制更新组件，确保显示最新添加的衣物
    forceUpdate();

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
    initializeData();
  });
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
    0%,
    100% {
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
    0%,
    100% {
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
    75%,
    100% {
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

  .animate-fade-in-delay {
    animation: fade-in-delay 0.5s ease-out;
  }
</style>
