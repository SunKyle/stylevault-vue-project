import { Recommendations } from '../models/entities/Recommendations';
import { User } from '../models/entities/User';
import { RecommendationType } from '../types/model.types';

/**
 * 推荐查询选项
 */
export interface RecommendationsQueryOptions {
  /** 用户ID */
  userId?: number;
  /** 推荐类型 */
  types?: string[];
  /** 实体类型 */
  entityTypes?: string[];
  /** 实体ID */
  entityId?: number;
  /** 是否已查看 */
  isViewed?: boolean;
  /** 是否已点击 */
  isClicked?: boolean;
  /** 最小分数 */
  minScore?: number;
  /** 最大分数 */
  maxScore?: number;
  /** 开始时间 */
  startDate?: Date;
  /** 结束时间 */
  endDate?: Date;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
  /** 限制数量 */
  limit?: number;
  /** 偏移量 */
  offset?: number;
}

/**
 * 推荐统计信息
 */
export interface RecommendationsStats {
  /** 总推荐数 */
  total: number;
  /** 已查看数 */
  viewed: number;
  /** 已点击数 */
  clicked: number;
  /** 平均分数 */
  averageScore: number;
  /** 按类型统计 */
  byType: Record<string, number>;
  /** 按实体类型统计 */
  byEntityType: Record<string, number>;
}

/**
 * 推荐生成选项
 */
export interface GenerateRecommendationsOptions {
  /** 用户ID */
  userId: number;
  /** 推荐类型 */
  type: RecommendationType;
  /** 实体类型 */
  entityType: string;
  /** 生成数量 */
  count: number;
  /** 最小分数 */
  minScore?: number;
  /** 推荐理由 */
  reasons?: Record<string, string>[];
}

/**
 * 推荐仓库类，封装推荐数据的访问逻辑
 */
export class RecommendationsRepository {
  /**
   * 查找所有推荐
   * @param options 查询选项
   * @returns 推荐列表
   */
  async findAll(options: RecommendationsQueryOptions = {}): Promise<Recommendations[]> {
    const { 
      userId, 
      types, 
      entityTypes, 
      entityId, 
      isViewed, 
      isClicked, 
      minScore, 
      maxScore, 
      startDate, 
      endDate, 
      sortBy = 'score', 
      sortOrder = 'DESC', 
      limit = 100, 
      offset = 0 
    } = options;
    
    const where: any = {};
    
    if (userId !== undefined) {
      where.userId = userId;
    }
    
    if (types && types.length > 0) {
      where.type = types;
    }
    
    if (entityTypes && entityTypes.length > 0) {
      where.entityType = entityTypes;
    }
    
    if (entityId !== undefined) {
      where.entityId = entityId;
    }
    
    if (isViewed !== undefined) {
      where.isViewed = isViewed;
    }
    
    if (isClicked !== undefined) {
      where.isClicked = isClicked;
    }
    
    if (minScore !== undefined) {
      where.score = where.score || {};
      where.score['$gte'] = minScore;
    }
    
    if (maxScore !== undefined) {
      where.score = where.score || {};
      where.score['$lte'] = maxScore;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt['$gte'] = startDate;
      }
      if (endDate) {
        where.createdAt['$lte'] = endDate;
      }
    }
    
