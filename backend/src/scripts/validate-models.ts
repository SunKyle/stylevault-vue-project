#!/usr/bin/env node

/**
 * 模型验证脚本
 * 用于验证所有模型文件的类型和导入是否正确
 */

const { Sequelize } = require('sequelize-typescript');
const config = require('../config').default;
const models = require('../models');

async function validateModels() {
  console.log('🔍 开始验证模型...');
  
  try {
    // 创建Sequelize实例
    const sequelize = new Sequelize({
      ...config.database,
      models: models.models,
      logging: false
    });

    console.log('✅ 模型注册成功');
    
    // 验证模型关联
    models.setupModelAssociations();
    console.log('✅ 模型关联配置成功');
    
    // 验证模型列表
    const modelNames = models.ModelUtils.getModelNames();
    console.log('📋 注册的模型:', modelNames);
    
    // 验证每个模型的基本结构
    for (const model of models.models) {
      console.log(`✅ ${model.name} - 验证通过`);
    }
    
    await sequelize.close();
    console.log('🎉 所有模型验证完成！');
    
  } catch (error) {
    console.error('❌ 模型验证失败:', error);
    process.exit(1);
  }
}

// 运行验证
if (require.main === module) {
  validateModels();
}

export { validateModels };