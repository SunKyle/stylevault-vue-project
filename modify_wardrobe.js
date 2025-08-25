// 修改WardrobeSection.vue文件，实现使用分类结果页面展示搜索结果的功能

// 1. 添加新的状态变量
const searchResults = ref([]);
const isSearchMode = ref(false);

// 2. 修改handleSearch函数
async function handleSearch() {
  if (!searchKeyword.value.trim()) return

  try {
    const results = await wardrobeStore.searchClothingItems(searchKeyword.value)
    showToast(`找到 ${results.length} 件相关衣物`, 'success')
    // 保存搜索结果并打开抽屉展示
    searchResults.value = results
    isSearchMode.value = true
    isDrawerOpen.value = true
  } catch (error) {
    showToast('搜索失败，请重试', 'error')
  }
}

// 3. 修改getSelectedCategoryName函数，支持搜索模式
function getSelectedCategoryName() {
  if (isSearchMode.value) return `搜索结果: "${searchKeyword.value}"`;
  if (!selectedCategory.value) return '';
  if (selectedCategory.value === "all") return '全部衣物';
  const category = categories.value.find(c => c.id === selectedCategory.value);
  return category ? category.name : '';
}

// 4. 修改getCategoryItemCount函数，支持搜索模式
function getCategoryItemCount(categoryId) {
  if (isSearchMode.value) return searchResults.value.length;
  return wardrobeStore.itemsByCategory[categoryId]?.length || 0
}

// 5. 修改getCategoryItems函数，支持搜索模式
function getCategoryItems(categoryId) {
  if (isSearchMode.value) {
    // 返回搜索结果
    return searchResults.value;
  }
  if (categoryId === "all") {
    // 返回所有衣物
    let allItems = [];
    Object.values(wardrobeStore.itemsByCategory).forEach(items => {
      allItems = [...allItems, ...items];
    });
    return allItems;
  }
  return wardrobeStore.itemsByCategory[categoryId] || [];
}

// 6. 修改selectCategory函数，在选择分类时退出搜索模式
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

// 7. 修改closeDrawer函数，在关闭抽屉时如果是搜索模式则清除搜索状态
function closeDrawer() {
  // 如果是搜索模式，清除搜索状态
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  } else {
    wardrobeStore.clearSelectedCategory();
  }
  isDrawerOpen.value = false;
}

// 8. 修改viewAllCategories函数，在查看所有分类时退出搜索模式
function viewAllCategories() {
  // 查看所有分类的逻辑
  console.log("查看所有分类");
  // 如果当前是搜索模式，先退出搜索模式
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }
  // 设置一个特殊值表示查看全部
  wardrobeStore.setSelectedCategory("all");
  isDrawerOpen.value = true;
}

// 9. 修改抽屉顶部图标，根据模式显示不同图标
// 在模板中找到:
// <font-awesome-icon :icon="['fas', 'tag']" />
// 替换为:
// <font-awesome-icon :icon="isSearchMode ? ['fas', 'search'] : ['fas', 'tag']" />

// 10. 修改空状态提示文本
// 在模板中找到:
// <h3 class="text-xl font-bold text-gray-900 mb-2 animate-fade-in-delay-1">您的 {{ getSelectedCategoryName() }} 分类还是空的</h3>
// <p class="text-gray-600 mb-6 max-w-md animate-fade-in-delay-2">添加您的第一件衣物，开始构建您的专属数字衣橱，让每一天都充满时尚感</p>
// 替换为:
// <h3 class="text-xl font-bold text-gray-900 mb-2 animate-fade-in-delay-1">
//   {{ isSearchMode ? '没有找到相关衣物' : `您的 ${getSelectedCategoryName()} 分类还是空的` }}
// </h3>
// <p class="text-gray-600 mb-6 max-w-md animate-fade-in-delay-2">
//   {{ isSearchMode ? '请尝试使用其他关键词搜索' : '添加您的第一件衣物，开始构建您的专属数字衣橱，让每一天都充满时尚感' }}
// </p>

// 11. 修改添加衣物按钮文本
// 在模板中找到:
// <span>添加第一件衣物</span>
// 替换为:
// <span>{{ isSearchMode ? '添加衣物' : '添加第一件衣物' }}</span>
