import { Clothing } from '../models/entities/Clothing';
import { clothingRepository } from '../repositories/ClothingRepository';

// 更新接口定义以匹配数据库结构
export interface ClothingQueryOptions {
  userId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  category?: number; // 从categoryId改为category
  search?: string;
  isFavorite?: boolean;
}

export interface ClothingCreateData {
  userId: number;
  name: string;
  brand?: string;
  price?: number;
  purchaseDate?: Date;
  size?: number; // 从string改为number，因为现在是属性ID
  condition?: number; // 从string改为number，因为现在是属性ID
  notes?: string;
  imageUrls?: string[];
  mainImageUrl?: string;
  category?: number; 
  color?: number; 
  style?: number; 
  parentId?: number;
  favorite?: boolean;
  season?: number[]; // 支持多个季节ID，使用单数season字段
  seasons?: number[]; // 向后兼容：支持旧的复数seasons字段
  material?: number;
}

export interface ClothingUpdateData {
  name?: string;
  brand?: string;
  price?: number;
  purchaseDate?: Date;
  size?: number; // 从string改为number，因为现在是属性ID
  condition?: number; // 从string改为number，因为现在是属性ID
  notes?: string;
  imageUrls?: string[];
  mainImageUrl?: string;
  category?: number; // 从categoryId改为category
  color?: number; // 从colorId改为color
  style?: number; // 从styleId改为style
  favorite?: boolean;
  season?: number[]; // 支持多个季节ID，使用单数season字段
  seasons?: number[]; // 向后兼容：支持旧的复数seasons字段
  material?: number;
}

export class ClothingService {


  /**
   * 获取衣物列表（确保用户权限隔离）
   */
  async getClothingItems(options: ClothingQueryOptions) {
    if (!options.userId) {
      throw new Error('userId is required for security isolation');
    }
    return await clothingRepository.findClothingItems(options);
  }

  /**
   * 获取用户衣物列表
   */
  async getUserClothingItems(userId: number, options: ClothingQueryOptions = {}) {
    return await clothingRepository.findClothingItems({ ...options, userId });
  }

  /**
   * 获取衣物详情
   */
  async getClothingItemById(id: number, userId?: number): Promise<any | null> {
    return await clothingRepository.findClothingItemById(id, userId);
  }

  /**
   * 创建衣物
   */
  async createClothingItem(data: ClothingCreateData) {
    // 辅助函数：安全解析数字
    const parseNumber = (value: any): number | undefined => {
      if (value === undefined || value === null) return undefined;
      const parsed = parseInt(String(value), 10);
      return isNaN(parsed) ? undefined : parsed;
    };
    
    // 辅助函数：安全解析浮点数
    const parseFloatNumber = (value: any): number | undefined => {
      if (value === undefined || value === null) return undefined;
      const parsed = parseFloat(String(value));
      return isNaN(parsed) ? undefined : parsed;
    };

    // 直接使用独立字段处理数据，不再从metadata中获取
    const clothingItemData: any = {
      userId: data.userId,
      name: data.name.trim(),
      brand: data.brand?.trim(),
      condition: data.condition ?? 1, // 默认值设为1（假设1代表'good'）
      notes: data.notes?.trim(),
      imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls.filter((url: string) => url?.trim()) : [],
      mainImageUrl: data.mainImageUrl?.trim(),
      isFavorite: data.favorite ?? false,
      status: 1, // 1-有效，0-无效
    };

    // 处理purchaseDate
    if (data.purchaseDate) {
      clothingItemData.purchaseDate = new Date(data.purchaseDate);
    }
    
    // 处理分类、颜色、风格、尺寸、材质（使用辅助函数减少重复代码）
    const numberFields = ['category', 'color', 'style', 'size', 'material'];
    for (const field of numberFields) {
      const value = (data as any)[field];
      if (value !== undefined && value !== null) {
        clothingItemData[field] = parseNumber(value);
      }
    }
    
    // 处理价格（使用浮点数解析）
    if (data.price !== undefined && data.price !== null) {
      clothingItemData.price = parseFloatNumber(data.price);
    }
    
    // 处理parentId
    if (data.parentId !== undefined && data.parentId !== null) {
      clothingItemData.parentId = data.parentId;
    }
    
    // 处理季节（同时支持season和seasons字段）
    const seasonValue = Array.isArray(data.season) ? data.season : 
                       Array.isArray(data.seasons) ? data.seasons : [];
    clothingItemData.seasons = seasonValue
      .map((season: any) => parseNumber(season))
      .filter((season: number | undefined) => season !== undefined);

    console.log('clothingItemData!!!!!', clothingItemData);  
    return await clothingRepository.createClothingItem(clothingItemData);
  }

