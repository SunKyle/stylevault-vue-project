#!/usr/bin/env node

/**
 * 数据库测试脚本
 * 用于验证数据库连接、模型同步和基础数据初始化
 */

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { setupModels } from '../models/setup';
import logger from '../utils/logger';

// 加载环境变量
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

interface DatabaseTestResult {
  connection: boolean;
  models: string[];
  tables: string[];
  indexes: string[];
  sampleData: boolean;
  errors: string[];
}

class DatabaseValidator {
  private sequelize: Sequelize;
  private results: DatabaseTestResult = {
    connection: false,
    models: [],
    tables: [],
    indexes: [],
    sampleData: false,
    errors: []
  };

  constructor() {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'styleVault',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      dialect: 'mysql' as const,
      logging: process.env.NODE_ENV === 'development' ? logger.info : false,
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        paranoid: true
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };

    this.sequelize = new Sequelize(config);
  }

  async runValidation(): Promise<DatabaseTestResult> {
    console.log('🚀 开始数据库验证...\n');

    try {
      // 1. 测试数据库连接
      await this.testConnection();
      
      // 2. 设置和验证模型
      await this.setupAndValidateModels();
      
      // 3. 同步数据库表
      await this.syncDatabase();
      
      // 4. 验证表结构
      await this.validateTableStructure();
      
      // 5. 创建示例数据
      await this.createSampleData();
      
      // 6. 生成验证报告
      await this.generateReport();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.errors.push(errorMessage);
      logger.error('数据库验证失败:', errorMessage);
    } finally {
      await this.sequelize.close();
    }

    return this.results;
  }

  private async testConnection(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      this.results.connection = true;
      console.log('✅ 数据库连接成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`数据库连接失败: ${errorMessage}`);
    }
  }

  private async setupAndValidateModels(): Promise<void> {
    try {
      const models = setupModels(this.sequelize);
      this.results.models = models.map(m => m.name);
      console.log(`✅ 模型注册成功: ${this.results.models.join(', ')}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`模型验证失败: ${errorMessage}`);
    }
  }

  private async syncDatabase(): Promise<void> {
    try {
      await this.sequelize.sync({ force: false, alter: true });
      console.log('✅ 数据库同步成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`数据库同步失败: ${errorMessage}`);
    }
  }

  private async validateTableStructure(): Promise<void> {
    try {
      const tables = await this.sequelize.getQueryInterface().showAllTables();
      this.results.tables = tables;
      
      console.log(`📋 数据库表列表: ${tables.join(', ')}`);
      
      // 验证核心表是否存在
      const requiredTables = [
        'users',
        'clothing_items',
        'outfits',
        'outfit_items',
        'categories',
        'tags',
        'clothing_tags',
        'favorites',
        'user_preferences',
        'uploads'
      ];

      const missingTables = requiredTables.filter(table => !tables.includes(table));
      if (missingTables.length > 0) {
        this.results.errors.push(`缺少表: ${missingTables.join(', ')}`);
      }

      // 验证索引
      for (const table of tables) {
        const indexes = await this.sequelize.getQueryInterface().showIndex(table);
        this.results.indexes.push(...(indexes as any[]).map((idx: any) => `${table}.${idx.name}`));
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`表结构验证失败: ${errorMessage}`);
    }
  }

  private async createSampleData(): Promise<void> {
    try {
      const { User, Category, ClothingItem } = this.sequelize.models;

      // 检查是否已有数据
      const userCount = await User.count();
      if (userCount === 0) {
        // 创建测试用户
        const testUser = await User.create({
          username: 'testuser',
          email: 'test@example.com',
          password: '$2b$12$KIXvM7K8DpQ7w8dQ9X8X8O7w8dQ9X8X8O7w8dQ9X8X8O7w8dQ9X8X8O', // bcrypt hash for 'password'
          isEmailVerified: true
        });

        // 创建基础分类
        const categories = await Category.bulkCreate([
          { name: '上衣', slug: 'tops', description: 'T恤、衬衫、毛衣等' },
          { name: '裤子', slug: 'bottoms', description: '牛仔裤、休闲裤、短裤等' },
          { name: '鞋子', slug: 'shoes', description: '运动鞋、皮鞋、靴子等' },
          { name: '配饰', slug: 'accessories', description: '帽子、围巾、包包等' }
        ]);

        // 创建示例衣物
        await ClothingItem.bulkCreate([
          {
            userId: (testUser as any).id,
            name: '白色T恤',
            categoryId: (categories[0] as any).id,
            color: 'white',
            brand: 'Uniqlo',
            size: 'M',
            season: 'summer',
            occasion: 'casual',
            imageUrl: '/uploads/sample-white-tshirt.jpg'
          },
          {
            userId: (testUser as any).id,
            name: '蓝色牛仔裤',
            categoryId: (categories[1] as any).id,
            color: 'blue',
            brand: 'Levi\'s',
            size: '32',
            season: 'all',
            occasion: 'casual',
            imageUrl: '/uploads/sample-blue-jeans.jpg'
          }
        ]);

        this.results.sampleData = true;
        console.log('✅ 示例数据创建成功');
      } else {
        console.log('ℹ️  数据库中已有数据，跳过示例数据创建');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.errors.push(`示例数据创建失败: ${errorMessage}`);
    }
  }

  private async generateReport(): Promise<void> {
    console.log('\n📊 数据库验证报告');
    console.log('==================');
    console.log(`连接状态: ${this.results.connection ? '✅ 正常' : '❌ 失败'}`);
    console.log(`注册模型: ${this.results.models.length}个`);
    console.log(`数据库表: ${this.results.tables.length}个`);
    console.log(`索引数量: ${this.results.indexes.length}个`);
    console.log(`示例数据: ${this.results.sampleData ? '✅ 已创建' : 'ℹ️  已存在'}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ 发现的问题:');
      this.results.errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('\n🎉 所有验证通过！');
    }

    // 保存详细报告到文件
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        totalModels: this.results.models.length,
        totalTables: this.results.tables.length,
        totalIndexes: this.results.indexes.length,
        status: this.results.errors.length === 0 ? 'SUCCESS' : 'FAILED'
      }
    };

    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '../../logs', `db-validation-${Date.now()}.json`);
    
    if (!fs.existsSync(path.dirname(reportPath))) {
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 详细报告已保存: ${reportPath}`);
  }
}

// 主函数
async function main() {
  const validator = new DatabaseValidator();
  const results = await validator.runValidation();
  
  process.exit(results.errors.length === 0 ? 0 : 1);
}

// 直接运行
if (require.main === module) {
  main().catch(console.error);
}

export { DatabaseValidator, DatabaseTestResult };