#!/usr/bin/env node

/**
 * 快速数据库设置脚本
 * 使用JavaScript避免TypeScript类型问题
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'styleVault',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'sxk1997sxk'
};

async function checkSetup() {
  console.log('🔍 StyleVault 数据库设置检查\n');

  // 1. 检查环境文件
  console.log('📋 1. 环境配置检查');
  const envPath = path.join(__dirname, '../../.env');
  const envExamplePath = path.join(__dirname, '../../.env.example');
  
  if (fs.existsSync(envPath)) {
    console.log('   ✅ .env 文件已存在');
  } else {
    console.log('   ⚠️  .env 文件不存在');
    if (fs.existsSync(envExamplePath)) {
      console.log('   💡 复制 .env.example 为 .env');
      fs.copyFileSync(envExamplePath, envPath);
      console.log('   ✅ 已创建 .env 文件，请编辑配置');
    }
  }

  // 2. 检查配置
  console.log('\n📋 2. 数据库配置');
  console.log(`   主机: ${config.host}`);
  console.log(`   端口: ${config.port}`);
  console.log(`   数据库: ${config.database}`);
  console.log(`   用户: ${config.user}`);
  console.log(`   密码: ${config.password ? '已设置' : '未设置'}`);

  // 3. 测试MySQL连接
  console.log('\n📋 3. MySQL连接测试');
  let connection;
  try {
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });
    
    await connection.ping();
    console.log('   ✅ MySQL服务运行正常');

    // 检查数据库是否存在
    const [databases] = await connection.execute(
      'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
      [config.database]
    );

    if (databases.length > 0) {
      console.log(`   ✅ 数据库 "${config.database}" 已存在`);
    } else {
      console.log(`   ⚠️  数据库 "${config.database}" 不存在`);
      
      // 询问是否创建数据库
      console.log('\n💡 建议操作:');
      console.log(`   运行: CREATE DATABASE ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      console.log('   或使用以下命令:');
      console.log(`   mysql -u ${config.user} -p -e "CREATE DATABASE ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`);
    }

    await connection.end();
    
  } catch (error) {
    console.log('   ❌ MySQL连接失败');
    console.log(`   错误: ${error.message}`);
    
    console.log('\n🔧 解决方案:');
    console.log('   1. 确保MySQL已安装并运行:');
    console.log('      macOS: brew services start mysql');
    console.log('      Windows: net start mysql');
    console.log('   2. 检查用户名和密码');
    console.log('   3. 检查MySQL端口 (默认3306)');
    console.log('   4. 测试连接: mysql -u root -p');
  }

  // 4. 提供完整设置指南
  console.log('\n📚 完整设置步骤:');
  console.log('1. 安装MySQL (如未安装):');
  console.log('   macOS: brew install mysql');
  console.log('   Windows: 下载MySQL Installer');
  console.log('');
  console.log('2. 启动MySQL服务:');
  console.log('   macOS: brew services start mysql');
  console.log('   Windows: net start mysql');
  console.log('');
  console.log('3. 设置root密码 (如未设置):');
  console.log('   mysql_secure_installation');
  console.log('');
  console.log('4. 创建数据库:');
  console.log(`   mysql -u root -p -e "CREATE DATABASE ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`);
  console.log('');
  console.log('5. 创建用户并授权 (可选):');
  console.log(`   CREATE USER 'stylevault'@'localhost' IDENTIFIED BY 'your_password';`);
  console.log(`   GRANT ALL PRIVILEGES ON ${config.database}.* TO 'stylevault'@'localhost';`);
  console.log('   FLUSH PRIVILEGES;');
  console.log('');
  console.log('6. 更新 .env 文件:');
  console.log('   DB_HOST=localhost');
  console.log('   DB_PORT=3306');
  console.log('   DB_NAME=stylevault');
  console.log('   DB_USER=root');
  console.log('   DB_PASSWORD=your_mysql_password');
  console.log('');
  console.log('7. 重新运行验证:');
  console.log('   npm run db:test');
}

// 如果直接运行
if (require.main === module) {
  checkSetup().catch(console.error);
}

module.exports = { checkSetup };