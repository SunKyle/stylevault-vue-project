<template>
  <ContentLayout>
    <section>
      <!-- 搜索和上传区 -->
      <WardrobeHeader
        :handleSearch="handleSearch"
        @showUpload="handleAddClothing"
        @viewAll="viewAllCategories"
        :isSearching="isSearching"
      />

      <!-- 加载状态 -->
      <div v-if="loading" class="container mx-auto px-4 mb-12">
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
        
        <!-- 分类空状态 -->
        <div v-if="categories.length === 0" class="flex flex-col items-center justify-center py-8">
          <font-awesome-icon :icon="['fas', 'folder-open']" class="text-neutral-300 text-3xl mb-2" />
          <p class="text-neutral-500 text-sm">暂无分类数据</p>
        </div>
        
        <div v-else class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
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
      <FeaturedOutfits v-if="!loading && !error" :outfits="[]" />

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
        
        <!-- 最近添加空状态 -->
        <div v-if="recentlyAddedItems.length === 0" class="flex flex-col items-center justify-center py-12">
          <img :src= "categoryIcon" class="w-8 h-8 object-contain"/>
          <!-- <font-awesome-icon :icon="['fas', 'plus-circle']" class="text-neutral-300 text-4xl mb-4" /> -->
          <p class="text-neutral-500 mb-4">您还没有添加任何衣物</p>
          <button 
            @click="handleAddClothing" 
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            添加第一件衣物
          </button>
        </div>
        
        <div
          v-else
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
        @closeDrawer="closeDrawer"
        @showUpload="handleAddClothing"
        @toggle-favorite="toggleFavorite"
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

      <!-- 删除确认弹窗 -->
      <ConfirmDialog
        v-model:visible="deleteConfirmVisible"
        title="确认删除"
        content="确定要删除这件衣物吗？此操作不可撤销。"
        confirmText="删除"
        cancelText="取消"
        confirmType="danger"
        @confirm="confirmDelete"
      />
    </section>
  </ContentLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { debounce } from 'lodash';
import ClothingCategory from '../components/ui/ClothingCategory.vue';
import ClothingItem from '../components/ui/molecules/ClothingItem.vue';
import FavoriteSection from '../components/wardrobe/FavoriteSection.vue';
import FeaturedOutfits from '../components/wardrobe/FeaturedOutfits.vue';
import WardrobeHeader from '../components/wardrobe/WardrobeHeader.vue';
import CategoryDrawer from '../components/wardrobe/CategoryDrawer.vue';
import ClothingItemEditor from '../components/wardrobe/ClothingItemEditor.vue';
import ContentLayout from '../components/layout/ContentLayout.vue';
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'; // 通用确认弹窗组件
import { useClothingStore } from '../stores/index';
import { useEnumsStore } from '../stores/index';
import { useRouter } from 'vue-router';
import { showToast } from '../utils/toast';

const router = useRouter();
const clothingStore = useClothingStore();
const enumsStore = useEnumsStore();


// 核心状态
const isDrawerOpen = ref(false);
const searchResults = ref([]);
const isSearchMode = ref(false);
const currentSearchKeyword = ref('');
const currentFilter = ref('all');
const currentSort = ref(null);
const editingItem = ref(null);
const isEditorOpen = ref(false);
const isReadOnlyMode = ref(false);
const isSearching = ref(false);
const deleteConfirmVisible = ref(false);
const currentDeleteItem = ref(null);
const formSubmitted = ref(false);


// 3. 获取分类数据
const categories = computed(() => {
  const merged = new Map();
  clothingStore.categories.forEach(cate => {
    merged.set(cate.id, cate);
  });
  return Array.from(merged.values());
});

// 基础数据计算属性
const selectedCategory = computed(() => clothingStore.selectedCategory);
const loading = computed(() => clothingStore.loading);
const error = computed(() => clothingStore.error);
const recentlyAddedItems = computed(() => clothingStore.recentlyAddedItems);
const clothingItems = computed(() => clothingStore.clothingItems);

// 按分类分组（缓存结果）
const itemsByCategory = computed(() => {
  const result = {};
  clothingItems.value.forEach(item => {
    if (item?.category != null) {
      if (!result[item.category]) {
        result[item.category] = [];
      }
      result[item.category].push(item);
    }
  });
  return result;
});

