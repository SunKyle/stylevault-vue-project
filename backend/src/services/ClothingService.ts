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
  // 私有辅助方法：安全解析整数
  private parseNumber(value: any): number | undefined {
    if (value === undefined || value === null) return undefined;
    const parsed = parseInt(String(value), 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  // 私有辅助方法：安全解析浮点数
  private parseFloatNumber(value: any): number | undefined {
    if (value === undefined || value === null) return undefined;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? undefined : parsed;
  }

  // 私有辅助方法：处理季节字段（同时支持season和seasons字段）
  private processSeasonData(season: any, seasons: any): number[] {
    const seasonValue = Array.isArray(season) ? season : Array.isArray(seasons) ? seasons : [];
    return seasonValue
      .map((s: any) => this.parseNumber(s))
      .filter((s: number | undefined) => s !== undefined) as number[];
  }

  // 私有辅助方法：安全处理字符串
  private safeTrim(str?: string): string | undefined {
    return str?.trim();
  }

  // 私有辅助方法：安全处理字符串数组
  private safeFilterArray(arr?: string[]): string[] {
    return Array.isArray(arr) ? arr.filter(url => this.safeTrim(url)) : [];
  }

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
    // 构建衣物数据对象，使用默认值和安全处理函数
    const clothingItemData: any = {
      userId: data.userId,
      name: this.safeTrim(data.name)!, // name是必填字段，确保非空
      brand: this.safeTrim(data.brand),
      condition: data.condition ?? 1, // 默认值设为1（假设1代表'good'）
      notes: this.safeTrim(data.notes),
      imageUrls: this.safeFilterArray(data.imageUrls),
      mainImageUrl: this.safeTrim(data.mainImageUrl),
      isFavorite: data.favorite ?? false,
      status: 1, // 1-有效，0-无效
    };

    // 处理可选日期字段
    if (data.purchaseDate) {
      clothingItemData.purchaseDate = new Date(data.purchaseDate);
    }
    
    // 处理数字属性字段
    const numberFields = ['category', 'color', 'style', 'size', 'material'];
    for (const field of numberFields) {
      const value = (data as any)[field];
      const parsed = this.parseNumber(value);
      if (parsed !== undefined) {
        clothingItemData[field] = parsed;
      }
    }
    
    // 处理价格（使用浮点数解析）
    const price = this.parseFloatNumber(data.price);
    if (price !== undefined) {
      clothingItemData.price = price;
    }
    
    // 处理parentId
    const parentId = this.parseNumber(data.parentId);
    if (parentId !== undefined) {
      clothingItemData.parentId = parentId;
    }
    
    // 处理季节数据
    clothingItemData.season = this.processSeasonData(data.season, data.seasons);
    
    return await clothingRepository.createClothingItem(clothingItemData);
  }

  /**
   * 更新衣物
   */
  async updateClothingItem(id: number, userId: number, data: ClothingUpdateData): Promise<any> {
    // 准备更新数据对象
    const updateData: any = {};
    
    // 更新基本信息字段
    if (data.name !== undefined) updateData.name = this.safeTrim(data.name);
    if (data.brand !== undefined) updateData.brand = this.safeTrim(data.brand);
    if (data.condition !== undefined) updateData.condition = data.condition;
    if (data.notes !== undefined) updateData.notes = this.safeTrim(data.notes);
    if (data.imageUrls !== undefined) updateData.imageUrls = this.safeFilterArray(data.imageUrls);
    if (data.mainImageUrl !== undefined) updateData.mainImageUrl = this.safeTrim(data.mainImageUrl);
    if (data.favorite !== undefined) updateData.isFavorite = data.favorite;
    
    // 更新日期字段
    if (data.purchaseDate !== undefined) updateData.purchaseDate = new Date(data.purchaseDate);
    
    // 处理数字属性字段
    const numberFields = ['category', 'color', 'style', 'size', 'material'];
    for (const field of numberFields) {
      const value = (data as any)[field];
      if (value !== undefined) {
        const parsed = this.parseNumber(value);
        updateData[field] = parsed;
      }
    }
    
    // 更新价格字段
    if (data.price !== undefined) {
      const price = this.parseFloatNumber(data.price);
      updateData.price = price;
    }
    
    // 更新季节字段
    if (data.season !== undefined || data.seasons !== undefined) {
      updateData.season = this.processSeasonData(data.season, data.seasons);
    }
    
    // 执行更新操作
    const updateResult = await clothingRepository.updateClothingItem(id, userId, updateData);
    
    // 处理更新结果，确保获取到更新后的衣物信息
    let updatedItem;
    if (Array.isArray(updateResult)) {
      const [affectedRows, items] = updateResult;
      if (affectedRows === 0) {
        throw new Error('衣物不存在或无权限修改');
      }
      updatedItem = items?.length > 0 ? items[0] : await clothingRepository.findClothingItemById(id, userId);
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