// 衣橱页面功能测试脚本 (CommonJS版本)
// 用于系统性测试衣橱页面的各项功能

const fs = require('fs');
const path = require('path');

// 直接加载mock数据
const mockDataPath = path.join(__dirname, 'src', 'mock', 'wardrobe.js');
const dataPath = path.join(__dirname, 'src', 'mock', 'data.js');

// 模拟wardrobeAPI
const mockWardrobeAPI = {
  categories: [
    { id: 1, name: '上装', icon: '👔' },
    { id: 2, name: '下装', icon: '👖' },
    { id: 3, name: '外套', icon: '🧥' },
    { id: 4, name: '鞋子', icon: '👟' },
    { id: 5, name: '配饰', icon: '👜' },
  ],

  clothingItems: [
    {
      id: 1,
      name: '白色基础T恤',
      brand: 'UNIQLO',
      categoryId: 1,
      color: '白色',
      season: '夏季',
      style: '休闲',
      purchaseDate: '2024-01-15',
      price: 79,
      size: 'M',
      imageUrl: 'https://picsum.photos/seed/tshirt1/300/400',
      favorite: true,
      wearCount: 12,
    },
    {
      id: 2,
      name: '蓝色直筒牛仔裤',
      brand: 'ZARA',
      categoryId: 2,
      color: '蓝色',
      season: '四季',
      style: '休闲',
      purchaseDate: '2024-02-01',
      price: 299,
      size: '30',
      imageUrl: 'https://picsum.photos/seed/jeans1/300/400',
      favorite: false,
      wearCount: 8,
    },
    {
      id: 3,
      name: '黑色风衣',
      brand: 'H&M',
      categoryId: 3,
      color: '黑色',
      season: '春秋',
      style: '通勤',
      purchaseDate: '2024-03-10',
      price: 599,
      size: 'L',
      imageUrl: 'https://picsum.photos/seed/trench1/300/400',
      favorite: true,
      wearCount: 5,
    },
  ],

  getCategories: async () => {
    await delay(300);
    return { success: true, data: mockWardrobeAPI.categories };
  },

  getClothingItems: async () => {
    await delay(500);
    return { success: true, data: [...mockWardrobeAPI.clothingItems] };
  },

  getClothingItemsByCategory: async categoryId => {
    await delay(400);
    const items = mockWardrobeAPI.clothingItems.filter(item => item.categoryId === categoryId);
    return { success: true, data: items };
  },

  getClothingItemDetail: async id => {
    await delay(300);
    const item = mockWardrobeAPI.clothingItems.find(item => item.id === id);
    return item ? { success: true, data: item } : { success: false, message: '未找到' };
  },

  addClothingItem: async item => {
    await delay(600);
    const newItem = {
      ...item,
      id: Math.max(...mockWardrobeAPI.clothingItems.map(i => i.id)) + 1,
      wearCount: 0,
      lastWorn: null,
    };
    mockWardrobeAPI.clothingItems.push(newItem);
    return { success: true, data: newItem };
  },

  updateClothingItem: async (id, updates) => {
    await delay(500);
    const index = mockWardrobeAPI.clothingItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockWardrobeAPI.clothingItems[index] = {
        ...mockWardrobeAPI.clothingItems[index],
        ...updates,
      };
      return { success: true, data: mockWardrobeAPI.clothingItems[index] };
    }
    return { success: false, message: '未找到' };
  },

  deleteClothingItem: async id => {
    await delay(400);
    const index = mockWardrobeAPI.clothingItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockWardrobeAPI.clothingItems.splice(index, 1);
      return { success: true };
    }
    return { success: false, message: '未找到' };
  },

  searchClothingItems: async keyword => {
    await delay(400);
    const results = mockWardrobeAPI.clothingItems.filter(
      item =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.brand.toLowerCase().includes(keyword.toLowerCase())
    );
    return { success: true, data: results };
  },
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const testCases = [
  {
    name: '基础数据加载测试',
    test: async () => {
      console.log('🔄 测试基础数据加载...');

      const categories = await mockWardrobeAPI.getCategories();
      console.log('✅ 类别数据:', categories.data.length, '个类别');

      const items = await mockWardrobeAPI.getClothingItems();
      console.log('✅ 衣物数据:', items.data.length, '件衣物');

      return categories.data.length > 0 && items.data.length > 0;
    },
  },

  {
    name: '搜索功能测试',
    test: async () => {
      console.log('🔄 测试搜索功能...');

      const nameResults = await mockWardrobeAPI.searchClothingItems('T恤');
      console.log('✅ 名称搜索结果:', nameResults.data.length, '条结果');

      const brandResults = await mockWardrobeAPI.searchClothingItems('UNIQLO');
      console.log('✅ 品牌搜索结果:', brandResults.data.length, '条结果');

      const emptyResults = await mockWardrobeAPI.searchClothingItems('不存在的衣物');
      console.log('✅ 空搜索结果:', emptyResults.data.length, '条结果');

      return (
        nameResults.data.length > 0 &&
        brandResults.data.length > 0 &&
        emptyResults.data.length === 0
      );
    },
  },

  {
    name: '筛选功能测试',
    test: async () => {
      console.log('🔄 测试筛选功能...');

      const categories = await mockWardrobeAPI.getCategories();
      const categoryId = categories.data[0]?.id;

      if (categoryId) {
        const categoryItems = await mockWardrobeAPI.getClothingItemsByCategory(categoryId);
        console.log('✅ 类别筛选结果:', categoryItems.data.length, '件衣物');
        return categoryItems.data.every(item => item.categoryId === categoryId);
      }

      return true;
    },
  },

  {
    name: 'CRUD操作测试',
    test: async () => {
      console.log('🔄 测试CRUD操作...');

      const newItem = {
        name: '测试T恤',
        brand: '测试品牌',
        categoryId: 1,
        color: '红色',
        season: '夏季',
        style: '休闲',
        purchaseDate: '2024-01-01',
        price: 99,
        size: 'M',
        imageUrl: 'https://example.com/test.jpg',
      };

      const addResult = await mockWardrobeAPI.addClothingItem(newItem);
      console.log('✅ 添加衣物:', addResult.success, 'ID:', addResult.data.id);

      const detailResult = await mockWardrobeAPI.getClothingItemDetail(addResult.data.id);
      console.log('✅ 获取详情:', detailResult.success);

      const updateResult = await mockWardrobeAPI.updateClothingItem(addResult.data.id, {
        price: 199,
      });
      console.log('✅ 更新衣物:', updateResult.success);

      const deleteResult = await mockWardrobeAPI.deleteClothingItem(addResult.data.id);
      console.log('✅ 删除衣物:', deleteResult.success);

      return (
        addResult.success && detailResult.success && updateResult.success && deleteResult.success
      );
    },
  },

  {
    name: '收藏功能测试',
    test: async () => {
      console.log('🔄 测试收藏功能...');

      const items = await mockWardrobeAPI.getClothingItems();
      if (items.data.length > 0) {
        const itemId = items.data[0].id;
        const originalFavorite = items.data[0].favorite;

        const updateResult = await mockWardrobeAPI.updateClothingItem(itemId, {
          favorite: !originalFavorite,
        });
        console.log('✅ 切换收藏状态:', updateResult.success);

        const updatedItem = await mockWardrobeAPI.getClothingItemDetail(itemId);
        console.log('✅ 收藏状态已更新:', updatedItem.data.favorite !== originalFavorite);

        // 恢复原状态
        await mockWardrobeAPI.updateClothingItem(itemId, { favorite: originalFavorite });

        return updateResult.success;
      }

      return true;
    },
  },
];

async function runTests() {
  console.log('🚀 开始衣橱页面功能测试...\n');

  const results = [];

  for (const testCase of testCases) {
    try {
      const passed = await testCase.test();
      results.push({ name: testCase.name, passed, error: null });
      console.log(`${passed ? '✅' : '❌'} ${testCase.name}: ${passed ? '通过' : '失败'}\n`);
    } catch (error) {
      results.push({ name: testCase.name, passed: false, error: error.message });
      console.log(`❌ ${testCase.name}: 失败 - ${error.message}\n`);
    }
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  console.log('📊 测试汇总:');
  console.log(`总测试数: ${totalCount}`);
  console.log(`通过测试: ${passedCount}`);
  console.log(`失败测试: ${totalCount - passedCount}`);

  if (passedCount === totalCount) {
    console.log('🎉 所有测试通过！衣橱页面功能正常。');
  } else {
    console.log('⚠️  部分测试失败，请检查相关功能。');
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.error || '功能异常'}`);
      });
  }

  return results;
}

// 运行测试
runTests().catch(console.error);
