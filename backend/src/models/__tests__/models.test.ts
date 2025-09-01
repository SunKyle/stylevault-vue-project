import 'reflect-metadata';
import { sequelize } from '../../config/database';
import { User, ClothingItem, Outfit, Category, Tag } from '../index';

describe('Database Models', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('User Model', () => {
    it('should create a user with valid data', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword123'
      });

      expect(user.id).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should not create user with duplicate email', async () => {
      await expect(
        User.create({
          username: 'testuser2',
          email: 'test@example.com',
          password: 'hashedpassword123'
        })
      ).rejects.toThrow();
    });
  });

  describe('Category Model', () => {
    it('should create a category', async () => {
      const category = await Category.create({
        name: 'Tops',
        description: 'Shirts, t-shirts, blouses'
      });

      expect(category.id).toBeDefined();
      expect(category.name).toBe('Tops');
    });

    it('should create subcategories', async () => {
      const parent = await Category.create({
        name: 'Clothing',
        description: 'All clothing items'
      });

      const child = await Category.create({
        name: 'Shirts',
        description: 'Various types of shirts',
        parentId: parent.id
      });

      expect(child.parentId).toBe(parent.id);
    });
  });

  describe('Tag Model', () => {
    it('should create a tag', async () => {
      const tag = await Tag.create({
        name: 'Casual',
        color: '#4CAF50',
        description: 'Casual wear style'
      });

      expect(tag.id).toBeDefined();
      expect(tag.name).toBe('Casual');
      expect(tag.color).toBe('#4CAF50');
    });
  });

  describe('ClothingItem Model', () => {
    let user: User;
    let category: Category;

    beforeAll(async () => {
      user = await User.create({
        username: 'clothinguser',
        email: 'clothing@example.com',
        password: 'hashedpassword123'
      });

      category = await Category.create({
        name: 'Dresses',
        description: 'Various dresses'
      });
    });

    it('should create a clothing item', async () => {
      const item = await ClothingItem.create({
        name: 'Summer Dress',
        description: 'Light summer dress',
        type: 'dress',
        season: 'summer',
        color: 'blue',
        brand: 'Fashion Brand',
        size: 'M',
        userId: user.id,
        categoryId: category.id
      });

      expect(item.id).toBeDefined();
      expect(item.name).toBe('Summer Dress');
      expect(item.userId).toBe(user.id);
      expect(item.categoryId).toBe(category.id);
    });
  });

  describe('Outfit Model', () => {
    let user: User;

    beforeAll(async () => {
      user = await User.create({
        username: 'outfituser',
        email: 'outfit@example.com',
        password: 'hashedpassword123'
      });
    });

    it('should create an outfit', async () => {
      const outfit = await Outfit.create({
        title: 'Summer Casual',
        description: 'Perfect for summer days',
        season: 'summer',
        occasion: 'casual',
        userId: user.id
      });

      expect(outfit.id).toBeDefined();
      expect((outfit as any).title).toBe('Summer Casual');
      expect(outfit.userId).toBe(user.id);
    });
  });

  describe('Model Associations', () => {
    let user: User;
    let category: Category;
    let clothingItem: ClothingItem;
    let outfit: Outfit;

    beforeAll(async () => {
      user = await User.create({
        username: 'assocuser',
        email: 'assoc@example.com',
        password: 'hashedpassword123'
      });

      category = await Category.create({
        name: 'Pants',
        description: 'Various pants'
      });

      clothingItem = await ClothingItem.create({
        name: 'Blue Jeans',
        description: 'Classic blue jeans',
        type: 'pants',
        season: 'all',
        color: 'blue',
        brand: 'Denim Co',
        size: '32',
        userId: user.id,
        categoryId: category.id
      });

      outfit = await Outfit.create({
        title: 'Casual Look',
        description: 'Everyday casual outfit',
        season: 'all',
        occasion: 'casual',
        userId: user.id
      });
    });

    it('should load user with clothing items', async () => {
      const loadedUser = await User.findByPk(user.id, {
        include: [{ model: ClothingItem, as: 'clothingItems' }]
      });

      expect(loadedUser).toBeDefined();
      expect((loadedUser as any)?.clothingItems).toBeDefined();
      expect((loadedUser as any)?.clothingItems?.length).toBeGreaterThan(0);
    });

    it('should load clothing item with user and category', async () => {
      const loadedItem = await ClothingItem.findByPk(clothingItem.id, {
        include: [{ model: User, as: 'user' }, { model: Category, as: 'category' }]
      });

      expect(loadedItem).toBeDefined();
      expect((loadedItem as any)?.user).toBeDefined();
      expect((loadedItem as any)?.category).toBeDefined();
      expect((loadedItem as any)?.user?.username).toBe('assocuser');
      expect((loadedItem as any)?.category?.name).toBe('Pants');
    });

    it('should load user with outfits', async () => {
      const loadedUser = await User.findByPk(user.id, {
        include: [{ model: Outfit, as: 'outfits' }]
      });

      expect(loadedUser).toBeDefined();
      expect((loadedUser as any)?.outfits).toBeDefined();
      expect((loadedUser as any)?.outfits?.length).toBeGreaterThan(0);
    });
  });
});