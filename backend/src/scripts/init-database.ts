import { sequelize } from '../models/setup';
import { Category } from '../models/entities/Category';
import { ClothingItem } from '../models/entities/ClothingItem';
import { seedCategories } from './seed-categories';

/**
 * 初始化数据库
 * 1. 同步所有模型
 * 2. 初始化基础数据
 */
export const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...');
    
    // 同步所有模型
    await sequelize.sync({ alter: true });
    console.log('数据库模型同步完成');

    // 初始化基础数据
    await seedCategories();
    
    // 更新分类统计
    await updateCategoryCounts();
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
};

/**
 * 更新分类统计
 */
export const updateCategoryCounts = async () => {
  try {
    const categories = await Category.findAll();
    
    for (const category of categories) {
      const count = await ClothingItem.count({
        where: { categoryId: category.id, status: 'active' }
      });
      
      await category.update({ itemCount: count });
    }
    
    console.log('分类统计更新完成');
  } catch (error) {
    console.error('更新分类统计失败:', error);
  }
};

// 如果是直接运行此脚本
if (require.main === module) {
  (async () => {
    try {
      await initDatabase();
      console.log('数据库初始化脚本执行完成');
      process.exit(0);
    } catch (error) {
      console.error('数据库初始化脚本执行失败:', error);
      process.exit(1);
    }
  })();
}