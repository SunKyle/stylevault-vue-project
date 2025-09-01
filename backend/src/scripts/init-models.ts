import { Sequelize } from 'sequelize-typescript';
import config from '../config';
import { models, setupModelAssociations } from '../models';

/**
 * 数据库模型初始化脚本
 * 用于初始化数据库表结构和基础数据
 */

class DatabaseInitializer {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      ...config.database,
      models,
      logging: (config as any).app?.env === 'development' ? console.log : false
    });
  }

  /**
   * 初始化数据库连接
   */
  async initializeConnection() {
    try {
      await this.sequelize.authenticate();
      console.log('✅ 数据库连接成功');
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      throw error;
    }
  }

  /**
   * 设置模型关联
   */
  setupAssociations() {
    setupModelAssociations();
    console.log('✅ 模型关联设置完成');
  }

  /**
   * 同步数据库表结构
   */
  async syncDatabase() {
    try {
      await this.sequelize.sync({ force: false });
      console.log('✅ 数据库表结构同步完成');
    } catch (error) {
      console.error('❌ 数据库同步失败:', error);
      throw error;
    }
  }

  /**
   * 初始化基础数据
   */
  async initializeBaseData() {
    try {
      const { Attribute } = await import('../models');
      
      // 检查是否已有系统属性
      const existingAttributes = await Attribute.findSystemAttributes();
      if (existingAttributes.length === 0) {
        console.log('📝 初始化系统属性数据...');
        await this.initializeSystemAttributes();
      }

      console.log('✅ 基础数据初始化完成');
    } catch (error) {
      console.error('❌ 基础数据初始化失败:', error);
      throw error;
    }
  }

  /**
   * 初始化系统属性数据
   */
  private async initializeSystemAttributes() {
    const { Attribute } = await import('../models');
    
    const systemAttributes = [
      // 颜色属性
      {
        name: 'red',
        displayName: '红色',
        category: 'color',
        type: 'string',
        color: '#FF0000',
        isSystem: true,
        sortOrder: 1
      },
      {
        name: 'blue',
        displayName: '蓝色',
        category: 'color',
        type: 'string',
        color: '#0000FF',
        isSystem: true,
        sortOrder: 2
      },
      {
        name: 'black',
        displayName: '黑色',
        category: 'color',
        type: 'string',
        color: '#000000',
        isSystem: true,
        sortOrder: 3
      },
      {
        name: 'white',
        displayName: '白色',
        category: 'color',
        type: 'string',
        color: '#FFFFFF',
        isSystem: true,
        sortOrder: 4
      },
      {
        name: 'gray',
        displayName: '灰色',
        category: 'color',
        type: 'string',
        color: '#808080',
        isSystem: true,
        sortOrder: 5
      },
      {
        name: 'green',
        displayName: '绿色',
        category: 'color',
        type: 'string',
        color: '#008000',
        isSystem: true,
        sortOrder: 6
      },
      {
        name: 'yellow',
        displayName: '黄色',
        category: 'color',
        type: 'string',
        color: '#FFFF00',
        isSystem: true,
        sortOrder: 7
      },
      {
        name: 'brown',
        displayName: '棕色',
        category: 'color',
        type: 'string',
        color: '#A52A2A',
        isSystem: true,
        sortOrder: 8
      },
      {
        name: 'purple',
        displayName: '紫色',
        category: 'color',
        type: 'string',
        color: '#800080',
        isSystem: true,
        sortOrder: 9
      },
      {
        name: 'pink',
        displayName: '粉色',
        category: 'color',
        type: 'string',
        color: '#FFC0CB',
        isSystem: true,
        sortOrder: 10
      },

      // 材质属性
      {
        name: 'cotton',
        displayName: '棉质',
        category: 'material',
        type: 'string',
        isSystem: true,
        sortOrder: 1
      },
      {
        name: 'wool',
        displayName: '羊毛',
        category: 'material',
        type: 'string',
        isSystem: true,
        sortOrder: 2
      },
      {
        name: 'leather',
        displayName: '皮革',
        category: 'material',
        type: 'string',
        isSystem: true,
        sortOrder: 3
      },
      {
        name: 'denim',
        displayName: '牛仔',
        category: 'material',
        type: 'string',
        isSystem: true,
        sortOrder: 4
      },
      {
        name: 'silk',
        displayName: '丝绸',
        category: 'material',
        type: 'string',
        isSystem: true,
        sortOrder: 5
      },
      {
        name: 'linen',
        displayName: '亚麻',
        category: 'material',
        type: 'string',
        isSystem: true,
        sortOrder: 6
      },

      // 风格属性
      {
        name: 'casual',
        displayName: '休闲',
        category: 'style',
        type: 'string',
        isSystem: true,
        sortOrder: 1
      },
      {
        name: 'formal',
        displayName: '正式',
        category: 'style',
        type: 'string',
        isSystem: true,
        sortOrder: 2
      },
      {
        name: 'business',
        displayName: '商务',
        category: 'style',
        type: 'string',
        isSystem: true,
        sortOrder: 3
      },
      {
        name: 'sport',
        displayName: '运动',
        category: 'style',
        type: 'string',
        isSystem: true,
        sortOrder: 4
      },
      {
        name: 'street',
        displayName: '街头',
        category: 'style',
        type: 'string',
        isSystem: true,
        sortOrder: 5
      },
      {
        name: 'vintage',
        displayName: '复古',
        category: 'style',
        type: 'string',
        isSystem: true,
        sortOrder: 6
      },
      {
        name: 'minimalist',
        displayName: '极简',
        category: 'style',
        type: 'string',
        isSystem: true,
        sortOrder: 7
      },

      // 场合属性
      {
        name: 'daily',
        displayName: '日常',
        category: 'occasion',
        type: 'string',
        isSystem: true,
        sortOrder: 1
      },
      {
        name: 'work',
        displayName: '工作',
        category: 'occasion',
        type: 'string',
        isSystem: true,
        sortOrder: 2
      },
      {
        name: 'party',
        displayName: '聚会',
        category: 'occasion',
        type: 'string',
        isSystem: true,
        sortOrder: 3
      },
      {
        name: 'date',
        displayName: '约会',
        category: 'occasion',
        type: 'string',
        isSystem: true,
        sortOrder: 4
      },
      {
        name: 'travel',
        displayName: '旅行',
        category: 'occasion',
        type: 'string',
        isSystem: true,
        sortOrder: 5
      },
      {
        name: 'sport',
        displayName: '运动',
        category: 'occasion',
        type: 'string',
        isSystem: true,
        sortOrder: 6
      }
    ];

    await Attribute.bulkCreate(systemAttributes as any);
    console.log(`✅ 已创建 ${systemAttributes.length} 个系统属性`);
  }

  /**
   * 完整的初始化流程
   */
  async runFullInitialization() {
    console.log('🚀 开始数据库初始化...');
    
    try {
      await this.initializeConnection();
      this.setupAssociations();
      await this.syncDatabase();
      await this.initializeBaseData();
      
      console.log('✅ 数据库初始化完成！');
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error);
      process.exit(1);
    } finally {
      await this.sequelize.close();
    }
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  const initializer = new DatabaseInitializer();
  initializer.runFullInitialization();
}

export default DatabaseInitializer;