import { User } from '../models/entities/User';
import { OutfitClothing } from '../models/entities/OutfitClothing';
import { Outfit } from '../models/entities/Outfit';
import { Clothing } from '../models/entities/Clothing';
import { Op } from 'sequelize';

/**
 * 搭配查询选项
 */
export interface OutfitQueryOptions {
  /** 用户ID */
  userId?: number;
  /** 搭配ID */
  id?: number;
  /** 状态 */
  status?: string;
  /** 季节 */
  season?: string;
  /** 场合 */
  occasion?: string;
  /** 风格 */
  style?: string;
  /** 是否公开 */
  isPublic?: boolean;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
  /** 限制数量 */
  limit?: number;
  /** 偏移量 */
  offset?: number;
  /** 是否包含衣物信息 */
  includeClothes?: boolean;
  /** 是否包含用户信息 */
  includeUser?: boolean;
}

/**
 * 搭配统计数据
 */
export interface OutfitStats {
  total: number;
  byStatus: Record<string, number>;
  topRated: number;
  publicCount: number;
}

/**
 * 搭配仓库类，封装搭配数据的访问逻辑
 */
export class OutfitRepository {
  /**
   * 查找所有搭配
   * @param options 查询选项
   * @returns 搭配列表
   */
  async findAll(options: OutfitQueryOptions = {}): Promise<Outfit[]> {
    const { 
      userId,
      status,
      season,
      occasion,
      style,
      isPublic,
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      limit = 100,
      offset = 0,
      includeClothes = false,
      includeUser = false
    } = options;
    
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (season) {
      where.season = season;
    }
    
    if (occasion) {
      where.occasion = occasion;
    }
    
    if (style) {
      where.style = style;
    }
    
    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }
    
    const findOptions: any = {
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset
    };
    
    const includes: any[] = [];
    
    // 包含用户信息
    if (includeUser) {
      includes.push({
        model: require('../models/entities/User').User,
        as: 'user',
        attributes: ['id', 'username', 'avatarUrl']
      });
    }
    
    // 包含衣物信息
    if (includeClothes) {
      includes.push({
        model: Clothing,
        as: 'clothes',
        through: {
          attributes: ['orderIndex', 'role']
        },
        attributes: ['id', 'name', 'category', 'imageUrl']
      });
    }
    
    if (includes.length > 0) {
      findOptions.include = includes;
    }
    
    return Outfit.findAll(findOptions);
  }

  /**
   * 根据ID查找搭配
   * @param id 搭配ID
   * @param options 查询选项
   * @returns 搭配对象或null
   */
  async findById(id: number, options: { includeClothes?: boolean, includeUser?: boolean } = {}): Promise<Outfit | null> {
    const { includeClothes = false, includeUser = false } = options;
    
    const includes: any[] = [];
    
    if (includeUser) {
      includes.push({
        model: require('../models/entities/User').User,
        as: 'user',
        attributes: ['id', 'username', 'avatarUrl']
      });
    }
    
    if (includeClothes) {
      includes.push({
        model: Clothing,
        as: 'clothes',
        through: {
          attributes: ['orderIndex', 'role']
        },
        attributes: ['id', 'name', 'category', 'imageUrl']
      });
    }
    
    return Outfit.findByPk(id, {
      include: includes
    });
  }

  /**
   * 根据用户ID查找搭配
   * @param userId 用户ID
   * @param options 查询选项
   * @returns 搭配列表
   */
  async findByUserId(userId: number, options: OutfitQueryOptions = {}): Promise<Outfit[]> {
    return this.findAll({...options, userId});
  }

  /**
   * 统计各状态的搭配数量
   * @param userId 用户ID
   * @returns 各状态的搭配数量
   */
  async countByStatus(userId: number): Promise<Record<string, number>> {
    return Outfit.countByStatus(userId);
  }

  /**
   * 获取搭配的完整信息
   * @param id 搭配ID
   * @returns 搭配完整信息
   */
  async getFullInfo(id: number): Promise<any> {
    const outfit = await this.findById(id, { includeClothes: true, includeUser: true });
    if (!outfit) {
      return null;
    }
    
    return outfit.getFullInfo();
  }

  /**
   * 计算搭配总价
   * @param outfitId 搭配ID
   * @returns 总价
   */
  async calculateTotalPrice(outfitId: number): Promise<number> {
    const outfit = await this.findById(outfitId, { includeClothes: true });
    if (!outfit) {
      return 0;
    }
    
    return outfit.calculateTotalPrice();
  }

  /**
   * 发布搭配
   * @param id 搭配ID
   * @returns 是否发布成功
   */
  async publishOutfit(id: number): Promise<boolean> {
    const outfit = await this.findById(id);
    if (!outfit) {
      return false;
    }
    
    try {
      await outfit.publish();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取热门搭配
   * @param userId 用户ID
   * @param limit 限制数量
   * @returns 热门搭配列表
   */
  async getPopularOutfits(userId: number, limit: number = 5): Promise<Outfit[]> {
    return Outfit.findAll({
      where: {
        userId,
        status: 'published',
        rating: { [Op.gte]: 4 }
      },
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
      limit
    });
  }

  /**
   * 增加搭配浏览次数
   * @param id 搭配ID
   * @returns 是否更新成功
   */
  async incrementViewCount(id: number): Promise<boolean> {
    const outfit = await this.findById(id);
    if (!outfit) {
      return false;
    }
    
    // 更新metadata中的浏览统计
    outfit.metadata = {
      ...outfit.metadata,
      viewCount: (outfit.metadata?.viewCount || 0) + 1
    };
    
    await outfit.save();
    return true;
  }
  
  /**
   * 创建搭配
   * @param data 搭配数据
   * @returns 创建的搭配
   */
  async create(data: any): Promise<Outfit> {
    return Outfit.create(data);
  }
  
  /**
   * 更新搭配
   * @param id 搭配ID
   * @param data 搭配数据
   * @returns 更新的搭配
   */
  async update(id: number, data: Partial<Outfit>): Promise<Outfit | null> {
    const outfit = await this.findById(id);
    if (!outfit) {
      return null;
    }
    
    return outfit.update(data);
  }
  
  /**
   * 删除搭配
   * @param id 搭配ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const result = await Outfit.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 获取搭配统计信息
   * @param userId 用户ID
   * @returns 搭配统计信息
   */
  async getStats(userId: number): Promise<OutfitStats> {
    const [total, byStatus, topRated, publicCount] = await Promise.all([
      Outfit.count({ where: { userId } }),
      this.countByStatus(userId),
      Outfit.count({ where: { userId, rating: { [Op.gte]: 4 } } }),
      Outfit.count({ where: { userId, isPublic: true } })
    ]);
    
    return {
      total,
      byStatus,
      topRated,
      publicCount
    };
  }
}