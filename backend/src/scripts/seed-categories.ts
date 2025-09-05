import { Category } from '../models/entities/Category';

/**
 * 初始化衣物分类数据
 */
export const seedCategories = async () => {
  const categories = [
    {
      name: '上衣',
      slug: 'tops',
      description: '包括T恤、衬衫、毛衣等各种上衣',
      icon: 'fas fa-tshirt',
      sortOrder: 1,
      enabled: true
    },
    {
      name: '下装',
      slug: 'bottoms',
      description: '包括裤子、裙子、短裤等下装',
      icon: 'fas fa-user',
      sortOrder: 2,
      enabled: true
    },
    {
      name: '外套',
      slug: 'outerwear',
      description: '包括夹克、大衣、风衣等外套',
      icon: 'fas fa-jacket',
      sortOrder: 3,
      enabled: true
    },
    {
      name: '鞋子',
      slug: 'shoes',
      description: '包括运动鞋、皮鞋、靴子等鞋类',
      icon: 'fas fa-shoe-prints',
      sortOrder: 4,
      enabled: true
    },
    {
      name: '配饰',
      slug: 'accessories',
      description: '包括帽子、围巾、手套、包包等配饰',
      icon: 'fas fa-hat-cowboy',
      sortOrder: 5,
      enabled: true
    },
    {
      name: '连衣裙',
      slug: 'dresses',
      description: '各种款式的连衣裙',
      icon: 'fas fa-female',
      sortOrder: 6,
      enabled: true
    },
    {
      name: '运动装',
      slug: 'activewear',
      description: '包括运动T恤、运动裤、运动套装等',
      icon: 'fas fa-running',
      sortOrder: 7,
      enabled: true
    },
    {
      name: '内衣',
      slug: 'underwear',
      description: '包括内衣、内裤、袜子等贴身衣物',
      icon: 'fas fa-socks',
      sortOrder: 8,
      enabled: true
    }
  ];

  try {
    console.log('开始初始化衣物分类...');
    
    // 检查是否已存在分类
    const existingCount = await Category.count();
    if (existingCount > 0) {
      console.log('分类数据已存在，跳过初始化');
      return;
    }

    let created = 0;
    let updated = 0;

    // 批量创建或更新分类
    for (const category of categories) {
      const existing = await Category.findOne({ where: { slug: category.slug } });
      if (!existing) {
        await Category.create({
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          sortOrder: category.sortOrder,
          enabled: category.enabled
        } as any);
        created++;
      } else {
        await existing.update({
          name: category.name,
          description: category.description,
          icon: category.icon,
          sortOrder: category.sortOrder,
          enabled: category.enabled
        });
        updated++;
      }
    }

    console.log('衣物分类初始化完成');
    console.log(`共创建了 ${created} 个分类，更新了 ${updated} 个分类`);
  } catch (error) {
    console.error('初始化衣物分类失败:', error);
    throw error;
  }
};

// 如果是直接运行此脚本
if (require.main === module) {
  (async () => {
    try {
      await seedCategories();
      process.exit(0);
    } catch (error) {
      console.error('执行失败:', error);
      process.exit(1);
    }
  })();
}