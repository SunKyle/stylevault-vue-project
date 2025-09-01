import { Sequelize } from 'sequelize-typescript';
import { Outfit, User, ClothingItem } from '../entities';
import config from '../../config';

describe('Outfit Model', () => {
  let sequelize: Sequelize;
  let testUser: User;
  let testClothingItems: ClothingItem[];

  beforeAll(async () => {
    sequelize = new Sequelize({
      ...config.database,
      models: [User, ClothingItem, Outfit],
      logging: false
    });
    await sequelize.sync({ force: true });

    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashed_password'
    });

    testClothingItems = await ClothingItem.bulkCreate([
      {
        userId: testUser.id,
        name: 'T-Shirt',
        category: 'tops',
        price: 50,
        condition: 'new'
      },
      {
        userId: testUser.id,
        name: 'Jeans',
        category: 'bottoms',
        price: 120,
        condition: 'good'
      },
      {
        userId: testUser.id,
        name: 'Sneakers',
        category: 'shoes',
        price: 200,
        condition: 'new'
      }
    ]);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('创建搭配', () => {
    it('应该成功创建基本搭配', async () => {
      const outfit = await Outfit.create({
        userId: testUser.id,
        name: 'Test Outfit',
        description: 'A test outfit for testing',
        occasion: 'casual',
        season: 'spring',
        style: 'street'
      });

      expect(outfit.id).toBeDefined();
      expect(outfit.name).toBe('Test Outfit');
      expect(outfit.userId).toBe(testUser.id);
      expect(outfit.status).toBe('draft');
    });

    it('应该验证必填字段', async () => {
      await expect(
        Outfit.create({
          userId: testUser.id,
          // 缺少 name
          description: 'Test description'
        } as any)
      ).rejects.toThrow();
    });

    it('应该验证状态枚举值', async () => {
      await expect(
        Outfit.create({
          userId: testUser.id,
          name: 'Invalid Status Outfit',
          status: 'invalid_status' as any
        })
      ).rejects.toThrow();
    });
  });

  describe('搭配状态管理', () => {
    it('应该正确设置默认状态', async () => {
      const outfit = await Outfit.create({
        userId: testUser.id,
        name: 'Status Test Outfit',
        description: 'Testing default status'
      });

      expect(outfit.status).toBe('draft');
      expect(outfit.isPublic).toBe(false);
    });

    it('应该正确发布搭配', async () => {
      const outfit = await Outfit.create({
        userId: testUser.id,
        name: 'Publish Test Outfit',
        description: 'Testing publish functionality'
      });

      await outfit.publish();
      
      expect(outfit.status).toBe('published');
      expect(outfit.publishedAt).toBeDefined();
    });

    it('应该正确计算总价格', async () => {
      const outfit = await Outfit.create({
        userId: testUser.id,
        name: 'Price Test Outfit',
        description: 'Testing price calculation'
      });

      // 添加衣物到搭配
      await outfit.addClothingItems(testClothingItems.map(item => item.id));

      const totalPrice = await outfit.calculateTotalPrice();
      expect(totalPrice).toBe(370); // 50 + 120 + 200
    });
  });

  describe('查询方法', () => {
    beforeEach(async () => {
      await Outfit.destroy({ where: {} });
      
      await Outfit.bulkCreate([
        {
          userId: testUser.id,
          name: 'Outfit 1',
          description: 'First test outfit',
          occasion: 'casual',
          season: 'spring',
          status: 'published',
          likesCount: 10,
          viewsCount: 100
        },
        {
          userId: testUser.id,
          name: 'Outfit 2',
          description: 'Second test outfit',
          occasion: 'formal',
          season: 'winter',
          status: 'draft',
          likesCount: 5,
          viewsCount: 50
        },
        {
          userId: testUser.id,
          name: 'Outfit 3',
          description: 'Third test outfit',
          occasion: 'business',
          season: 'autumn',
          status: 'published',
          likesCount: 20,
          viewsCount: 200
        }
      ]);
    });

    it('应该按用户ID查找搭配', async () => {
      const outfits = await Outfit.findByUserId(testUser.id);
      expect(outfits).toHaveLength(3);
    });

    it('应该按状态查找搭配', async () => {
      const publishedOutfits = await Outfit.findByStatus('published');
      expect(publishedOutfits).toHaveLength(2);
    });

    it('应该按场合查找搭配', async () => {
      const casualOutfits = await Outfit.findByOccasion('casual');
      expect(casualOutfits).toHaveLength(1);
      expect(casualOutfits[0].name).toBe('Outfit 1');
    });

    it('应该按季节查找搭配', async () => {
      const winterOutfits = await Outfit.findBySeason('winter');
      expect(winterOutfits).toHaveLength(1);
      expect(winterOutfits[0].name).toBe('Outfit 2');
    });

    it('应该按点赞数排序', async () => {
      const popularOutfits = await Outfit.findPopular(2);
      expect(popularOutfits).toHaveLength(2);
      expect(popularOutfits[0].likesCount).toBe(20);
      expect(popularOutfits[1].likesCount).toBe(10);
    });

    it('应该获取用户统计信息', async () => {
      const stats = await Outfit.getUserStats(testUser.id);
      
      expect(stats.totalOutfits).toBe(3);
      expect(stats.publishedCount).toBe(2);
      expect(stats.draftCount).toBe(1);
      expect(stats.totalLikes).toBe(35); // 10 + 5 + 20
      expect(stats.totalViews).toBe(350); // 100 + 50 + 200
    });
  });

  describe('关联关系', () => {
    it('应该正确关联到用户', async () => {
      const outfit = await Outfit.create({
        userId: testUser.id,
        name: 'Association Test Outfit',
        description: 'Testing user association'
      });

      const user = await outfit.getUser();
      expect(user).toBeDefined();
      expect(user.id).toBe(testUser.id);
    });

    it('应该正确关联到衣物', async () => {
      const outfit = await Outfit.create({
        userId: testUser.id,
        name: 'Clothing Association Test',
        description: 'Testing clothing association'
      });

      await outfit.addClothingItems(testClothingItems.map(item => item.id));

      const clothingItems = await outfit.getClothingItems();
      expect(clothingItems).toHaveLength(3);
      expect(clothingItems.map(item => item.id).sort()).toEqual(
        testClothingItems.map(item => item.id).sort()
      );
    });
  });

  describe('完整信息获取', () => {
    it('应该获取包含用户和衣物的完整信息', async () => {
      const outfit = await Outfit.create({
        userId: testUser.id,
        name: 'Full Info Test',
        description: 'Testing full info retrieval'
      });

      await outfit.addClothingItems(testClothingItems.map(item => item.id));

      const fullInfo = await outfit.getFullInfo();
      
      expect(fullInfo.user).toBeDefined();
      expect(fullInfo.clothingItems).toHaveLength(3);
      expect(fullInfo.totalPrice).toBe(370);
    });
  });
});