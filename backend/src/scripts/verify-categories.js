require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

async function verifyCategories() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    const [results] = await sequelize.query('SELECT id, name, slug, icon, sortOrder, enabled, itemCount FROM Categories ORDER BY sortOrder');
    
    console.log('\n📊 Categories表数据验证:');
    console.log(`📈 总计: ${results.length} 个分类`);
    
    results.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug}) - 排序: ${cat.sortOrder}, 启用: ${cat.enabled ? '是' : '否'}, 数量: ${cat.itemCount}`);
    });

    console.log('\n✅ Category表创建和数据插入成功完成！');

  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  verifyCategories();
}