import { clothingRepository } from '../repositories/ClothingRepository';
import { Clothing } from '../models/entities/Clothing';

export interface ClothingQueryOptions {
  userId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  categoryId?: number;
  search?: string;
  isFavorite?: boolean;
}

export interface ClothingCreateData {
  userId: number;
  name: string;
  brand?: string;
  price?: number;
  purchaseDate?: Date;
  size?: string;
  condition?: string;
  notes?: string;
  imageUrls?: string[];
  mainImageUrl?: string;
  categoryId?: number;
  colorId?: number;
  styleId?: number;
  parentId?: number;
  metadata?: any;
}

export interface ClothingUpdateData {
  name?: string;
  brand?: string;
  price?: number;
  purchaseDate?: Date;
  size?: string;
  condition?: string;
  notes?: string;
  imageUrls?: string[];
  mainImageUrl?: string;
  categoryId?: number;
  colorId?: number;
  styleId?: number;
  metadata?: any;
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

    const clothingItemData: any = {
      userId: data.userId,
      name: data.name.trim(),
      brand: data.brand?.trim(),
      condition: data.condition || 'good',
      notes: data.notes?.trim(),
      imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls.filter(url => url && url.trim()) : [],
      mainImageUrl: data.mainImageUrl?.trim(),
      isFavorite: false,
      status: 'active',
      metadata: {
        ...typeof data.metadata === 'object' ? data.metadata : {},
        favorite: false
      }
    };

    if (data.price !== undefined) clothingItemData.price = data.price;
    if (data.purchaseDate) clothingItemData.purchaseDate = new Date(data.purchaseDate);
    if (data.categoryId) clothingItemData.categoryId = data.categoryId;
    if (data.colorId) clothingItemData.colorId = data.colorId;
    if (data.styleId) clothingItemData.styleId = data.styleId;
    if (data.size) clothingItemData.size = data.size.trim();
    if (data.parentId) clothingItemData.parentId = data.parentId;

    return await clothingRepository.createClothingItem(clothingItemData);
  }

  /**
   * 更新衣物
   */
  async updateClothingItem(id: number, userId: number, data: any): Promise<any> {
    const [affectedRows, [updatedItem]] = await clothingRepository.updateClothingItem(id, userId, data);

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
    return await clothingRepository.findClothingItems({ ...options, categoryId, userId });
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