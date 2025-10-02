import { UserBehavior } from '../models/entities/UserBehavior';
import { userBehaviorRepository } from '../repositories';
import { UserService } from './UserService';
import logger from '../utils/logger';
import { BehaviorType } from '../types/model.types';

// 用户行为查询选项接口
export interface UserBehaviorQueryOptions {
  userId?: number;
  behaviorTypes?: BehaviorType[];
  entityTypes?: string[];
  entityId?: number;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

// 用户行为创建数据接口
export interface UserBehaviorCreateData {
  userId: number;
  behaviorType: BehaviorType;
  entityType: string;
  entityId: number;
  metadata?: any;
}

// 用户行为更新数据接口
export interface UserBehaviorUpdateData {
  behaviorType?: BehaviorType;
  entityType?: string;
  entityId?: number;
  metadata?: any;
}

export class UserBehaviorService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * 记录用户行为
   */
  async create(data: UserBehaviorCreateData): Promise<UserBehavior> {
    try {
      // 验证用户是否存在
      const user = await this.userService.getById(data.userId);
      if (!user) {
        throw new Error(`用户ID ${data.userId} 不存在`);
      }

      const behaviorData: any = {
        userId: data.userId,
        behaviorType: data.behaviorType,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata || {}
      };

      const behavior = await userBehaviorRepository.recordBehavior(behaviorData);
      logger.info(`记录用户ID ${data.userId} 的行为: ${data.behaviorType} 成功`);
      return behavior;
    } catch (error) {
      logger.error(`记录用户行为失败:`, error);
      throw new Error(`记录用户行为失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取用户行为列表
   */
  async getAll(options: UserBehaviorQueryOptions = {}): Promise<UserBehavior[]> {
    try {
      const behaviors = await userBehaviorRepository.findAll(options);
      logger.info(`获取用户行为列表成功，共 ${behaviors.length} 条记录`);
      return behaviors;
    } catch (error) {
      logger.error(`获取用户行为列表失败:`, error);
      throw new Error(`获取用户行为列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据ID获取用户行为
   */
  async getById(id: number): Promise<UserBehavior | null> {
    try {
      const behavior = await userBehaviorRepository.findById(id);
      if (!behavior) {
        logger.warn(`未找到ID为 ${id} 的用户行为`);
        return null;
      }
      logger.info(`获取用户行为ID ${id} 成功`);
      return behavior;
    } catch (error) {
      logger.error(`获取用户行为ID ${id} 失败:`, error);
      throw new Error(`获取用户行为失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据用户ID获取用户行为列表
   */
  async getByUserId(userId: number, options: Omit<UserBehaviorQueryOptions, 'userId'> = {}): Promise<UserBehavior[]> {
    try {
      // 验证用户是否存在
      const user = await this.userService.getById(userId);
      if (!user) {
        throw new Error(`用户ID ${userId} 不存在`);
      }

      const behaviors = await userBehaviorRepository.findAll({ ...options, userId });
      logger.info(`获取用户ID ${userId} 的行为列表成功，共 ${behaviors.length} 条记录`);
      return behaviors;
    } catch (error) {
      logger.error(`获取用户ID ${userId} 的行为列表失败:`, error);
      throw new Error(`获取用户行为列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更新用户行为
   */
  async update(id: number, data: UserBehaviorUpdateData): Promise<UserBehavior | null> {
    try {
      // 先检查用户行为是否存在
      const existingBehavior = await this.getById(id);
      if (!existingBehavior) {
        throw new Error(`用户行为ID ${id} 不存在`);
      }

      const updateData: any = {};
      
      if (data.behaviorType !== undefined) updateData.behaviorType = data.behaviorType;
      if (data.entityType !== undefined) updateData.entityType = data.entityType;
      if (data.entityId !== undefined) updateData.entityId = data.entityId;
      if (data.metadata !== undefined) updateData.metadata = data.metadata;

      // 先查找行为，然后使用模型实例的update方法
      const behavior = await userBehaviorRepository.findById(id);
      if (!behavior) {
        throw new Error(`用户行为ID ${id} 不存在`);
      }
      
      const updatedBehavior = await behavior.update(updateData);
      logger.info(`更新用户行为ID ${id} 成功`);
      return updatedBehavior;
    } catch (error) {
      logger.error(`更新用户行为ID ${id} 失败:`, error);
      throw new Error(`更新用户行为失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 删除用户行为
   */
  async delete(id: number): Promise<boolean> {
    try {
      // 先检查用户行为是否存在
      const existingBehavior = await this.getById(id);
      if (!existingBehavior) {
        throw new Error(`用户行为ID ${id} 不存在`);
      }

      const result = await userBehaviorRepository.delete(id);
      logger.info(`删除用户行为ID ${id} 成功`);
      return result;
    } catch (error) {
      logger.error(`删除用户行为ID ${id} 失败:`, error);
      throw new Error(`删除用户行为失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取用户行为统计
   */
  async getStatistics(userId: number, options: { startDate?: Date; endDate?: Date } = {}): Promise<any> {
    try {
      // 验证用户是否存在
      const user = await this.userService.getById(userId);
      if (!user) {
        throw new Error(`用户ID ${userId} 不存在`);
      }

      const stats = await userBehaviorRepository.getUserBehaviorStats({ ...options, userId });
      logger.info(`获取用户ID ${userId} 的行为统计成功`);
      return stats;
    } catch (error) {
      logger.error(`获取用户行为统计失败:`, error);
      throw new Error(`获取用户行为统计失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 注意：删除了特定行为的记录方法，这些可以通过通用的create方法实现

  /**
   * 记录衣物查看行为
   */
  async recordViewClothing(userId: number, clothingId: number): Promise<UserBehavior> {
    return this.create({
      userId,
      behaviorType: BehaviorType.VIEW,
      entityType: 'clothing',
      entityId: clothingId
    });
  }

  /**
   * 记录衣物点赞行为
   */
  async recordLikeClothing(userId: number, clothingId: number, liked: boolean = true): Promise<UserBehavior> {
    return this.create({
      userId,
      behaviorType: BehaviorType.LIKE,
      entityType: 'clothing',
      entityId: clothingId,
      metadata: { liked }
    });
  }

  /**
   * 记录搭配创建行为
   */
  async recordCreateOutfit(userId: number, outfitId: number): Promise<UserBehavior> {
    return this.create({
      userId,
      behaviorType: BehaviorType.CREATE,
      entityType: 'outfit',
      entityId: outfitId
    });
  }
}