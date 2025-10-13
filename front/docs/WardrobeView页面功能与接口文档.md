# WardrobeView页面功能与接口文档

## 1. 概述

WardrobeView.vue是StyleVault应用的核心页面，负责展示用户的衣橱内容，包括衣物分类、最近添加的衣物、收藏的衣物以及精选搭配。该页面提供了完整的衣物管理功能，如搜索、筛选、排序、添加、编辑和删除衣物等操作。

## 2. 功能点梳理 (6A工作流)

### 2.1 数据加载与初始化 (Analyze)

**功能描述**：页面加载时初始化所有必要的数据，包括衣物分类和衣物列表。

**实现方式**：
- 在组件挂载时通过`onMounted`生命周期钩子调用`initializeData`函数
- `initializeData`函数分别调用`clothingStore.fetchCategories()`和`clothingStore.fetchClothingItems()`方法获取数据
- 实现加载状态和错误状态的显示与处理

**相关代码**：
```javascript
onMounted(() => {
  initializeData();
  document.addEventListener('view-all-clothing', viewAllCategories);
});

async function initializeData() {
  await clothingStore.fetchCategories();
  await clothingStore.fetchClothingItems();
}
```

### 2.2 衣物分类管理 (Arrange)

**功能描述**：展示衣物分类列表，并支持选择不同分类查看相应的衣物。

**实现方式**：
- 通过`categories`计算属性获取分类列表
- 使用`ClothingCategory`组件渲染分类项
- 点击分类项时调用`selectCategory`函数切换选中状态
- 选中分类后打开抽屉展示该分类下的所有衣物

**相关代码**：
```javascript
function selectCategory(categoryId) {
  // 如果当前是搜索模式，先退出搜索模式
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }

  // 重置筛选和排序状态
  currentFilter.value = 'all';
  currentSort.value = null;

  if (clothingStore.selectedCategory === categoryId) {
    clothingStore.clearSelectedCategory();
    isDrawerOpen.value = false;
  } else {
    clothingStore.setSelectedCategory(categoryId);
    isDrawerOpen.value = true;
  }

  forceUpdate();
}
```

### 2.3 衣物搜索功能 (Act)

**功能描述**：提供关键词搜索衣物的功能。

**实现方式**：
- 通过`WardrobeHeader`组件中的搜索框输入关键词
- 调用`handleSearch`函数处理搜索逻辑
- 使用`clothingStore.searchClothingItems(keyword)`方法进行搜索
- 搜索结果显示在抽屉中

**相关代码**：
```javascript
async function handleSearch(keyword) {
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
```

### 2.4 衣物展示功能 (Appear)

**功能描述**：展示不同类型的衣物列表。

**实现方式**：
- 显示最近添加的衣物（通过`recentlyAddedItems`计算属性）
- 显示收藏的衣物（通过`FavoriteSection`组件）
- 显示精选搭配（通过`FeaturedOutfits`组件）
- 显示分类下的衣物（通过`getCategoryItems`函数）
- 使用`ClothingItem`组件渲染单个衣物项

**相关代码**：
```javascript
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
```

### 2.5 衣物操作功能 (Action)

**功能描述**：提供对衣物的各种操作，如添加、编辑、删除和收藏。

**实现方式**：
- 添加衣物：跳转到上传页面
- 切换收藏状态：调用`toggleFavorite`函数
- 查看衣物详情：调用`viewItemDetail`函数，以只读模式打开编辑器
- 编辑衣物：调用`editItem`函数，打开编辑器
- 删除衣物：调用`deleteItem`函数，显示确认对话框后删除

**相关代码**：
```javascript
async function toggleFavorite(item) {
  try {
    await clothingStore.updateClothingItem(item.id, { favorite: !item.favorite });
    showToast(item.favorite ? '已取消收藏' : '已添加到收藏', 'success');
  } catch (error) {
    showToast('操作失败，请重试', 'error');
  }
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
```