  /**
   * 更新衣物
   */
  async updateClothingItem(id: number, userId: number, data: ClothingUpdateData): Promise<any> {
    // 辅助函数：安全解析数字
    const parseNumber = (value: any): number | undefined => {
      if (value === undefined || value === null) return undefined;
      const parsed = parseInt(String(value), 10);
      return isNaN(parsed) ? undefined : parsed;
    };
    
    // 辅助函数：安全解析浮点数
    const parseFloatNumber = (value: any): number | undefined => {
      if (value === undefined || value === null) return undefined;
      const parsed = parseFloat(String(value));
      return isNaN(parsed) ? undefined : parsed;
    };
    
    // 准备更新数据
    const updateData: any = {};
    
    // 更新基本信息
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.brand !== undefined) updateData.brand = data.brand.trim();
    if (data.condition !== undefined) updateData.condition = data.condition;
    if (data.notes !== undefined) updateData.notes = data.notes.trim();
    if (data.imageUrls !== undefined) updateData.imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls.filter((url: string) => url?.trim()) : [];
    if (data.mainImageUrl !== undefined) updateData.mainImageUrl = data.mainImageUrl?.trim();
    if (data.favorite !== undefined) updateData.isFavorite = data.favorite;
    
    // 更新日期
    if (data.purchaseDate !== undefined) updateData.purchaseDate = new Date(data.purchaseDate);
    
    // 处理分类、颜色、风格、尺寸、材质（使用辅助函数减少重复代码）
    const numberFields = ['category', 'color', 'style', 'size', 'material'];
    for (const field of numberFields) {
      const value = (data as any)[field];
      if (value !== undefined) {
        updateData[field] = parseNumber(value);
      }
    }
    
    // 更新价格（使用浮点数解析）
    if (data.price !== undefined) {
      updateData.price = parseFloatNumber(data.price);
    }
    
    // 更新季节（同时支持season和seasons字段）
    if (data.season !== undefined || data.seasons !== undefined) {
      const seasonValue = Array.isArray(data.season) ? data.season : 
                         Array.isArray(data.seasons) ? data.seasons : [];
      updateData.seasons = seasonValue
        .map((season: any) => parseNumber(season))
        .filter((season: number | undefined) => season !== undefined);
    }
    
    // 执行更新
    const updateResult = await clothingRepository.updateClothingItem(id, userId, updateData);
    
    // 处理更新结果，sequelize可能返回不同的格式
    let updatedItem;
    if (Array.isArray(updateResult)) {
      const [affectedRows, items] = updateResult;
      if (affectedRows === 0) {
        throw new Error('衣物不存在或无权限修改');
      }
      updatedItem = items && items.length > 0 ? items[0] : await clothingRepository.findClothingItemById(id, userId);
    } else {
      // 如果只返回受影响的行数
      if (updateResult === 0) {
        throw new Error('衣物不存在或无权限修改');
      }
      updatedItem = await clothingRepository.findClothingItemById(id, userId);
    }
    
    if (!updatedItem) {
      throw new Error('衣物不存在或无权限修改');
    }
    
    return updatedItem;
  }

  /**
   * 删除衣物（软删除）
   */
  async deleteClothingItem(id: number, userId: number): Promise<void> {
    const [affectedRows] = await clothingRepository.deleteClothingItem(id, userId);

    if (affectedRows === 0) {
      throw new Error('衣物不存在或无权限删除');
    }
  }

  /**
   * 切换收藏状态
   */
  async toggleFavorite(id: number, userId: number): Promise<{ clothingItem: any; message: string }> {
    const clothingItem = await this.getClothingItemById(id, userId);
    if (!clothingItem) {
      throw new Error('衣物不存在或无权限修改');
    }

    const isFavorite = !clothingItem.isFavorite;
    await clothingRepository.updateClothingItem(id, userId, { isFavorite });
    
    clothingItem.isFavorite = isFavorite;
    const message = isFavorite ? '已添加到收藏' : '已取消收藏';
    return { clothingItem, message };
  }

  /**
   * 根据分类获取衣物
   */
  async getClothingItemsByCategory(categoryId: number, userId: number, options: ClothingQueryOptions = {}) {
    return await clothingRepository.findClothingItems({ ...options, category: categoryId, userId });
  }

  /**
   * 搜索衣物
   */
  async searchClothingItems(search: string, userId: number, options: ClothingQueryOptions = {}) {
    return await clothingRepository.findClothingItems({ ...options, search, userId });
  }

  /**
   * 获取衣物统计信息
   */
  async getClothingStats(userId: number): Promise<{
    totalItems: number;
    favoriteItems: number;
    totalValue: number;
  }> {
    const stats = await clothingRepository.getClothingStats(userId);
    return {
      totalItems: stats.totalItems,
      favoriteItems: stats.favoriteItems,
      totalValue: stats.totalValue
    };
  }

  /**
   * 获取收藏列表
   */
  async getFavoriteItems(userId: number, options: any = {}): Promise<{ items: any[]; total: number }> {
    const result = await clothingRepository.findFavoriteItems(userId, options);
    return {
      items: result.items,
      total: result.pagination.totalItems
    };
  }
}