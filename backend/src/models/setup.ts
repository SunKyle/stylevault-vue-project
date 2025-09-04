import { Sequelize } from 'sequelize-typescript';
import { models, setupModelAssociations } from './index';
import { databaseConfig } from '../config';

/**
 * Sequelize实例
 */
export const sequelize = new Sequelize({
  ...databaseConfig,
  models,
});

/**
 * 设置Sequelize模型
 * @param sequelize Sequelize实例
 * @returns 注册的模型数组
 */
export function setupModels(sequelize: Sequelize) {
  // 注册所有模型
  sequelize.addModels(models);
  
  // 设置模型关联
  setupModelAssociations();
  
  return models;
}

/**
 * 获取Sequelize配置
 * @param env 环境变量
 * @returns Sequelize配置
 */
export function getSequelizeConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '3306'),
    database: env.DB_NAME || 'stylevault',
    username: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'password',
    dialect: 'mysql' as const,
    logging: env.NODE_ENV === 'development' ? console.log : false,
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
}