// --- 工具函数优化：拆分冗长逻辑 ---
// 1. 筛选函数
const filterItems = (items, filterType) => {
  // 始终创建数组副本，避免修改原始数据
  const result = [...items];
  
  if (filterType === 'favorites') {
    return result.filter(item => item.isFavorite);
  }
  if (filterType === 'recent') {
    return result.sort((a, b) => {
      const dateA = new Date(a.purchaseDate || a.createdAt || 0);
      const dateB = new Date(b.purchaseDate || b.createdAt || 0);
      return dateB - dateA;
    });
  }
  return result;
};

// 2. 排序函数
const sortItems = (items, sortType) => {
  // 始终创建数组副本，避免修改原始数据
  const result = [...items];
  
  if (sortType === 'name') {
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }
  return result;
};

// 3. 获取分类衣物数量
const getCategoryItemCount = (categoryId) => {
  if (isSearchMode.value) {
    const results = searchResults.value || [];
    return results.length;
  }

  // 参数校验仅在非搜索模式下生效
  if (categoryId === undefined || categoryId === null) return 0;

  return categoryId === 'all' 
    ? clothingItems.value.length 
    : (itemsByCategory.value[categoryId]?.length || 0);
};

// 4. 获取分类名称
const getSelectedCategoryName = () => {
  if (isSearchMode.value) return `搜索结果: "${currentSearchKeyword.value}"`;
  if (!selectedCategory.value) return '';
  if (selectedCategory.value === 'all') return '全部衣物';
  
  const category = categories.value.find(c => c.id === selectedCategory.value);
  return category?.name || '';
};

// 5. 获取分类衣物
const getCategoryItems = (categoryId) => {
  // 获取基础数据
  let items = [];
  if (isSearchMode.value) {
    // 创建搜索结果的副本，避免修改原始数据
    items = [...(searchResults.value || [])];
  } else {
    // 参数校验仅在非搜索模式下生效
    if (!categoryId) return [];
    
    // 直接从clothingItems中筛选，避免依赖itemsByCategory计算属性
    const allItems = [...clothingStore.clothingItems];
    
    if (categoryId === 'all') {
      items = allItems;
    } else {
      items = allItems.filter(item => item.category === categoryId);
    }
  }
  
  // 应用筛选和排序
  items = filterItems(items, currentFilter.value);
  items = sortItems(items, currentSort.value);

  return items;
};

// --- 业务逻辑优化 ---
// 1. 刷新数据（响应式驱动，移除强制刷新）
const refreshWardrobeData = async () => {
  try {
    await clothingStore.fetchClothingItems(true);
  } catch (error) {
    showToast('数据刷新失败', 'error');
  }
};

// 2. 添加衣物
const handleAddClothing = () => {
  router.push('/upload');
};

// 3. 选择分类
const selectCategory = async (categoryId) => {
  // 参数校验
  if (!categoryId) return;

  // 退出搜索模式
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }

  // 重置筛选排序
  currentFilter.value = 'all';
  currentSort.value = null;

  // 切换分类选中状态
  if (clothingStore.selectedCategory === categoryId) {
    clothingStore.clearSelectedCategory();
    isDrawerOpen.value = false;
  } else {
    clothingStore.setSelectedCategory(categoryId);
    isDrawerOpen.value = true;
    // 主动刷新数据（响应式更新）
    await refreshWardrobeData();
  }
};

// 4. 切换收藏
const toggleFavorite = async (item) => {
  // 参数校验
  if (!item?.id) return;
  console.log('切换收藏:', item);
  try {
    await clothingStore.toggleFavorite(item.id);
    showToast(item.isFavorite ? '已取消收藏' : '已添加到收藏', 'success');
  } catch (error) {
    showToast('操作失败，请重试', 'error');
  }
};

