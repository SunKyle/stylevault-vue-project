import { Sequelize } from 'sequelize';
import { databaseConfig as config } from './index';
import { initializeModels } from '../models/initializeModels';

// 创建 Sequelize 实例
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    logging: config.logging ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  }
);

// 初始化数据库连接
export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 初始化模型
    initializeModels();
    
    console.log('所有模型初始化完成');
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
};

// 同步数据库（仅开发环境使用）
export const syncDatabase = async (options: { force?: boolean } = {}): Promise<void> => {
  try {
    await sequelize.sync({ alter: true, ...options });
    console.log('数据库同步完成');
  } catch (error) {
    console.error('数据库同步失败:', error);
    throw error;
  }
};

// 测试数据库连接
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接测试成功');
    return true;
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    return false;
  }
};