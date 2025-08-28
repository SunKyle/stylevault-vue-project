// 衣橱页面功能测试脚本
// 用于系统性测试衣橱页面的各项功能

const testCases = [
  {
    name: '基础数据加载测试',
    test: async () => {
      console.log('🔄 测试基础数据加载...');

      // 测试类别加载
      const categories = await import('./src/mock/wardrobe.js').then(mod =>
        mod.wardrobeAPI.getCategories()
      );
      console.log('✅ 类别数据:', categories.data.length, '个类别');

      // 测试衣物列表加载
      const items = await import('./src/mock/wardrobe.js').then(mod =>
        mod.wardrobeAPI.getClothingItems()
      );
      console.log('✅ 衣物数据:', items.data.length, '件衣物');

      return categories.data.length > 0 && items.data.length > 0;
    },
  },

  {
    name: '搜索功能测试',
    test: async () => {
      console.log('🔄 测试搜索功能...');

      const api = await import('./src/mock/wardrobe.js').then(mod => mod.wardrobeAPI);

      // 测试按名称搜索
      const nameResults = await api.searchClothingItems('T恤');
      console.log('✅ 名称搜索结果:', nameResults.data.length, '条结果');

      // 测试按品牌搜索
      const brandResults = await api.searchClothingItems('ZARA');
      console.log('✅ 品牌搜索结果:', brandResults.data.length, '条结果');

      // 测试无结果搜索
      const emptyResults = await api.searchClothingItems('不存在的衣物');
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

      const api = await import('./src/mock/wardrobe.js').then(mod => mod.wardrobeAPI);
      const categories = await api.getCategories();

      // 测试按类别筛选
      const categoryId = categories.data[0]?.id;
      if (categoryId) {
        const categoryItems = await api.getClothingItemsByCategory(categoryId);
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

      const api = await import('./src/mock/wardrobe.js').then(mod => mod.wardrobeAPI);

      // 测试添加衣物
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

      const addResult = await api.addClothingItem(newItem);
      console.log('✅ 添加衣物:', addResult.success, 'ID:', addResult.data.id);

      // 测试获取详情
      const detailResult = await api.getClothingItemDetail(addResult.data.id);
      console.log('✅ 获取详情:', detailResult.success);

      // 测试更新
      const updateResult = await api.updateClothingItem(addResult.data.id, { price: 199 });
      console.log('✅ 更新衣物:', updateResult.success);

      // 测试删除
      const deleteResult = await api.deleteClothingItem(addResult.data.id);
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

      const api = await import('./src/mock/wardrobe.js').then(mod => mod.wardrobeAPI);
      const items = await api.getClothingItems();

      if (items.data.length > 0) {
        const itemId = items.data[0].id;

        // 测试切换收藏状态
        const updateResult = await api.updateClothingItem(itemId, {
          favorite: !items.data[0].favorite,
        });
        console.log('✅ 切换收藏状态:', updateResult.success);

        // 验证状态变更
        const updatedItem = await api.getClothingItemDetail(itemId);
        console.log('✅ 收藏状态:', updatedItem.data.favorite);

        return updateResult.success;
      }

      return true;
    },
  },
];

// 运行测试
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

  // 汇总报告
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

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}

export { runTests, testCases };
