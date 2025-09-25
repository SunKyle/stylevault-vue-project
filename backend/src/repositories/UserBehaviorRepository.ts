import { User } from '../models/entities/User';
import { UserBehavior } from '../models/entities/UserBehavior';
import { BehaviorType } from '../types/model.types';

/**
 * 用户行为查询选项
 */
export interface UserBehaviorQueryOptions {
  /** 用户ID */
  userId?: number;
  /** 行为类型 */
  behaviorTypes?: BehaviorType[];
  /** 实体类型 */
  entityTypes?: string[];
  /** 实体ID */
  entityId?: number;
  /** 开始时间 */
  startDate?: Date;
  /** 结束时间 */
  endDate?: Date;
  /** 会话ID */
  sessionId?: string;
  /** 设备类型 */
  deviceType?: string;
  /** 操作系统 */
  operatingSystem?: string;
  /** 浏览器 */
  browser?: string;
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
 * 用户行为统计信息
 */
export interface UserBehaviorStats {
  /** 总行为数 */
  total: number;
  /** 按行为类型统计 */
  byBehaviorType: Record<string, number>;
  /** 按实体类型统计 */
  byEntityType: Record<string, number>;
  /** 按日期统计 */
  byDate: Record<string, number>;
  /** 平均每日行为数 */
  averagePerDay: number;
}

/**
 * 用户行为仓库类，封装用户行为数据的访问逻辑
 */
export class UserBehaviorRepository {
  /**
   * 查找所有用户行为
   * @param options 查询选项
   * @returns 用户行为列表
   */
async findAll(options: UserBehaviorQueryOptions = {}): Promise<UserBehavior[]> {
    const { 
      userId, 
      behaviorTypes, 
      entityTypes, 
      entityId, 
      startDate, 
      endDate, 
      sessionId, 
      deviceType, 
      operatingSystem, 
      browser, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC', 
      limit = 100, 
      offset = 0 
    } = options;
    
    const where: any = {};
    
    if (userId !== undefined) {
      where.userId = userId;
    }
    
    if (behaviorTypes && behaviorTypes.length > 0) {
      where.behaviorType = behaviorTypes;
    }
    
    if (entityTypes && entityTypes.length > 0) {
      where.entityType = entityTypes;
    }
    
    if (entityId !== undefined) {
      where.entityId = entityId;
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
    
    if (sessionId) {
      where.sessionId = sessionId;
    }
    
    if (deviceType) {
      where.deviceInfo = where.deviceInfo || {};
      where.deviceInfo.type = deviceType;
    }
    
    if (operatingSystem) {
      where.deviceInfo = where.deviceInfo || {};
      where.deviceInfo.os = operatingSystem;
    }
    
    if (browser) {
      where.deviceInfo = where.deviceInfo || {};
      where.deviceInfo.browser = browser;
    }
    
    return UserBehavior.findAll({
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
   * 根据ID查找用户行为
   * @param id 用户行为ID
   * @returns 用户行为对象或null
   */
async findById(id: number): Promise<UserBehavior | null> {
    return UserBehavior.findByPk(id, {
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
   * 记录用户行为
   * @param data 用户行为数据
   * @returns 创建的用户行为对象
   */
async recordBehavior(data: Partial<UserBehavior>): Promise<UserBehavior> {
    // 从BehaviorType枚举中获取正确的值
    const dataObj = data as any;
    return UserBehavior.create({
      ...dataObj,
      sessionId: dataObj.sessionId || this.generateSessionId(),
      deviceInfo: dataObj.deviceInfo || {
        type: 'unknown',
        os: 'unknown',
        browser: 'unknown'
      }
    });
  }

  /**
   * 获取用户行为统计
   * @param options 查询选项
   * @returns 用户行为统计信息
   */
async getUserBehaviorStats(options: UserBehaviorQueryOptions): Promise<UserBehaviorStats> {
    const behaviors = await this.findAll(options);
    const total = behaviors.length;
    
    // 按行为类型统计
    const byBehaviorType: Record<string, number> = {};
    // 按实体类型统计
    const byEntityType: Record<string, number> = {};
    // 按日期统计
    const byDate: Record<string, number> = {};
    
    behaviors.forEach(behavior => {
      // 统计行为类型
      byBehaviorType[behavior.behaviorType] = 
        (byBehaviorType[behavior.behaviorType] || 0) + 1;
      
      // 统计实体类型
      if (behavior.entityType) {
        byEntityType[behavior.entityType] = 
          (byEntityType[behavior.entityType] || 0) + 1;
      }
      
      // 统计日期
      const dateKey = behavior.createdAt.toISOString().split('T')[0];
      byDate[dateKey] = (byDate[dateKey] || 0) + 1;
    });
    
    // 计算平均每日行为数
    const uniqueDates = Object.keys(byDate).length;
    const averagePerDay = uniqueDates > 0 ? total / uniqueDates : 0;
    
    return {
      total,
      byBehaviorType,
      byEntityType,
      byDate,
      averagePerDay
    };
  }

  /**
   * 获取用户最近的行为
   * @param userId 用户ID
   * @param limit 限制数量
   * @returns 用户最近行为列表
   */
async getRecentUserBehaviors(userId: number, limit: number = 50): Promise<UserBehavior[]> {
    return this.findAll({
      userId,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
  }

  /**
   * 获取用户在特定实体上的行为
   * @param userId 用户ID
   * @param entityType 实体类型
   * @param entityId 实体ID
   * @returns 行为列表
   */
async getUserEntityBehaviors(
    userId: number,
    entityType: string,
    entityId: number
  ): Promise<UserBehavior[]> {
    return this.findAll({
      userId,
      entityTypes: [entityType],
      entityId
    });
  }

  /**
   * 检查行为是否与推荐相关
   * @param behaviorId 行为ID
   * @returns 是否与推荐相关
   */
async isRecommendationRelated(behaviorId: number): Promise<boolean> {
    const behavior = await this.findById(behaviorId);
    if (!behavior) {
      return false;
    }
    
    // 使用模型自带的方法检查是否与推荐相关
    return behavior.isRecommendationRelated();
  }

  /**
   * 获取特定会话的所有行为
   * @param sessionId 会话ID
   * @returns 行为列表
   */
async getSessionBehaviors(sessionId: string): Promise<UserBehavior[]> {
    return this.findAll({
      sessionId,
      sortBy: 'createdAt',
      sortOrder: 'ASC'
    });
  }

  /**
   * 删除用户行为
   * @param id 用户行为ID
   * @returns 是否删除成功
   */
async delete(id: number): Promise<boolean> {
    const result = await UserBehavior.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 批量删除用户行为
   * @param ids 用户行为ID列表
   * @returns 删除的数量
   */
async deleteBatch(ids: number[]): Promise<number> {
    return UserBehavior.destroy({
      where: {
        id: ids
      }
    });
  }

  /**
   * 删除指定日期之前的用户行为数据
   * @param beforeDate 截止日期
   * @returns 删除的数量
   */
async deleteBeforeDate(beforeDate: Date): Promise<number> {
    return UserBehavior.destroy({
      where: {
        createdAt: {
          '$lte': beforeDate
        }
      }
    });
  }

  /**
   * 获取用户行为的完整信息
   * @param id 用户行为ID
   * @returns 完整的行为信息
   */
async getFullInfo(id: number): Promise<UserBehavior | null> {
    const behavior = await this.findById(id);
    if (!behavior) {
      return null;
    }
    
    return behavior;
  }

  /**
   * 生成会话ID
   * @private
   * @returns 会话ID字符串
   */
private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取推荐相关的用户行为
   * @param userId 用户ID
   * @param limit 限制数量
   * @returns 推荐相关的行为列表
   */
async getRecommendationRelatedBehaviors(
    userId: number,
    limit: number = 100
  ): Promise<UserBehavior[]> {
    const behaviors = await this.findAll({
      userId,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
    
    // 使用模型自带的方法过滤推荐相关行为
    return behaviors.filter(behavior => behavior.isRecommendationRelated());
  }

  /**
   * 获取用户行为热力图数据
   * @param userId 用户ID
   * @param days 天数范围
   * @returns 按小时统计的行为数据
   */
async getUserBehaviorHeatmap(
    userId: number,
    days: number = 7
  ): Promise<Record<string, Record<string, number>>> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const behaviors = await this.findAll({
      userId,
      startDate,
      endDate
    });
    
    const heatmapData: Record<string, Record<string, number>> = {};
    
    behaviors.forEach(behavior => {
      const date = behavior.createdAt.toISOString().split('T')[0];
      const hour = behavior.createdAt.getHours().toString().padStart(2, '0');
      
      if (!heatmapData[date]) {
        heatmapData[date] = {};
      }
      
      heatmapData[date][hour] = (heatmapData[date][hour] || 0) + 1;
    });
    
    return heatmapData;
  }
}