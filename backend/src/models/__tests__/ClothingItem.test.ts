import { Sequelize } from 'sequelize-typescript';
import { ClothingItem, User } from '../entities';
import config from '../../config';

describe('ClothingItem Model', () => {
  let sequelize: Sequelize;
  let testUser: User;

  beforeAll(async () => {
    sequelize = new Sequelize({
      ...config.database,
      models: [User, ClothingItem],
      logging: false
    });
    await sequelize.sync({ force: true });

    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('创建衣物项目', () => {
    it('应该成功创建基本衣物项目', async () => {
      const clothingItem = await ClothingItem.create({
        userId: testUser.id,
        name: 'Test T-Shirt',
        category: 'tops',
        brand: 'Test Brand',
        price: 99.99,
        purchaseDate: new Date('2024-01-15'),
        condition: 'new'
      });

      expect(clothingItem.id).toBeDefined();
      expect(clothingItem.name).toBe('Test T-Shirt');
      expect(clothingItem.category).toBe('tops');
      expect(clothingItem.price).toBe(99.99);
      expect(clothingItem.userId).toBe(testUser.id);
    });

    it('应该验证必填字段', async () => {
      await expect(
        ClothingItem.create({
          userId: testUser.id,
          // 缺少 name
          category: 'tops'
        } as any)
      ).rejects.toThrow();
    });

    it('应该验证价格范围', async () => {
      await expect(
        ClothingItem.create({
          userId: testUser.id,
          name: 'Invalid Price Item',
          category: 'tops',
          price: -10
        })
      ).rejects.toThrow();
    });

    it('应该验证条件枚举值', async () => {
      await expect(
        ClothingItem.create({
          userId: testUser.id,
          name: 'Invalid Condition Item',
          category: 'tops',
          condition: 'invalid_condition' as any
        })
      ).rejects.toThrow();
    });
  });

  describe('衣物状态管理', () => {
    it('应该正确设置默认状态', async () => {
      const clothingItem = await ClothingItem.create({
        userId: testUser.id,
        name: 'Status Test Item',
        category: 'bottoms',
        condition: 'good'
      });

      expect(clothingItem.status).toBe('active');
      expect(clothingItem.isPublic).toBe(false);
    });

    it('应该正确标记为已删除', async () => {
      const clothingItem = await ClothingItem.create({
        userId: testUser.id,
        name: 'Delete Test Item',
        category: 'shoes',
        condition: 'new'
      });

      await clothingItem.softDelete();
      
      expect(clothingItem.deletedAt).toBeDefined();
      expect(clothingItem.isDeleted).toBe(true);
    });
  });

  describe('查询方法', () => {
    beforeEach(async () => {
      await ClothingItem.destroy({ where: {} });
      
      await ClothingItem.bulkCreate([
        {
          userId: testUser.id,
          name: 'T-Shirt 1',
          category: 'tops',
          brand: 'Brand A',
          price: 50,
          condition: 'new',
          status: 'active'
        },
        {
          userId: testUser.id,
          name: 'Jeans 1',
          category: 'bottoms',
          brand: 'Brand B',
          price: 120,
          condition: 'good',
          status: 'active'
        },
        {
          userId: testUser.id,
          name: 'Jacket 1',
          category: 'outerwear',
          brand: 'Brand C',
          price: 200,
          condition: 'fair',
          status: 'inactive'
        }
      ]);
    });

    it('应该按用户ID查找衣物', async () => {
      const items = await ClothingItem.findByUserId(testUser.id);
      expect(items).toHaveLength(3);
    });

    it('应该按类别查找衣物', async () => {
      const tops = await ClothingItem.findByCategory('tops');
      expect(tops).toHaveLength(1);
      expect(tops[0].name).toBe('T-Shirt 1');
    });

    it('应该按状态查找衣物', async () => {
      const activeItems = await ClothingItem.findByStatus('active');
      expect(activeItems).toHaveLength(2);
    });

    it('应该按品牌查找衣物', async () => {
      const brandItems = await ClothingItem.findByBrand('Brand B');
      expect(brandItems).toHaveLength(1);
      expect(brandItems[0].name).toBe('Jeans 1');
    });

    it('应该按价格范围查找衣物', async () => {
      const priceRangeItems = await ClothingItem.findByPriceRange(50, 150);
      expect(priceRangeItems).toHaveLength(2);
    });

    it('应该获取用户统计信息', async () => {
      const stats = await ClothingItem.getUserStats(testUser.id);
      
      expect(stats.totalItems).toBe(3);
      expect(stats.totalValue).toBe(370);
      expect(stats.categoryCount).toHaveProperty('tops', 1);
      expect(stats.categoryCount).toHaveProperty('bottoms', 1);
      expect(stats.categoryCount).toHaveProperty('outerwear', 1);
    });
  });

  describe('关联关系', () => {
    it('应该正确关联到用户', async () => {
      const clothingItem = await ClothingItem.create({
        userId: testUser.id,
        name: 'Association Test Item',
        category: 'accessories',
        condition: 'new'
      });

      const user = await clothingItem.getUser();
      expect(user).toBeDefined();
      expect(user.id).toBe(testUser.id);
    });
  });
});