import { Sequelize } from 'sequelize-typescript';
import { User } from '../entities/User';
import config from '../../config';

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      ...config.database,
      models: [User],
      logging: false
    });
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('创建用户', () => {
    it('应该成功创建基本用户', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        phone: '13800138000'
      });

      expect(user.id).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('应该验证邮箱格式', async () => {
      await expect(
        User.create({
          username: 'invalidemail',
          email: 'invalid-email',
          passwordHash: 'hashed_password'
        })
      ).rejects.toThrow();
    });

    it('应该验证用户名唯一性', async () => {
      await User.create({
        username: 'uniqueuser',
        email: 'unique1@example.com',
        passwordHash: 'hashed_password'
      });

      await expect(
        User.create({
          username: 'uniqueuser',
          email: 'unique2@example.com',
          passwordHash: 'hashed_password'
        })
      ).rejects.toThrow();
    });
  });

  describe('用户状态管理', () => {
    it('应该正确设置默认状态', async () => {
      const user = await User.create({
        username: 'statususer',
        email: 'status@example.com',
        passwordHash: 'hashed_password'
      });

      expect(user.status).toBe('active');
      expect(user.isEmailVerified).toBe(false);
    });

    it('应该正确更新最后登录时间', async () => {
      const user = await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        passwordHash: 'hashed_password'
      });

      const originalTime = user.lastLoginAt;
      await user.updateLastLogin();
      
      expect(user.lastLoginAt).not.toEqual(originalTime);
    });
  });

  describe('查询方法', () => {
    beforeEach(async () => {
      await User.destroy({ where: {} });
      
      await User.bulkCreate([
        {
          username: 'user1',
          email: 'user1@example.com',
          passwordHash: 'hash1',
          status: 'active'
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          passwordHash: 'hash2',
          status: 'inactive'
        }
      ]);
    });

    it('应该按状态查找用户', async () => {
      const activeUsers = await User.findByStatus('active');
      expect(activeUsers).toHaveLength(1);
      expect(activeUsers[0].username).toBe('user1');
    });

    it('应该按邮箱查找用户', async () => {
      const user = await User.findByEmail('user1@example.com');
      expect(user).toBeDefined();
      expect(user?.username).toBe('user1');
    });

    it('应该按用户名查找用户', async () => {
      const user = await User.findByUsername('user2');
      expect(user).toBeDefined();
      expect(user?.email).toBe('user2@example.com');
    });
  });
});