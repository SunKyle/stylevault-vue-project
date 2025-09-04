#!/usr/bin/env node

/**
 * 数据库设置检查脚本
 * 检查环境配置、MySQL连接和提供设置指导
 */

import { createConnection } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

interface DatabaseCheckResult {
  envFileExists: boolean;
  configValid: boolean;
  mysqlReachable: boolean;
  databaseExists: boolean;
  userHasPermission: boolean;
  canCreateDatabase: boolean;
  errors: string[];
  recommendations: string[];
}

class DatabaseSetupChecker {
  private config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'stylevault',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };

  async runCheck(): Promise<DatabaseCheckResult> {
    const result: DatabaseCheckResult = {
      envFileExists: false,
      configValid: false,
      mysqlReachable: false,
      databaseExists: false,
      userHasPermission: false,
      canCreateDatabase: false,
      errors: [],
      recommendations: []
    };

    console.log('🔍 开始数据库设置检查...\n');

    // 1. 检查环境文件
    result.envFileExists = this.checkEnvFile();
    
    // 2. 验证配置
    result.configValid = this.validateConfig();
    
    // 3. 测试MySQL连接
    const connectionResult = await this.testMysqlConnection();
    result.mysqlReachable = connectionResult.success;
    if (!connectionResult.success) {
      result.errors.push(connectionResult.error!);
    }
    
    // 4. 检查数据库和权限
    if (connectionResult.success) {
      const dbResult = await this.checkDatabaseAndPermissions();
      result.databaseExists = dbResult.databaseExists;
      result.userHasPermission = dbResult.hasPermission;
      result.canCreateDatabase = dbResult.canCreate;
      
      if (dbResult.errors.length > 0) {
        result.errors.push(...dbResult.errors);
      }
    }
    
    // 5. 生成建议
    result.recommendations = this.generateRecommendations(result);
    
    // 6. 输出报告
    this.printReport(result);
    
    return result;
  }

  private checkEnvFile(): boolean {
    const envPath = path.join(__dirname, '../../.env');
    const examplePath = path.join(__dirname, '../../.env.example');
    
    if (fs.existsSync(envPath)) {
      console.log('✅ .env 文件存在');
      return true;
    } else {
      console.log('⚠️  .env 文件不存在，将使用 .env.example 作为模板');
      
      if (fs.existsSync(examplePath)) {
        console.log('✅ .env.example 模板文件存在');
      } else {
        console.log('❌ .env.example 模板文件也不存在');
      }
      return false;
    }
  }

  private validateConfig(): boolean {
    const required = ['host', 'port', 'database', 'user'];
    const missing = required.filter(key => !this.config[key as keyof typeof this.config]);
    
    if (missing.length === 0) {
      console.log('✅ 数据库配置完整');
      return true;
    } else {
      console.log(`❌ 缺少配置: ${missing.join(', ')}`);
      return false;
    }
  }

  private async testMysqlConnection(): Promise<{success: boolean; error?: string}> {
    try {
      const connection = await createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password
      });
      
      await connection.ping();
      await connection.end();
      
      console.log('✅ MySQL服务可达');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : '连接失败';
      return { success: false, error: `MySQL连接失败: ${message}` };
    }
  }

  private async checkDatabaseAndPermissions(): Promise<{
    databaseExists: boolean;
    hasPermission: boolean;
    canCreate: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    let databaseExists = false;
    let hasPermission = false;
    let canCreate = false;

    try {
      const connection = await createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password
      });

      // 检查数据库是否存在
      const [databases] = await connection.query(
        'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
        [this.config.database]
      );
      
      databaseExists = (databases as any[]).length > 0;
      console.log(`✅ 数据库 ${this.config.database} ${databaseExists ? '存在' : '不存在'}`);

      // 检查用户权限
      const [grants] = await connection.query(
        'SHOW GRANTS FOR CURRENT_USER()'
      );
      
      const grantStatements = (grants as any[]).map(row => Object.values(row)[0] as string);
      const hasAllPrivileges = grantStatements.some(grant => 
        grant.includes('ALL PRIVILEGES') || 
        (grant.includes(this.config.database) && grant.includes('ALL'))
      );
      
      hasPermission = hasAllPrivileges || databaseExists;
      canCreate = grantStatements.some(grant => 
        grant.includes('CREATE') || grant.includes('ALL PRIVILEGES')
      );

      console.log(`✅ 用户权限检查完成`);
      
      await connection.end();
    } catch (error) {
      errors.push(`权限检查失败: ${error instanceof Error ? error.message : String(error)}`);
    }

    return { databaseExists, hasPermission, canCreate, errors };
  }

  private generateRecommendations(result: DatabaseCheckResult): string[] {
    const recommendations: string[] = [];

    if (!result.envFileExists) {
      recommendations.push('复制 .env.example 为 .env 并配置数据库连接信息');
    }

    if (!result.configValid) {
      recommendations.push('检查 .env 文件中的数据库配置是否完整');
    }

    if (!result.mysqlReachable) {
      recommendations.push('确保MySQL服务正在运行');
      recommendations.push('检查数据库主机、端口、用户名和密码是否正确');
      recommendations.push('在macOS上: brew services start mysql');
    }

    if (!result.databaseExists && result.canCreateDatabase) {
      recommendations.push(`运行: CREATE DATABASE ${this.config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    }

    if (!result.userHasPermission) {
      recommendations.push('为用户授予数据库权限: GRANT ALL PRIVILEGES ON stylevault.* TO \'your_user\'@\'localhost\';');
    }

    return recommendations;
  }

  private printReport(result: DatabaseCheckResult): void {
    console.log('\n📊 数据库设置检查报告');
    console.log('========================');
    console.log(`环境文件: ${result.envFileExists ? '✅' : '❌'}`);
    console.log(`配置有效: ${result.configValid ? '✅' : '❌'}`);
    console.log(`MySQL可达: ${result.mysqlReachable ? '✅' : '❌'}`);
    console.log(`数据库存在: ${result.databaseExists ? '✅' : '❌'}`);
    console.log(`用户权限: ${result.userHasPermission ? '✅' : '❌'}`);
    console.log(`可创建数据库: ${result.canCreateDatabase ? '✅' : '❌'}`);

    if (result.errors.length > 0) {
      console.log('\n❌ 发现的问题:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (result.recommendations.length > 0) {
      console.log('\n🔧 建议操作:');
      result.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }

    const allGood = result.mysqlReachable && result.databaseExists && result.userHasPermission;
    console.log(`\n🎯 状态: ${allGood ? '准备就绪，可以运行完整验证' : '需要配置数据库'}`);
  }

  async createDatabase(): Promise<void> {
    try {
      const connection = await createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password
      });

      await connection.query(`
        CREATE DATABASE IF NOT EXISTS ${this.config.database}
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci
      `);
      
      console.log(`✅ 数据库 ${this.config.database} 创建成功`);
      await connection.end();
    } catch (error) {
      console.error(`❌ 创建数据库失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 主函数
async function main() {
  const checker = new DatabaseSetupChecker();
  const result = await checker.runCheck();
  
  // 如果数据库不存在且可以创建，询问用户是否创建
  if (!result.databaseExists && result.canCreateDatabase) {
    console.log('\n💡 检测到可以自动创建数据库');
    console.log('运行: npm run db:create 来自动创建数据库');
  }
}

// 直接运行
if (require.main === module) {
  main().catch(console.error);
}

export { DatabaseSetupChecker };