    return Recommendations.findAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });
  }

  /**
   * 根据ID查找推荐
   * @param id 推荐ID
   * @returns 推荐对象或null
   */
  async findById(id: number): Promise<Recommendations | null> {
    return Recommendations.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });
  }

  /**
   * 获取用户推荐
   * @param userId 用户ID
   * @param options 查询选项
   * @returns 推荐列表
   */
  async getUserRecommendations(
    userId: number,
    options: Omit<RecommendationsQueryOptions, 'userId'> = {}
  ): Promise<Recommendations[]> {
    return this.findAll({
      userId,
      ...options
    });
  }

  /**
   * 创建推荐
   * @param data 推荐数据
   * @returns 创建的推荐对象
   */
  async create(data: Partial<Recommendations>): Promise<Recommendations> {
    return Recommendations.create(data as any);
  }

  /**
   * 批量创建推荐
   * @param recommendations 推荐数据数组
   * @returns 创建的推荐对象数组
   */
  async createBatch(recommendations: Partial<Recommendations>[]): Promise<Recommendations[]> {
    return Recommendations.bulkCreate(recommendations as any);
  }

  /**
   * 更新推荐
   * @param id 推荐ID
   * @param data 更新数据
   * @returns 更新后的推荐对象或null
   */
  async update(id: number, data: Partial<Recommendations>): Promise<Recommendations | null> {
    const recommendation = await this.findById(id);
    if (!recommendation) {
      return null;
    }
    
    return recommendation.update(data as any);
  }

  /**
   * 删除推荐
   * @param id 推荐ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const result = await Recommendations.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 批量删除推荐
   * @param ids 推荐ID列表
   * @returns 删除的数量
   */
  async deleteBatch(ids: number[]): Promise<number> {
    return Recommendations.destroy({
      where: {
        id: ids
      }
    });
  }

  /**
   * 删除用户的所有推荐
   * @param userId 用户ID
   * @returns 删除的数量
   */
  async deleteByUserId(userId: number): Promise<number> {
    return Recommendations.destroy({
      where: { userId }
    });
  }

  /**
   * 将推荐标记为已查看
   * @param id 推荐ID
   * @returns 更新后的推荐对象或null
   */
  async markAsViewed(id: number): Promise<Recommendations | null> {
    return this.update(id, {
      viewCount: 1,
      updatedAt: new Date()
    });
  }

  /**
   * 将推荐标记为已点击
   * @param id 推荐ID
   * @returns 更新后的推荐对象或null
   */
  async markAsClicked(id: number): Promise<Recommendations | null> {
    return this.update(id, {
      clickCount: 1,
      updatedAt: new Date()
    });
  }

  /**
   * 获取推荐的完整信息
   * @param id 推荐ID
   * @returns 完整的推荐信息
   */
  async getFullInfo(id: number): Promise<any> {
    const recommendation = await this.findById(id);
    if (!recommendation) {
      return null;
    }
    
    return recommendation.getFullInfo();
  }

  /**
   * 生成推荐
   * @param options 生成选项
   * @returns 生成的推荐对象数组
   */
  async generateRecommendations(options: GenerateRecommendationsOptions): Promise<Recommendations[]> {
    const { userId, type, entityType, count, minScore = 0.5, reasons = [] } = options;
    
    // 这里应该实现实际的推荐生成算法
    // 为了演示，我们生成一些模拟数据
    const recommendations: Partial<Recommendations>[] = [];
    
    for (let i = 0; i < count; i++) {
      // 模拟实体ID
      const mockEntityId = Math.floor(Math.random() * 1000) + 1;
      // 生成分数
      const score = minScore + Math.random() * (1 - minScore);
      
      // 选择一个推荐理由
      const reason = reasons.length > 0 
        ? reasons[Math.floor(Math.random() * reasons.length)]
        : { type: 'personalized', text: '基于您的偏好生成' };
      
      recommendations.push({
        userId,
        type,
        entityType,
        entityId: mockEntityId,
        score,
        reasons: [reason as any],
        viewCount: 0,
        clickCount: 0
      });
    }
    
    return this.createBatch(recommendations);
  }

  /**
   * 获取推荐统计信息
   * @param options 查询选项
   * @returns 推荐统计信息
   */
  async getRecommendationsStats(options: RecommendationsQueryOptions = {}): Promise<RecommendationsStats> {
    const recommendations = await this.findAll(options);
    const total = recommendations.length;
    
    // 统计已查看和已点击的推荐
    const viewed = recommendations.filter(r => r.viewCount && r.viewCount > 0).length;
    const clicked = recommendations.filter(r => r.clickCount && r.clickCount > 0).length;
    
    // 计算平均分数
    const totalScore = recommendations.reduce((sum, r) => sum + (r.score || 0), 0);
    const averageScore = total > 0 ? totalScore / total : 0;
    
    // 按类型统计
    const byType: Record<string, number> = {};
    // 按实体类型统计
    const byEntityType: Record<string, number> = {};
    
    recommendations.forEach(recommendation => {
      // 统计推荐类型
      byType[recommendation.type] = 
        (byType[recommendation.type] || 0) + 1;
      
      // 统计实体类型
      if (recommendation.entityType) {
        byEntityType[recommendation.entityType] = 
          (byEntityType[recommendation.entityType] || 0) + 1;
      }
    });
    
    return {
      total,
      viewed,
      clicked,
      averageScore,
      byType,
      byEntityType
    };
  }

  /**
   * 获取推荐点击转化率
   * @param userId 用户ID（可选）
   * @param type 推荐类型（可选）
   * @returns 转化率
   */
  async getConversionRate(userId?: number, type?: string): Promise<number> {
    const options: RecommendationsQueryOptions = {};
    if (userId !== undefined) {
      options.userId = userId;
    }
    if (type) {
      options.types = [type];
    }
    
    const stats = await this.getRecommendationsStats(options);
    
    // 点击转化率 = 点击数 / 查看数
    if (stats.viewed === 0) {
      return 0;
    }
    
    return stats.clicked / stats.viewed;
  }

  /**
   * 获取热门推荐实体
   * @param entityType 实体类型
   * @param limit 限制数量
   * @returns 热门实体ID和推荐次数
   */
  async getPopularEntities(entityType: string, limit: number = 10): Promise<{
    entityId: number;
    count: number;
    averageScore: number;
  }[]> {
    const recommendations = await this.findAll({
      entityTypes: [entityType],
      sortBy: 'score',
      sortOrder: 'DESC'
    });
    
    // 按实体ID分组
    const entityStats: Record<string, {
      count: number;
      totalScore: number;
    }> = {};
    
    recommendations.forEach(recommendation => {
      const entityId = recommendation.entityId;
      if (entityId !== undefined) {
        const entityIdStr = entityId.toString();
        if (!entityStats[entityIdStr]) {
          entityStats[entityIdStr] = { count: 0, totalScore: 0 };
        }
        entityStats[entityIdStr].count++;
        entityStats[entityIdStr].totalScore += recommendation.score || 0;
      }
    });
    
    // 转换为数组并排序
    const result = Object.entries(entityStats)
      .map(([entityId, stats]) => ({
        entityId: parseInt(entityId),
        count: stats.count,
        averageScore: stats.totalScore / stats.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return result;
  }
}