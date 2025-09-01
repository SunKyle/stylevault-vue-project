#!/usr/bin/env node

/**
 * 简化版数据库测试脚本
 * 避免logger问题，直接输出结果
 */

const { Sequelize } = require('sequelize');
// 直接导入存在的模型文件
const { User } = require('../models/entities/User');
const { ClothingItem } = require('../models/entities/ClothingItem');
const { Outfit } = require('../models/entities/Outfit');
const { UserPreferences } = require('../models/entities/UserPreferences');
const { Attribute } = require('../models/entities/Attribute');
const { EntityAttribute } = require('../models/entities/EntityAttribute');
const { UserBehavior } = require('../models/entities/UserBehavior');
const { WeatherData } = require('../models/entities/WeatherData');
const { Recommendations } = require('../models/entities/Recommendations');

// 模型数组
const models = [User, ClothingItem, Outfit, UserPreferences, Attribute, EntityAttribute, UserBehavior, WeatherData, Recommendations];
require('dotenv').config();

class SimpleDatabaseTester {
  constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME || 'stylevault',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false, // 禁用SQL日志输出
        define: {
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }

  async runTest() {
    console.log('🚀 开始数据库测试...\n');
    
    try {
      // 1. 测试连接
      console.log('📋 1. 测试数据库连接...');
      await this.sequelize.authenticate();
      console.log('   ✅ 数据库连接成功');

      // 2. 测试模型注册
      console.log('\n📋 2. 测试模型注册...');
      this.sequelize.addModels(models);
      
      // 设置基本关联
      User.hasMany(ClothingItem, { foreignKey: 'userId', as: 'clothingItems' });
      ClothingItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      
      User.hasMany(Outfit, { foreignKey: 'userId', as: 'outfits' });
      Outfit.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      
      User.hasOne(UserPreferences, { foreignKey: 'userId', as: 'preferences' });
      UserPreferences.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      
      console.log(`   ✅ 成功注册 ${models.length} 个模型: ${models.map(m => m.name).join(', ')}`);

      // 3. 测试表结构同步
      console.log('\n📋 3. 测试表结构同步...');
      await this.sequelize.sync({ force: false, alter: true });
      console.log('   ✅ 数据库表结构同步成功');

      // 4. 检查表结构
      console.log('\n📋 4. 检查数据库表...');
      const tables = await this.sequelize.getQueryInterface().showAllTables();
      console.log(`   ✅ 发现 ${tables.length} 个表: ${tables.join(', ')}`);

      // 5. 检查索引
      console.log('\n📋 5. 检查索引...');
      let totalIndexes = 0;
      for (const table of tables) {
        const indexes = await this.sequelize.getQueryInterface().showIndex(table);
        totalIndexes += indexes.length;
      }
      console.log(`   ✅ 发现 ${totalIndexes} 个索引`);

      // 6. 检查数据
      console.log('\n📋 6. 检查示例数据...');
      const { User, ClothingItem, Outfit } = this.sequelize.models;
      
      const userCount = await User.count();
      const clothingCount = await ClothingItem.count();
      const outfitCount = await Outfit.count();

      console.log(`   👤 用户数量: ${userCount}`);
      console.log(`   👕 衣物数量: ${clothingCount}`);
      console.log(`   👔 搭配数量: ${outfitCount}`);

      if (userCount === 0) {
        console.log('\n💡 数据库为空，建议运行示例数据创建');
      }

      console.log('\n🎉 数据库测试全部通过！');
      console.log('\n下一步建议:');
      console.log('   npm run db:sync    # 同步最新表结构');
      console.log('   npm run dev        # 启动开发服务器');

    } catch (error) {
      console.error('\n❌ 数据库测试失败:', error.message);
      console.log('\n🔧 故障排除:');
      console.log('   1. 确认MySQL服务已启动');
      console.log('   2. 检查.env文件配置');
      console.log('   3. 确认数据库已创建');
      console.log('   4. 检查用户权限');
      process.exit(1);
    } finally {
      await this.sequelize.close();
    }
  }
}

// 主函数
async function main() {
  const tester = new SimpleDatabaseTester();
  await tester.runTest();
}

// 如果直接运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SimpleDatabaseTester };