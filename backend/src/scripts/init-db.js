#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 自动创建数据库和用户权限
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'stylevault',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
};

async function initDatabase() {
  console.log('🚀 StyleVault 数据库初始化\n');

  try {
    // 连接到MySQL（不指定数据库）
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });

    console.log('✅ 成功连接到MySQL服务器');

    // 创建数据库
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${config.database} 
                           CHARACTER SET utf8mb4 
                           COLLATE utf8mb4_unicode_ci`;
    
    await connection.execute(createDbQuery);
    console.log(`✅ 数据库 "${config.database}" 已创建或已存在`);

    // 创建专用用户（可选）
    const createUserQuery = `CREATE USER IF NOT EXISTS '${config.user}'@'localhost' 
                            IDENTIFIED BY '${config.password}'`;
    
    try {
      await connection.execute(createUserQuery);
      console.log(`✅ 用户 "${config.user}" 已创建或已存在`);
    } catch (userError) {
      console.log(`ℹ️  用户 "${config.user}" 已存在，跳过创建`);
    }

    // 授予权限
    const grantQuery = `GRANT ALL PRIVILEGES ON ${config.database}.* 
                       TO '${config.user}'@'localhost'`;
    
    await connection.execute(grantQuery);
    await connection.execute('FLUSH PRIVILEGES');
    console.log(`✅ 用户 "${config.user}" 已获得数据库 "${config.database}" 的所有权限`);

    // 测试连接
    const [testResult] = await connection.execute('SELECT 1');
    if (testResult && testResult[0]) {
      console.log('✅ 数据库连接测试成功');
    }

    await connection.end();

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n下一步:');
    console.log('   npm run db:test    # 测试数据库连接和模型');
    console.log('   npm run db:sync    # 同步数据库表结构');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    console.log('\n🔧 故障排除:');
    console.log('   1. 确保MySQL已安装并运行');
    console.log('   2. 检查用户名和密码');
    console.log('   3. 检查是否有创建数据库的权限');
    console.log('   4. 手动执行: mysql -u root -p');
    process.exit(1);
  }
}

// 如果直接运行
if (require.main === module) {
  initDatabase().catch(console.error);
}

module.exports = { initDatabase };