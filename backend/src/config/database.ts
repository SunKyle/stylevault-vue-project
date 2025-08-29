import { Sequelize } from 'sequelize-typescript';
import { initAssociations } from '../models';
import * as models from '../models';

// 数据库配置
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'stylevault',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  dialect: 'mysql' as const,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true,
    paranoid: true,
    underscored: false
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00'
};

// 创建Sequelize实例
export const sequelize = new Sequelize({
  ...config,
  models: Object.values(models.models)
});

// 初始化关联关系
initAssociations();

// 测试数据库连接
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

// 同步数据库
export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log(`✅ Database synchronized successfully (force: ${force})`);
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

// 关闭数据库连接
export const closeConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed successfully');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};