### 2.6 筛选和排序功能 (Adjust)

**功能描述**：提供对衣物列表的筛选和排序功能。

**实现方式**：
- 筛选：通过`handleFilter`函数设置筛选条件
- 排序：通过`handleSort`函数设置排序方式
- 筛选和排序后强制更新组件以显示结果

**相关代码**：
```javascript
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

// 强制更新组件的key
const forceUpdateKey = ref(0);

function forceUpdate() {
  forceUpdateKey.value++;
  nextTick(() => {
    console.log('组件已强制更新');
  });
}
```

## 3. 接口调用详情

WardrobeView.vue页面通过clothingStore调用了多个后端接口，以下是详细的接口信息：

### 3.1 fetchCategories

**功能**：获取所有衣物类别

**调用路径**：`clothingStore.fetchCategories()` -> `clothingAdapter.fetchCategories()` -> `clothingService.getCategories()` -> `clothingAdaptorApi.getCategories()`

**输入参数**：无

**输出数据**：
```javascript
// 返回的类别数组格式
[
  {
    id: number,      // 类别ID
    name: string,    // 类别名称
    icon: string,    // 类别图标
    color: string    // 类别颜色
  },
  // 更多类别...
]
```

### 3.2 fetchClothingItems

**功能**：获取所有衣物列表

**调用路径**：`clothingStore.fetchClothingItems()` -> `clothingAdapter.fetchClothingItems()` -> `clothingService.getClothingItems()` -> `clothingAdaptorApi.getClothingItems()`

**输入参数**：
- `forceRefresh`: boolean (可选，默认为false，表示是否强制刷新缓存)

**输出数据**：
```javascript
// 返回的衣物数组格式
{
  items: [
    {
      id: number,          // 衣物ID
      name: string,        // 衣物名称
      categoryId: number,  // 类别ID
      price: number,       // 价格
      purchaseDate: string,// 购买日期
      color: string,       // 颜色
      brand: string,       // 品牌
      size: string,        // 尺寸
      material: string,    // 材质
      season: string,      // 季节
      imageUrl: string,    // 图片URL
      favorite: boolean,   // 是否收藏
      wearCount: number,   // 穿着次数
      createdAt: string    // 创建时间
    },
    // 更多衣物...
  ],
  pagination: {
    currentPage: number,    // 当前页码
    itemsPerPage: number,   // 每页条数
    totalItems: number      // 总条数
  }
}
```

### 3.3 searchClothingItems

**功能**：搜索衣物

**调用路径**：`clothingStore.searchClothingItems(keyword)` -> `clothingAdapter.searchClothingItems(keyword)` -> `clothingService.searchClothingItems(keyword)` -> `clothingAdaptorApi.searchClothingItems(keyword)`

**输入参数**：
- `keyword`: string (搜索关键词)

**输出数据**：
```javascript
// 返回的搜索结果数组格式（与fetchClothingItems的items数组格式相同）
[
  {
    id: number,          // 衣物ID
    name: string,        // 衣物名称
    categoryId: number,  // 类别ID
    // 其他衣物属性...
  },
  // 更多搜索结果...
]
```

### 3.4 updateClothingItem

**功能**：更新衣物信息

**调用路径**：`clothingStore.updateClothingItem(id, updates)` -> `clothingAdapter.updateClothingItem(id, updates)` -> `clothingService.updateClothingItem(id, updates)` -> `clothingAdaptorApi.updateClothingItem(id, updates)`

**输入参数**：
- `id`: number (衣物ID)
- `updates`: object (要更新的衣物属性，如 { favorite: true })

**输出数据**：
```javascript
// 返回的更新后的衣物对象
{
  id: number,          // 衣物ID
  name: string,        // 衣物名称
  categoryId: number,  // 类别ID
  // 其他更新后的衣物属性...
}
```

### 3.5 deleteClothingItem

**功能**：删除衣物

