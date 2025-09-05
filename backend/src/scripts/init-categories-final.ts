import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';

// 加载环境变量
dotenv.config();

// 数据库配置
const sequelize = new Sequelize(
  process.env.DB_NAME || 'stylevault',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      paranoid: true
    }
  }
);

// 定义Category模型
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  itemCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'Categories',
  paranoid: true,
  timestamps: true,
  underscored: false
});

/**
 * 初始化Category表和测试数据
 */
async function initCategories() {
  try {
    console.log('🚀 开始初始化Category表...');
    
    // 确保数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 同步Category模型
    await Category.sync({ alter: true });
    console.log('✅ Category表同步完成');

    // 定义基础分类数据
    const categories = [
      { name: '上衣', slug: 'tops', description: '包括T恤、衬衫、毛衣、外套等各种上衣', icon: '👕', sortOrder: 1, enabled: true, itemCount: 0 },
      { name: '裤子', slug: 'pants', description: '包括牛仔裤、休闲裤、运动裤、短裤等', icon: '👖', sortOrder: 2, enabled: true, itemCount: 0 },
      { name: '裙子', slug: 'skirts', description: '包括连衣裙、半身裙、长裙、短裙等', icon: '👗', sortOrder: 3, enabled: true, itemCount: 0 },
      { name: '鞋子', slug: 'shoes', description: '包括运动鞋、皮鞋、靴子、凉鞋等', icon: '👟', sortOrder: 4, enabled: true, itemCount: 0 },
      { name: '配饰', slug: 'accessories', description: '包括帽子、围巾、手套、包包等配饰', icon: '🎩', sortOrder: 5, enabled: true, itemCount: 0 },
      { name: '外套', slug: 'outerwear', description: '包括夹克、大衣、羽绒服、风衣等外套', icon: '🧥', sortOrder: 6, enabled: true, itemCount: 0 },
      { name: '内衣', slug: 'underwear', description: '包括内衣、内裤、袜子等贴身衣物', icon: '🧦', sortOrder: 7, enabled: true, itemCount: 0 },
      { name: '运动服', slug: 'sportswear', description: '包括运动上衣、运动裤、运动套装等', icon: '🏃', sortOrder: 8, enabled: true, itemCount: 0 }
    ];

    let createdCount = 0;
    let updatedCount = 0;

    // 批量创建或更新分类
    for (const categoryData of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { slug: categoryData.slug },
        defaults: categoryData as any
      });

      const cat = category as any;

      if (created) {
        createdCount++;
        console.log(`✅ 创建分类: ${cat.name}`);
      } else {
        await category.update(categoryData);
        updatedCount++;
        console.log(`🔄 更新分类: ${cat.name}`);
      }
    }

    // 验证数据
    const allCategories = await Category.findAll({
      order: [['sortOrder', 'ASC']]
    });

    console.log('\n📊 分类数据初始化完成');
    console.log(`📈 总计: ${allCategories.length} 个分类`);
    console.log(`🆕 新创建: ${createdCount} 个`);
    console.log(`🔄 已更新: ${updatedCount} 个`);
    
    console.log('\n📋 当前分类列表:');
    allCategories.forEach(cat => {
      const category = cat as any;
      console.log(`   ${category.icon} ${category.name} (${category.slug}) - 排序: ${category.sortOrder}, 启用: ${category.enabled ? '是' : '否'}, 数量: ${category.itemCount}`);
    });

  } catch (error) {
    console.error('❌ 初始化Category表失败:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 执行初始化
if (require.main === module) {
  initCategories();
}