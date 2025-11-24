import { Table, Column, DataType, ForeignKey, BelongsTo, AllowNull, Default, Index } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { BaseModel } from '../base/BaseModel';
import { User } from './User';
import { Outfit } from './Outfit';
import { BehaviorType, BehaviorContext } from '../../types/model.types';

/**
 * 用户行为模型
 * 记录用户的各种行为数据，用于推荐算法和用户画像分析
 */
@Table({
  tableName: 'user_behaviors',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_behavior_user_id', fields: ['user_id'] },
    { name: 'idx_behavior_type', fields: ['behavior_type'] },
    { name: 'idx_behavior_entity', fields: ['entity_type', 'entity_id'] },
    { name: 'idx_behavior_timestamp', fields: ['user_id', 'created_at'] },
    { name: 'idx_behavior_context', fields: ['context'] },
    { name: 'idx_behavior_session', fields: ['session_id'] }
  ]
})
export class UserBehavior extends BaseModel<UserBehavior> {
  /**
   * 所属用户ID
   */
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id',
    comment: '所属用户ID'
  })
  userId!: number;

  /**
   * 行为类型
   */
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(BehaviorType)),
    field: 'behavior_type',
    comment: '行为类型'
  })
  behaviorType!: BehaviorType;

  /**
   * 实体类型（clothing_item, outfit, user, etc.）
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    field: 'entity_type',
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    comment: '实体类型'
  })
  entityType!: string;

  /**
   * 实体ID
   */
  @Column({
    type: DataType.INTEGER,
    field: 'entity_id',
    comment: '实体ID'
  })
  entityId?: number;

  /**
   * 行为上下文信息
   */
  @Column({
    type: DataType.JSON,
    comment: '行为上下文信息'
  })
  context?: BehaviorContext;

  /**
   * 行为强度（1-5，表示行为的重要程度）
   */
  @Default(1)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    comment: '行为强度（1-5）'
  })
  intensity!: number;

  /**
   * 会话ID（用于分析用户会话）
   */
  @Index
  @Column({
    type: DataType.STRING(100),
    field: 'session_id',
    validate: {
      len: [0, 100]
    },
    comment: '会话ID'
  })
  sessionId?: string;

  /**
   * 设备信息
   */
  @Column({
    type: DataType.JSON,
    field: 'device_info',
    comment: '设备信息'
  })
  deviceInfo?: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    appVersion?: string;
  };

  /**
   * 地理位置信息
   */
  @Column({
    type: DataType.JSON,
    field: 'location_info',
    comment: '地理位置信息'
  })
  locationInfo?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };

  /**
   * 天气信息
   */
  @Column({
    type: DataType.JSON,
    field: 'weather_info',
    comment: '天气信息'
  })
  weatherInfo?: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };

  /**
   * 推荐上下文（如果是推荐触发的行为）
   */
  @Column({
    type: DataType.JSON,
    field: 'recommendation_context',
    comment: '推荐上下文'
  })
  recommendationContext?: {
    algorithm: string;
    score: number;
    reason: string;
    source: string;
  };

  /**
   * 行为持续时间（毫秒）
   */
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0
    },
    field: 'duration_ms',
    comment: '行为持续时间（毫秒）'
  })
  durationMs!: number;

  /**
   * 元数据（扩展信息）
   */
  @Column({
    type: DataType.JSON,
    defaultValue: {},
    comment: '元数据（扩展信息）'
  })
  metadata?: any;

  // ==================== 关联关系 ====================

  /**
   * 所属用户
   */
  @BelongsTo(() => User)
  user?: User;

  // ==================== 实例方法 ====================

  /**
   * 获取行为记录的完整信息
   */
  async getFullInfo() {
    const user = await this.$get('user');

    return {
      id: this.id,
      userId: this.userId,
      behaviorType: this.behaviorType,
      entityType: this.entityType,
      entityId: this.entityId,
      context: this.context,
      intensity: this.intensity,
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
      locationInfo: this.locationInfo,
      weatherInfo: this.weatherInfo,
      recommendationContext: this.recommendationContext,
      durationMs: this.durationMs,
      user: user ? { id: user.id, username: user.username } : null,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 检查是否为推荐相关行为
   */
  isRecommendationRelated(): boolean {
    return !!this.recommendationContext;
  }

  /**
   * 获取行为的简要描述
   */
  getBehaviorSummary() {
    const entityDesc = this.entityId ? `${this.entityType}#${this.entityId}` : this.entityType;
    return `${this.userId} ${this.behaviorType} ${entityDesc}`;
  }

  // ==================== 静态方法 ====================

  /**
   * 记录用户行为
   */
  static async recordBehavior(
    userId: number,
    behaviorType: BehaviorType,
    entityType: string,
    entityId?: number,
    context?: BehaviorContext,
    options?: {
      intensity?: number;
      sessionId?: string;
      deviceInfo?: any;
      locationInfo?: any;
      weatherInfo?: any;
      recommendationContext?: any;
      durationMs?: number;
      metadata?: any;
    }
  ): Promise<UserBehavior> {
    return this.create({
      userId,
      behaviorType,
      entityType,
      entityId,
      context,
      intensity: options?.intensity || 1,
      sessionId: options?.sessionId,
      deviceInfo: options?.deviceInfo,
      locationInfo: options?.locationInfo,
      weatherInfo: options?.weatherInfo,
      recommendationContext: options?.recommendationContext,
      durationMs: options?.durationMs || 0,
      metadata: options?.metadata || {}
    } as any);
  }

  /**
   * 批量记录用户行为
   */
  static async recordBehaviors(behaviors: Array<{
    userId: number;
    behaviorType: BehaviorType;
    entityType: string;
    entityId?: number;
    context?: BehaviorContext;
    intensity?: number;
    sessionId?: string;
    deviceInfo?: any;
    locationInfo?: any;
    weatherInfo?: any;
    recommendationContext?: any;
    durationMs?: number;
    metadata?: any;
  }>): Promise<UserBehavior[]> {
    return this.bulkCreate(behaviors as any);
  }

  /**
   * 获取用户的行为统计
   */
  static async getUserBehaviorStats(userId: number, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await this.findAll({
      where: {
        userId,
        createdAt: { [(this.sequelize as any).Op.gte]: since }
      },
      attributes: [
        'behaviorType',
        [(this.sequelize as any)!.fn('COUNT', (this.sequelize as any)!.col('id')), 'count'],
        [(this.sequelize as any)!.fn('AVG', (this.sequelize as any)!.col('intensity')), 'avgIntensity'],
          [(this.sequelize as any)!.fn('AVG', (this.sequelize as any)!.col('duration_ms')), 'avgDuration']
      ],
      group: ['behaviorType'],
      raw: true
    });

    return stats.reduce((result, stat: any) => {
      result[stat.behaviorType] = {
        count: parseInt(stat.count),
        avgIntensity: parseFloat(stat.avgIntensity || 0),
        avgDuration: parseFloat(stat.avgDuration || 0)
      };
      return result;
    }, {} as Record<string, { count: number; avgIntensity: number; avgDuration: number }>);
  }

  /**
   * 获取用户的热门实体
   */
  static async getUserTopEntities(
    userId: number,
    entityType: string,
    behaviorType?: BehaviorType,
    limit: number = 10,
    days: number = 30
  ) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const where: any = {
      userId,
      entityType,
      entityId: { [(this.sequelize as any).Op.not]: null },
      createdAt: { [(this.sequelize as any).Op.gte]: since }
    };

    if (behaviorType) {
      where.behaviorType = behaviorType;
    }

    return this.findAll({
      where,
      attributes: [
        'entityId',
        [this.sequelize!.fn('COUNT', this.sequelize!.col('id')), 'interactionCount'],
        [this.sequelize!.fn('AVG', this.sequelize!.col('intensity')), 'avgIntensity'],
        [this.sequelize!.fn('MAX', this.sequelize!.col('created_at')), 'lastInteraction']
      ],
      group: ['entityId'],
      order: [[(this.sequelize as any)!.fn('COUNT', (this.sequelize as any)!.col('id')), 'DESC']],
      limit
    });
  }

  /**
   * 获取用户的会话行为
   */
  static async getUserSessionBehaviors(userId: number, sessionId: string) {
    return this.findAll({
      where: { userId, sessionId },
      order: [['createdAt', 'ASC']]
    });
  }

  /**
   * 获取用户的时间序列行为数据
   */
  static async getUserBehaviorTimeline(
    userId: number,
    startDate: Date,
    endDate: Date,
    behaviorType?: BehaviorType
  ) {
    const where: any = {
      userId,
      createdAt: {
          [(this.sequelize as any).Op.between]: [startDate, endDate]
        }
    };

    if (behaviorType) {
      where.behaviorType = behaviorType;
    }

    return this.findAll({
      where,
      order: [['createdAt', 'ASC']]
    });
  }

  /**
   * 获取推荐效果统计
   */
  static async getRecommendationStats(userId: number, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const totalRecommendations = await this.count({
      where: {
        userId,
        recommendationContext: { [(this.sequelize as any).Op.not]: null },
      createdAt: { [Op.gte]: since }
      }
    });

    const acceptedRecommendations = await this.count({
      where: {
        userId,
        behaviorType: 'click',
        recommendationContext: { [(this.sequelize as any).Op.not]: null },
        createdAt: { [(this.sequelize as any).Op.gte]: since }
      }
    });

    return {
      totalRecommendations,
      acceptedRecommendations,
      acceptanceRate: totalRecommendations > 0 ? Number(acceptedRecommendations) / Number(totalRecommendations) : 0
    };
  }

  /**
   * 清理旧的行为数据
   */
  static async cleanupOldBehaviors(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return this.destroy({
      where: {
        createdAt: { [(this.sequelize as any).Op.lt]: cutoffDate }
      }
    });
  }
}