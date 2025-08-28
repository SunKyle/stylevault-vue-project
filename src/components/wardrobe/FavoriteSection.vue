<template>
  <div v-if="!loading && !error && favoriteItems.length > 0" class="container mx-auto px-4 mb-12">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div class="flex items-center space-x-2">
        <h3 class="text-xl md:text-2xl font-bold">我的收藏</h3>
        <span class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          {{ filteredFavoriteItems.length }}
        </span>
      </div>

      <!-- 筛选项 -->
      <div class="flex flex-wrap gap-2">
        <div class="flex items-center space-x-2 bg-white rounded-lg px-3 py-1.5 shadow-sm">
          <font-awesome-icon :icon="['fas', 'filter']" class="text-neutral-500 text-xs" />
          <select
            v-model="selectedCategory"
            class="text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700"
          >
            <option value="">所有分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="flex items-center space-x-2 bg-white rounded-lg px-3 py-1.5 shadow-sm">
          <font-awesome-icon :icon="['fas', 'sort']" class="text-neutral-500 text-xs" />
          <select
            v-model="sortBy"
            class="text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700"
          >
            <option value="recent">最近添加</option>
            <option value="name">名称</option>
            <option value="brand">品牌</option>
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">{{ currentPage }} / {{ totalPages }}</span>
          <div class="flex space-x-1">
            <button
              @click="prevFavorite"
              :disabled="favoriteIndex === 0"
              class="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-neutral-600 text-xs" />
            </button>
            <button
              @click="nextFavorite"
              :disabled="favoriteIndex >= filteredFavoriteItems.length - itemsPerPage"
              class="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <font-awesome-icon
                :icon="['fas', 'chevron-right']"
                class="text-neutral-600 text-xs"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="relative overflow-hidden">
      <transition-group
        name="favorite-fade"
        tag="div"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5"
      >
        <ClothingItem
          v-for="item in displayedFavoriteItems"
          :key="item.id"
          :item="item"
          :showInFavoriteMode="true"
          @like="toggleFavorite(item)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import { useClothingStore } from '@/stores/clothingStore';
  import ClothingItem from '../ui/ClothingItem.vue';

  const clothingStore = useClothingStore();

  // 状态
  const favoriteIndex = ref(0);
  const itemsPerPage = ref(12); // 每页显示12个物品
  const selectedCategory = ref(''); // 选中的分类筛选
  const sortBy = ref('recent'); // 排序方式

  // 计算属性
  const categories = computed(() => clothingStore.categories);
  const favoriteItems = computed(() => clothingStore.favoriteItems);

  // 筛选和排序后的收藏物品
  const filteredFavoriteItems = computed(() => {
    let result = [...favoriteItems.value];

    // 分类筛选
    if (selectedCategory.value) {
      result = result.filter(item => item.categoryId === selectedCategory.value);
    }

    // 排序
    switch (sortBy.value) {
      case 'recent':
        result.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'brand':
        result.sort((a, b) => {
          const brandA = a.brand || '';
          const brandB = b.brand || '';
          return brandA.localeCompare(brandB);
        });
        break;
    }

    return result;
  });

  // 当前页显示的收藏物品
  const displayedFavoriteItems = computed(() => {
    return filteredFavoriteItems.value.slice(
      favoriteIndex.value,
      favoriteIndex.value + itemsPerPage.value
    );
  });

  // 分页计算
  const currentPage = computed(() => Math.floor(favoriteIndex.value / itemsPerPage.value) + 1);
  const totalPages = computed(() =>
    Math.ceil(filteredFavoriteItems.value.length / itemsPerPage.value)
  );
  const loading = computed(() => clothingStore.loading);
  const error = computed(() => clothingStore.error);

  // 方法
  function prevFavorite() {
    if (favoriteIndex.value > 0) favoriteIndex.value -= itemsPerPage.value;
  }

  function nextFavorite() {
    if (favoriteIndex.value < filteredFavoriteItems.value.length - itemsPerPage.value) {
      favoriteIndex.value += itemsPerPage.value;
    }
  }

  // 当筛选条件变化时，重置分页
  function resetPagination() {
    favoriteIndex.value = 0;
  }

  // 监听筛选条件变化
  watch([selectedCategory, sortBy], () => {
    resetPagination();
  });

  async function toggleFavorite(item) {
    try {
      await clothingStore.toggleFavorite(item.id);
    } catch (error) {
      console.error('切换收藏状态失败:', error);
    }
  }
</script>

<style scoped>
  /* 翻页动画效果 */
  .favorite-fade-enter-active,
  .favorite-fade-leave-active {
    transition: all 0.5s ease;
  }

  .favorite-fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .favorite-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .favorite-fade-move {
    transition: transform 0.5s ease;
  }
</style>
