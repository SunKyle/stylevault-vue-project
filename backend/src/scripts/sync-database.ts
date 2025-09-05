import { Sequelize } from 'sequelize';
import config from '../config';
import { models, setupModelAssociations } from '../models';

/**
 * 同步数据库模型
 */
async function syncDatabase() {
  const sequelize = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
      host: config.database.host,
      port: config.database.port,
      dialect: 'mysql',
      logging: config.database.logging
    }
  );

  try {
    console.log('开始同步数据库模型...');
    
    // 测试连接
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 添加模型
    models.forEach(model => {
      (model as any).init((model as any).getAttributes(), {
        sequelize,
        modelName: (model as any).name,
        tableName: (model as any).tableName
      });
    });

    // 设置关联
    setupModelAssociations();

    // 同步所有模型
    await sequelize.sync({ alter: true });
    console.log('所有模型同步完成');

    // 显示同步的表
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('已创建的表:', tables);

  } catch (error) {
    console.error('数据库同步失败:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 执行同步
syncDatabase();