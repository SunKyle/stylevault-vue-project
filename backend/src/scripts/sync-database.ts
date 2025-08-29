import 'reflect-metadata';
import { syncDatabase } from '../config/database';

const syncDB = async () => {
  const force = process.argv.includes('--force');
  
  console.log(`🔄 Synchronizing database${force ? ' (force rebuild)' : ''}...`);
  
  try {
    await syncDatabase(force);
    console.log('✅ Database synchronization completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    process.exit(1);
  }
};

// 执行同步
if (require.main === module) {
  syncDB();
}