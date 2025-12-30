import { OutfitRepository } from '../repositories/OutfitRepository';
import { OutfitClothingRepository } from '../repositories/OutfitClothingRepository';
import { ClothingRepository } from '../repositories/ClothingRepository';

// 创建仓库实例
const outfitRepository = new OutfitRepository();
const outfitClothingRepository = new OutfitClothingRepository();
const clothingRepository = new ClothingRepository();
import { User } from '../models/entities/User';
import logger from '../utils/logger';

// 搭配创建数据接口
export interface OutfitCreateData {
  userId: number;
  name: string;
  description?: string;
  season?: number;
  occasion?: number;
  style?: number;
  coverImageUrl?: string;
  imageUrls?: string[];
  isPublic?: boolean;
  metadata?: any;
  // 新增多选字段
  scenes?: string[];
  seasons?: string[];
  styles?: string[];
  likes?: number;
  items?: Array<{
    id: number;
    name?: string;
    mainImageUrl?: string;
    category?: number;
    isFavorite?: boolean;
  }>;
}

// 搭配更新数据接口
export interface OutfitUpdateData {
  name?: string;
  description?: string;
  season?: number;
  occasion?: number;
  style?: number;
  coverImageUrl?: string;
  imageUrls?: string[];
  isPublic?: boolean;
  metadata?: any;
}