**调用路径**：`clothingStore.deleteClothingItem(id)` -> `clothingAdapter.deleteClothingItem(id)` -> `clothingService.deleteClothingItem(id)` -> `clothingAdaptorApi.deleteClothingItem(id)`

**输入参数**：
- `id`: number (衣物ID)

**输出数据**：
- 返回布尔值`true`表示删除成功

### 3.6 fetchClothingItemDetail

**功能**：获取衣物详情

**调用路径**：`clothingStore.fetchClothingItemDetail(id)` -> `clothingAdapter.fetchClothingItemDetail(id)` -> `clothingService.getClothingItemDetail(id)` -> `clothingAdaptorApi.getClothingItemDetail(id)`

**输入参数**：
- `id`: number (衣物ID)

**输出数据**：
```javascript
// 返回的衣物详情对象
{
  id: number,          // 衣物ID
  name: string,        // 衣物名称
  categoryId: number,  // 类别ID
  price: number,       // 价格
  purchaseDate: string,// 购买日期
  color: string,       // 颜色
  brand: string,       // 品牌
  size: string,        // 尺寸
  material: string,    // 材质
  season: string,      // 季节
  imageUrl: string,    // 图片URL
  favorite: boolean,   // 是否收藏
  wearCount: number,   // 穿着次数
  createdAt: string,   // 创建时间
  updatedAt: string    // 更新时间
}
```

### 3.7 fetchFavoriteItems

**功能**：获取收藏的衣物

**调用路径**：`clothingStore.fetchFavoriteItems()` -> `clothingAdapter.fetchFavoriteItems()` -> `clothingService.getFavoriteItems()` -> `clothingAdaptorApi.getFavoriteItems()`

**输入参数**：无

**输出数据**：
```javascript
// 返回的收藏衣物数组格式（与fetchClothingItems的items数组格式相同）
[
  {
    id: number,          // 衣物ID
    name: string,        // 衣物名称
    categoryId: number,  // 类别ID
    // 其他衣物属性...
  },
  // 更多收藏衣物...
]
```

## 4. 数据流与状态管理

### 4.1 状态管理

WardrobeView.vue使用了以下状态来管理页面的交互：

- `isDrawerOpen`: 控制分类结果抽屉的显示/隐藏
- `searchResults`: 存储搜索结果
- `isSearchMode`: 标识是否处于搜索模式
- `currentSearchKeyword`: 当前搜索关键词
- `currentFilter`: 当前筛选条件
- `currentSort`: 当前排序方式
- `editingItem`: 当前正在编辑的衣物
- `isEditorOpen`: 控制衣物编辑器的显示/隐藏
- `isReadOnlyMode`: 控制编辑器是否为只读模式
- `forceUpdateKey`: 用于强制更新组件的key

### 4.2 计算属性

页面使用了多个计算属性来获取和处理数据：

- `categories`: 获取衣物分类列表
- `selectedCategory`: 获取当前选中的分类
- `loading`: 获取加载状态
- `error`: 获取错误信息
- `recentlyAddedItems`: 获取最近添加的衣物

### 4.3 数据流

数据流主要遵循以下路径：

1. 组件挂载 -> 调用`initializeData` -> 调用`clothingStore`方法 -> 调用`clothingAdapter`方法 -> 调用`clothingService`方法 -> 调用`clothingAdaptorApi`方法 -> 发送API请求
2. API请求返回数据 -> 更新`clothingStore`状态 -> 组件通过计算属性获取更新后的数据 -> 重新渲染界面
3. 用户操作 -> 调用组件方法 -> 更新组件状态或调用`clothingStore`方法 -> 重新渲染界面

## 5. 总结

WardrobeView.vue页面是StyleVault应用的核心功能页面，提供了完整的衣橱管理功能。页面通过clothingStore间接调用了多个后端API，实现了衣物的查询、搜索、添加、编辑、删除和收藏等功能。页面的UI设计清晰，交互流畅，状态管理完善，能够满足用户管理个人衣橱的各种需求。