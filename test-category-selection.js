// 测试分类选择功能
const { useClothingStore } = require('./src/stores/clothingStore.js');

// 模拟测试环境
const mockCategories = [
  { id: 'tops', name: '上衣', icon: '👔', count: 15 },
  { id: 'bottoms', name: '裤子', icon: '👖', count: 12 },
  { id: 'shoes', name: '鞋子', icon: '👟', count: 8 },
  { id: 'accessories', name: '配饰', icon: '👜', count: 5 },
];

// 创建测试函数
async function testCategorySelection() {
  console.log('🧪 开始测试分类选择功能...\n');

  try {
    // 模拟 Pinia store
    const store = {
      selectedCategory: null,
      categories: mockCategories,

      setSelectedCategory(categoryId) {
        this.selectedCategory = categoryId;
        console.log(`✅ 设置选中分类: ${categoryId}`);
      },

      clearSelectedCategory() {
        this.selectedCategory = null;
        console.log('✅ 清除选中分类');
      },
    };

    // 测试1: 设置分类
    console.log('测试1: 设置分类选择');
    store.setSelectedCategory('tops');
    console.log(`当前选中: ${store.selectedCategory}`);

    if (store.selectedCategory === 'tops') {
      console.log('✅ 设置分类测试通过\n');
    } else {
      console.log('❌ 设置分类测试失败\n');
    }

    // 测试2: 清除分类
    console.log('测试2: 清除分类选择');
    store.clearSelectedCategory();
    console.log(`当前选中: ${store.selectedCategory}`);

    if (store.selectedCategory === null) {
      console.log('✅ 清除分类测试通过\n');
    } else {
      console.log('❌ 清除分类测试失败\n');
    }

    // 测试3: 切换分类
    console.log('测试3: 切换分类选择');
    store.setSelectedCategory('bottoms');
    console.log(`第一次设置: ${store.selectedCategory}`);

    store.setSelectedCategory('shoes');
    console.log(`第二次设置: ${store.selectedCategory}`);

    if (store.selectedCategory === 'shoes') {
      console.log('✅ 切换分类测试通过\n');
    } else {
      console.log('❌ 切换分类测试失败\n');
    }

    console.log('🎉 所有分类选择测试完成！');
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  testCategorySelection();
}

module.exports = { testCategorySelection };