// 搭配查询选项接口
export interface OutfitQueryOptions {
  userId?: number;
  status?: string;
  season?: number;
  occasion?: number;
  style?: number;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class OutfitService {
  /**
   * 创建新搭配
   */
  async createOutfit(data: OutfitCreateData): Promise<any> {
    try {
      const outfitData: any = {
        userId: data.userId,
        name: data.name.trim(),
        description: data.description?.trim(),
        season: data.season,
        occasion: data.occasion,
        style: data.style,
        coverImageUrl: data.coverImageUrl?.trim(),
        imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls.filter(url => url && url.trim()) : [],
        isPublic: data.isPublic || false,
        status: 'draft',
        metadata: data.metadata || {},
        // 新增多选字段
        scenes: Array.isArray(data.scenes) ? data.scenes : [],
        seasons: Array.isArray(data.seasons) ? data.seasons : [],
        styles: Array.isArray(data.styles) ? data.styles : [],
        likes: data.likes || 0
      };

      const outfit = await outfitRepository.create(outfitData);

      // 如果有items，批量添加到搭配
      if (Array.isArray(data.items) && data.items.length > 0) {
        const clothingIds = data.items.map(item => item.id);
        await outfitClothingRepository.addClothesToOutfit(outfit.id, clothingIds);
        
        // 可选：更新metadata中的items信息
        const itemsMetadata = data.items.map((item, index) => ({
          clothingId: item.id,
          name: item.name,
          mainImageUrl: item.mainImageUrl,
          category: item.category,
          isFavorite: item.isFavorite,
          orderIndex: index
        }));
        
        await outfitRepository.update(outfit.id, {
          metadata: {
            ...outfitData.metadata,
            items: itemsMetadata
          }
        });
      }

      logger.info(`用户 ${data.userId} 创建了新搭配: ${outfit.id}`);
      return outfit;
    } catch (error) {
      logger.error('创建搭配失败:', error);
      throw new Error(`创建搭配失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取搭配列表
   */
  async getOutfits(options: OutfitQueryOptions): Promise<any> {
    try {
      // 确保用户权限隔离
      if (!options.userId) {
        throw new Error('userId is required for security isolation');
      }
      
      // 转换类型以匹配OutfitRepository的接口
      const repositoryOptions: any = { ...options };
      if (repositoryOptions.season !== undefined) {
        repositoryOptions.season = String(repositoryOptions.season);
      }
      if (repositoryOptions.occasion !== undefined) {
        repositoryOptions.occasion = String(repositoryOptions.occasion);
      }
      if (repositoryOptions.style !== undefined) {
        repositoryOptions.style = String(repositoryOptions.style);
      }
      
      return await outfitRepository.findAll(repositoryOptions);
    } catch (error) {
      logger.error('获取搭配列表失败:', error);
      throw new Error(`获取搭配列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取搭配详情
   */
  async getOutfitById(id: number, userId?: number): Promise<any | null> {
    try {
      const outfit = await outfitRepository.findById(id);
      // 如果指定了userId，则检查所有权
      if (userId && outfit && outfit.userId !== userId) {
        return null;
      }
      
      // 获取搭配的完整信息，包括衣物详情
      const fullInfo = await outfitRepository.getFullInfo(id);
      return fullInfo;
    } catch (error) {
      logger.error(`获取搭配 ${id} 详情失败:`, error);
      throw new Error(`获取搭配详情失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更新搭配信息
   */
  async updateOutfit(id: number, userId: number, data: OutfitUpdateData): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const existingOutfit = await outfitRepository.findById(id);
      if (!existingOutfit || existingOutfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.description !== undefined) updateData.description = data.description.trim();
      if (data.season !== undefined) updateData.season = String(data.season);
      if (data.occasion !== undefined) updateData.occasion = String(data.occasion);
      if (data.style !== undefined) updateData.style = String(data.style);
      if (data.coverImageUrl !== undefined) updateData.coverImageUrl = data.coverImageUrl.trim();
      if (data.imageUrls !== undefined) {
        updateData.imageUrls = Array.isArray(data.imageUrls) ? 
          data.imageUrls.filter(url => url && url.trim()) : [];
      }
      if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
      if (data.metadata !== undefined) updateData.metadata = data.metadata;

      const updatedOutfit = await outfitRepository.update(id, updateData);
      logger.info(`用户 ${userId} 更新了搭配: ${id}`);
      return updatedOutfit;
    } catch (error) {
      logger.error(`更新搭配 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 删除搭配
   */
  async deleteOutfit(id: number, userId: number): Promise<void> {
    try {
      // 先检查搭配是否存在
      const existingOutfit = await outfitRepository.findById(id);
      if (!existingOutfit || existingOutfit.userId !== userId) {
        throw new Error('搭配不存在或无权限删除');
      }

      // 先删除搭配与衣物的关联
      await outfitClothingRepository.clearOutfitClothes(id);
      
      // 然后删除搭配
      await outfitRepository.delete(id);
      logger.info(`用户 ${userId} 删除了搭配: ${id}`);
    } catch (error) {
      logger.error(`删除搭配 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 添加衣物到搭配
   */
  async addClothingToOutfit(outfitId: number, clothingId: number, userId: number): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(outfitId);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      // 验证衣物是否存在且属于用户
      const clothing = await clothingRepository.findClothingItemById(clothingId, userId);
      if (!clothing) {
        throw new Error('衣物不存在或无权限使用');
      }

      // 检查衣物是否已经在搭配中
      const existing = await outfitClothingRepository.findAll({
        outfitId,
        clothingId
      });
      if (existing.length > 0) {
        throw new Error('该衣物已经在搭配中');
      }

      // 获取当前搭配中衣物数量，作为新衣物的orderIndex
      const clothesCount = await outfitClothingRepository.countClothesInOutfit(outfitId);
      
      // 添加衣物到搭配
      const result = await outfitClothingRepository.addClothingToOutfit(outfitId, clothingId, clothesCount);
      logger.info(`用户 ${userId} 为搭配 ${outfitId} 添加了衣物 ${clothingId}`);
      return result;
    } catch (error) {
      logger.error(`添加衣物到搭配失败:`, error);
      throw error;
    }
  }

  /**
   * 从搭配中移除衣物
   */
  async removeClothingFromOutfit(outfitId: number, clothingId: number, userId: number): Promise<void> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(outfitId);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      // 检查衣物是否在搭配中
      const existing = await outfitClothingRepository.findAll({
        outfitId,
        clothingId
      });
      if (existing.length === 0) {
        throw new Error('该衣物不在搭配中');
      }

      // 从搭配中移除衣物
      await outfitClothingRepository.removeClothingFromOutfit(outfitId, clothingId);
      logger.info(`用户 ${userId} 从搭配 ${outfitId} 中移除了衣物 ${clothingId}`);
    } catch (error) {
      logger.error(`从搭配中移除衣物失败:`, error);
      throw error;
    }
  }

  /**
   * 重新排序搭配中的衣物
   */
  async reorderClothesInOutfit(outfitId: number, clothesOrder: number[], userId: number): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(outfitId);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      // 重新排序衣物
      await outfitClothingRepository.reorderClothesInOutfit(outfitId, clothesOrder);
      logger.info(`用户 ${userId} 重新排序了搭配 ${outfitId} 中的衣物`);
      
      // 返回更新后的衣物列表
      return await this.getOutfitClothes(outfitId, userId);
    } catch (error) {
      logger.error(`重新排序搭配中的衣物失败:`, error);
      throw error;
    }
  }

  /**
   * 获取搭配中的所有衣物
   */
  async getOutfitClothes(outfitId: number, userId?: number): Promise<any[]> {
    try {
      // 如果提供了userId，验证搭配是否属于用户
      if (userId) {
        const outfit = await outfitRepository.findById(outfitId);
        if (!outfit || outfit.userId !== userId) {
          throw new Error('搭配不存在或无权限访问');
        }
      }

      // 获取搭配中的衣物
      const clothes = await outfitClothingRepository.findByOutfitId(outfitId);
      return clothes;
    } catch (error) {
      logger.error(`获取搭配中的衣物失败:`, error);
      throw error;
    }
  }

  /**
   * 发布搭配
   */
  async publishOutfit(id: number, userId: number): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(id);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      if (outfit.status === 'published') {
        throw new Error('搭配已经发布');
      }

      // 发布搭配
      const updatedOutfit = await outfitRepository.update(id, {
        status: 'published',
        metadata: {
          ...outfit.metadata,
          publishedAt: new Date()
        }
      });
      
      logger.info(`用户 ${userId} 发布了搭配: ${id}`);
      return updatedOutfit;
    } catch (error) {
      logger.error(`发布搭配失败:`, error);
      throw error;
    }
  }

  /**
   * 归档搭配
   */
  async archiveOutfit(id: number, userId: number): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(id);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      if (outfit.status === 'archived') {
        throw new Error('搭配已经归档');
      }

      // 归档搭配
      const updatedOutfit = await outfitRepository.update(id, {
        status: 'archived',
        metadata: {
          ...outfit.metadata,
          archivedAt: new Date()
        }
      });
      
      logger.info(`用户 ${userId} 归档了搭配: ${id}`);
      return updatedOutfit;
    } catch (error) {
      logger.error(`归档搭配失败:`, error);
      throw error;
    }
  }

  /**
   * 设置搭配为公开
   */
  async setOutfitPublic(id: number, userId: number): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(id);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      if (outfit.status !== 'published') {
        throw new Error('只有已发布的搭配才能设置为公开');
      }

      // 设置搭配为公开
      const updatedOutfit = await outfitRepository.update(id, { isPublic: true });
      logger.info(`用户 ${userId} 将搭配 ${id} 设置为公开`);
      return updatedOutfit;
    } catch (error) {
      logger.error(`设置搭配为公开失败:`, error);
      throw error;
    }
  }

  /**
   * 设置搭配为私有
   */
  async setOutfitPrivate(id: number, userId: number): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(id);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      // 设置搭配为私有
      const updatedOutfit = await outfitRepository.update(id, { isPublic: false });
      logger.info(`用户 ${userId} 将搭配 ${id} 设置为私有`);
      return updatedOutfit;
    } catch (error) {
      logger.error(`设置搭配为私有失败:`, error);
      throw error;
    }
  }

  /**
   * 为搭配评分
   */
  async rateOutfit(id: number, rating: number, userId: number): Promise<any> {
    try {
      // 验证评分范围
      if (rating < 1 || rating > 5) {
        throw new Error('评分必须在1-5之间');
      }

      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(id);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      // 更新评分
      const updatedOutfit = await outfitRepository.update(id, {
        rating,
        metadata: {
          ...outfit.metadata,
          ratingCount: (outfit.metadata?.ratingCount || 0) + 1,
          lastRatedAt: new Date()
        }
      });
      
      logger.info(`用户 ${userId} 为搭配 ${id} 评分: ${rating}`);
      return updatedOutfit;
    } catch (error) {
      logger.error(`为搭配评分失败:`, error);
      throw error;
    }
  }

  /**
   * 记录搭配使用
   */
  async recordOutfitUsage(id: number, userId: number): Promise<any> {
    try {
      // 验证搭配是否存在且属于用户
      const outfit = await outfitRepository.findById(id);
      if (!outfit || outfit.userId !== userId) {
        throw new Error('搭配不存在或无权限修改');
      }

      // 更新使用次数
      const updatedOutfit = await outfitRepository.update(id, {
        metadata: {
          ...outfit.metadata,
          usageCount: (outfit.metadata?.usageCount || 0) + 1,
          lastUsedAt: new Date()
        }
      });
      
      logger.info(`用户 ${userId} 使用了搭配 ${id}`);
      return updatedOutfit;
    } catch (error) {
      logger.error(`记录搭配使用失败:`, error);
      throw error;
    }
  }

  /**
   * 获取搭配统计信息
   */
  async getOutfitStats(userId: number): Promise<any> {
    try {
      // 获取各状态的搭配数量
      const statusCounts = await outfitRepository.countByStatus(userId);
      
      // 获取总搭配数
      const totalCount = Object.values(statusCounts).reduce((sum: number, count: number) => sum + count, 0);
      
      // 获取公开搭配数
      const publicOutfits = await outfitRepository.findByUserId(userId, { isPublic: true });
      const publicCount = publicOutfits.length;
      
      // 获取最近创建的搭配
      const recentOutfits = await outfitRepository.findByUserId(userId, {
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        limit: 5
      });
      
      return {
        totalCount,
        statusCounts,
        publicCount,
        recentOutfits
      };
    } catch (error) {
      logger.error(`获取搭配统计信息失败:`, error);
      throw error;
    }
  }
}