// 5. 搜索防抖（300ms）
const handleSearch = debounce(async (keyword) => {
  console.log('搜索关键词:', keyword);
  if (!keyword.trim()) {
    isSearchMode.value = false;
    searchResults.value = [];
    clothingStore.clearSelectedCategory();
    return;
  }

  try {
    isSearching.value = true;
    isSearchMode.value = true;
    
    const results = await clothingStore.searchClothingItems(keyword);
    console.log('搜索结果:', results);
    searchResults.value = results.data.items;
    clothingStore.clearSelectedCategory();
    currentSearchKeyword.value = keyword;
    
    showToast(`找到 ${results.data.items?.length || 0} 件相关衣物`, 'success');
    isDrawerOpen.value = true;
  } catch (error) {
    console.error('搜索失败:', error);
    showToast('搜索失败，请重试', 'error');
  } finally {
    isSearching.value = false;
  }
}, 300);

// 6. 初始化数据
const initializeData = async () => {
  try {
    await enumsStore.fetchAllEnums();
    await Promise.all([
      clothingStore.fetchCategories(),
      clothingStore.fetchClothingItems()
    ]);
  } catch (error) {
    console.error('初始化数据失败:', error);
    showToast('数据加载失败，请稍后重试', 'error');
  }
};

// 7. 关闭抽屉
const closeDrawer = () => {
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  } else {
    clothingStore.clearSelectedCategory();
  }
  currentFilter.value = 'all';
  currentSort.value = null;
  isDrawerOpen.value = false;
};

// 8. 查看详情
const viewItemDetail = (item) => {
  if (!item) return;
  editingItem.value = item;
  isEditorOpen.value = true;
  isReadOnlyMode.value = true;
};

// 9. 编辑衣物
const editItem = (item) => {
  if (!item) return;
  editingItem.value = item;
  isEditorOpen.value = true;
  isReadOnlyMode.value = false;
};

// 10. 触发删除确认
const deleteItem = (item) => {
  if (!item) return;
  currentDeleteItem.value = item;
  deleteConfirmVisible.value = true;
};

// 11. 确认删除
const confirmDelete = async () => {
  if (!currentDeleteItem.value) return;

  try {
    await clothingStore.deleteClothingItem(currentDeleteItem.value.id);
    showToast('衣物已成功删除', 'success');
    deleteConfirmVisible.value = false;
    
    // 删除后空分类处理
    if (getCategoryItems(selectedCategory.value).length === 0) {
      closeDrawer();
    }
    
    // 刷新数据
    await refreshWardrobeData();
  } catch (error) {
    showToast('删除失败，请重试', 'error');
  }
};

// 12. 查看全部分类
const viewAllCategories = () => {
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }
  
  currentFilter.value = 'all';
  currentSort.value = null;
  clothingStore.setSelectedCategory('all');
  isDrawerOpen.value = true;
};

// 13. 筛选处理
const handleFilter = (filterType) => {
  if (!filterType) return;
  currentFilter.value = filterType;
};

// 14. 排序处理
const handleSort = (sortType) => {
  currentSort.value = sortType;
};

// 15. 编辑保存后处理
const handleEditSaved = async () => {
  console.log('编辑保存:', editingItem.value);
  if (!editingItem.value) return;
  try {
    await clothingStore.updateClothingItem(editingItem.value);
    showToast('衣物信息已更新', 'success');
    formSubmitted.value = true;
  } catch (error) {
    showToast('更新失败，请重试', 'error');
    console.error('更新失败:', error);
    return;
  }
  await refreshWardrobeData();
  closeEditor();
};

// 16. 关闭编辑器
const closeEditor = () => {
  isEditorOpen.value = false;
  editingItem.value = null;
  isReadOnlyMode.value = false;
};

// --- 生命周期优化 ---
onMounted(() => {
  initializeData();
  
  // 全局事件防抖监听
  const debouncedViewAll = debounce(viewAllCategories, 100);
  document.addEventListener('view-all-clothing', debouncedViewAll);
  window._wardrobeViewAllListener = debouncedViewAll;
});

onUnmounted(() => {
  // 清理全局事件
  if (window._wardrobeViewAllListener) {
    document.removeEventListener('view-all-clothing', window._wardrobeViewAllListener);
    delete window._wardrobeViewAllListener;
  }
  
  // 清理防抖定时器
  handleSearch.cancel();
});

// 暴露公共方法
defineExpose({
  refreshWardrobeData
});
</script>

<style scoped>
/* 仅保留核心样式，移除冗余动画 */
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

/* 隐藏滚动条但保持滚动功能 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>