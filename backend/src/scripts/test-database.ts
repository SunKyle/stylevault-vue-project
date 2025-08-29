import 'reflect-metadata';
import { testConnection, syncDatabase } from '../config/database';

const testDatabase = async () => {
  console.log('🔄 Testing database connection...');
  
  try {
    // 测试连接
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // 同步数据库结构（不强制重建）
    console.log('🔄 Synchronizing database structure...');
    await syncDatabase(false);
    
    console.log('✅ Database test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
};

// 执行测试
if (require.main === module) {
  testDatabase();
}