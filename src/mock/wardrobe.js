// 从data.js中导入数据
import { categories, scenesMockData, seasonsMockData, stylesMockData, clothingItems } from './data';

// 模拟API延迟
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API服务
export const wardrobeAPI = {
  // 获取所有衣物类别
  getCategories: async () => {
    await delay(300); // 模拟网络延迟
    return { success: true, data: categories };
  },

  // 获取所有衣物
  getClothingItems: async () => {
    await delay(500); // 模拟网络延迟
    // 返回数组的副本，确保包含最新添加的衣物
    return { success: true, data: [...clothingItems] };
  },

  // 根据类别获取衣物
  getClothingItemsByCategory: async categoryId => {
    await delay(400); // 模拟网络延迟
    // 使用数组的副本进行过滤，确保包含最新添加的衣物
    const items = [...clothingItems].filter(item => item.categoryId === categoryId);
    return { success: true, data: items };
  },

  // 获取衣物详情
  getClothingItemDetail: async id => {
    await delay(300); // 模拟网络延迟
    // 使用数组的副本进行查找，确保包含最新添加的衣物
    const item = [...clothingItems].find(item => item.id === id);
    if (item) {
      return { success: true, data: item };
    } else {
      return { success: false, message: '未找到该衣物' };
    }
  },

  // 添加衣物
  addClothingItem: async item => {
    await delay(600); // 模拟网络延迟
    const newItem = {
      ...item,
      id: clothingItems.length + 1,
      wearCount: 0,
      lastWorn: null,
    };
    clothingItems.push(newItem);
    // 返回新添加的衣物，确保包含所有必要字段
    return { success: true, data: { ...newItem } };
  },

  // 更新衣物信息
  updateClothingItem: async (id, updates) => {
    await delay(500); // 模拟网络延迟
    // 使用数组的副本进行查找和更新，确保包含最新添加的衣物
    const items = [...clothingItems];
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      clothingItems[index] = { ...clothingItems[index], ...updates };
      return { success: true, data: { ...clothingItems[index] } };
    } else {
      return { success: false, message: '未找到该衣物' };
    }
  },

  // 删除衣物
  deleteClothingItem: async id => {
    await delay(400); // 模拟网络延迟
    const index = clothingItems.findIndex(item => item.id === id);
    if (index !== -1) {
      clothingItems.splice(index, 1);
      return { success: true };
    } else {
      return { success: false, message: '未找到该衣物' };
    }
  },

  // 搜索衣物
  searchClothingItems: async keyword => {
    await delay(400); // 模拟网络延迟
    const results = clothingItems.filter(
      item =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.brand.toLowerCase().includes(keyword.toLowerCase()) ||
        item.style.toLowerCase().includes(keyword.toLowerCase())
    );
    return { success: true, data: results };
  },
};
