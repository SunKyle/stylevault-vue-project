import { Clothing } from '../models/entities/Clothing';
import { clothingRepository } from '../repositories/ClothingRepository';
import logger from '../utils/logger';

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
  category?: number; // 从categoryId改为category
  color?: number; // 从colorId改为color
  colorId?: number;
  style?: number; // 从styleId改为style
  styleId?: number;
  parentId?: number;
  favorite?: boolean;
  seasons?: string[];
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
  seasons?: string[];
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
    // 从metadata中提取字段（兼容前端可能的不同数据结构）
    const metadata = (data as any).metadata || {};
    
    // 直接使用独立字段处理数据，如果独立字段不存在则从metadata中获取
    const clothingItemData: any = {
      userId: data.userId,
      name: data.name.trim(),
      brand: data.brand?.trim(),
      condition: data.condition || metadata.condition || 1, // 默认值设为1（假设1代表'good'）
      notes: data.notes?.trim(),
      imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls.filter((url: string) => url && url.trim()) : [],
      mainImageUrl: data.mainImageUrl?.trim(),
      isFavorite: data.favorite || false,
      status: 1, // 1-有效，0-无效
    };

    // 处理purchaseDate
    if (data.purchaseDate) clothingItemData.purchaseDate = new Date(data.purchaseDate);
    else if (metadata.purchaseDate) clothingItemData.purchaseDate = new Date(metadata.purchaseDate);
    
    // 处理分类
    if (data.category) clothingItemData.category = parseInt(data.category as unknown as string);
    
    // 处理颜色
    if (data.color) clothingItemData.color = parseInt(data.color as unknown as string);
    else if (data.colorId) clothingItemData.color = parseInt(data.colorId as unknown as string);
    
    // 处理风格
    if (data.style) clothingItemData.style = parseInt(data.style as unknown as string);
    else if (data.styleId) clothingItemData.style = parseInt(data.styleId as unknown as string);
    
    // 处理尺寸（从data或metadata中获取，并确保转换为数字）
    if (data.size) clothingItemData.size = parseInt(data.size as unknown as string);
    else if (metadata.size) clothingItemData.size = parseInt(metadata.size);
    
    // 处理价格
    if (data.price !== undefined) clothingItemData.price = parseFloat(data.price as unknown as string);
    else if (metadata.price !== undefined) clothingItemData.price = parseFloat(metadata.price);
    
    // 处理parentId
    if (data.parentId) clothingItemData.parentId = data.parentId;
    
    // 处理季节 - 兼容前端提交的seasons数组和后端的season字段
    let seasonsData = data.seasons;
    if (!seasonsData && metadata.seasons) {
      seasonsData = metadata.seasons;
    }
    
    // 如果有季节数据，取第一个季节作为主要季节（因为数据库只支持单个季节）
    if (Array.isArray(seasonsData) && seasonsData.length > 0) {
      // 季节数据是ID，直接使用
      const firstSeason = seasonsData[0];
      if (typeof firstSeason === 'number') {
        clothingItemData.season = firstSeason;
      } else {
        // 如果是字符串格式的ID，转换为数字
        const seasonId = parseInt(firstSeason);
        if (!isNaN(seasonId)) {
          clothingItemData.season = seasonId;
        }
      }
    }
    
    // 处理材质（从data或metadata中获取，并确保转换为数字）
    if (data.material) {
      if (typeof data.material === 'string') {
        clothingItemData.material = parseInt(data.material);
      } else {
        clothingItemData.material = data.material;
      }
    } else if (metadata.material) {
      if (typeof metadata.material === 'string') {
        clothingItemData.material = parseInt(metadata.material);
      } else {
        clothingItemData.material = metadata.material;
      }
    }

    // 处理尺寸
    if (data.size) {
      if (typeof data.size === 'string') {
        clothingItemData.size = parseInt(data.size);
      } else {
        clothingItemData.size = data.size;
      }
    } else if (metadata.size) {
      if (typeof metadata.size === 'string') {
        clothingItemData.size = parseInt(metadata.size);
      } else {
        clothingItemData.size = metadata.size;
      }
    }

    return await clothingRepository.createClothingItem(clothingItemData);
  }

  /**
   * 更新衣物
   */
  async updateClothingItem(id: number, userId: number, data: ClothingUpdateData): Promise<any> {
    // 从metadata中提取字段（兼容前端可能的不同数据结构）
    const metadata = (data as any).metadata || {};
    
    // 准备更新数据
    const updateData: any = {};
    
    // 更新基本信息
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.brand !== undefined) updateData.brand = data.brand.trim();
    if (data.condition !== undefined) updateData.condition = data.condition;
    else if (metadata.condition !== undefined) updateData.condition = metadata.condition;
    if (data.notes !== undefined) updateData.notes = data.notes.trim();
    if (data.imageUrls !== undefined) updateData.imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls.filter((url: string) => url && url.trim()) : [];
    if (data.mainImageUrl !== undefined) updateData.mainImageUrl = data.mainImageUrl?.trim();
    if (data.favorite !== undefined) updateData.isFavorite = data.favorite;
    
    // 更新日期
    if (data.purchaseDate !== undefined) updateData.purchaseDate = new Date(data.purchaseDate);
    else if (metadata.purchaseDate !== undefined) updateData.purchaseDate = new Date(metadata.purchaseDate);
    
    // 更新分类
    if (data.category !== undefined) updateData.category = parseInt(data.category as unknown as string);
    else if (metadata.category !== undefined) updateData.category = parseInt(metadata.category as unknown as string);
    
    // 更新颜色
    if (data.color !== undefined) updateData.color = parseInt(data.color as unknown as string);
    else if (metadata.color !== undefined) updateData.color = parseInt(metadata.color as unknown as string);
    
    // 更新风格
    if (data.style !== undefined) updateData.style = parseInt(data.style as unknown as string);
    else if (metadata.style !== undefined) updateData.style = parseInt(metadata.style as unknown as string);
    
    // 更新尺寸
    if (data.size !== undefined) updateData.size = parseInt(data.size as unknown as string);
    else if (metadata.size !== undefined) updateData.size = parseInt(metadata.size as unknown as string);
    
    // 更新价格
    if (data.price !== undefined) updateData.price = parseFloat(data.price as unknown as string);
    else if (metadata.price !== undefined) updateData.price = parseFloat(metadata.price as unknown as string);
    
    // 更新季节
    if (data.seasons !== undefined) updateData.seasons = data.seasons;
    else if (metadata.seasons !== undefined) updateData.seasons = metadata.seasons;
    
    // 更新材质
    if (data.material !== undefined) updateData.material = parseInt(data.material as unknown as string);
    else if (metadata.material !== undefined) updateData.material = parseInt(metadata.material as unknown as string);
    
    const [affectedRows, [updatedItem]] = await clothingRepository.updateClothingItem(id, userId, updateData);

    if (affectedRows === 0) {
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