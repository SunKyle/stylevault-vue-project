import { Sequelize, DataType } from 'sequelize-typescript';
import { sequelize } from '../models/setup';
import { ClothingItem } from '../models/entities/ClothingItem';

async function migrateFavoriteField() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 检查字段是否已存在
    const tableDescription = await sequelize.getQueryInterface().describeTable('clothing_items');
    if (!tableDescription.is_favorite) {
      // 添加新字段
      await sequelize.getQueryInterface().addColumn('clothing_items', 'is_favorite', {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });

      // 创建索引
      await sequelize.getQueryInterface().addIndex('clothing_items', ['is_favorite', 'user_id'], {
        name: 'idx_clothing_is_favorite'
      });

      console.log('新增is_favorite字段和索引');
    }

    // 迁移现有数据
    const items = await ClothingItem.findAll();
    let migratedCount = 0;

    for (const item of items) {
      const metadata = item.metadata as any;
      if (metadata?.favorite === true && !item.isFavorite) {
        await item.update({ isFavorite: true });
        migratedCount++;
      }
    }

    console.log(`数据迁移完成，共迁移 ${migratedCount} 条记录`);
    
  } catch (error) {
    console.error('迁移失败:', error);
  } finally {
    await sequelize.close();
  }
}

migrateFavoriteField();