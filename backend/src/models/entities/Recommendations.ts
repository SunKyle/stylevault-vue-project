import { Table, Column, DataType, ForeignKey, BelongsTo, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { User } from './User';
import { ClothingItem } from './ClothingItem';
import { Outfit } from './Outfit';
import { RecommendationType, RecommendationStatus, RecommendationContext } from '../../types/model.types';

/**
 * 推荐模型
 * 存储系统生成的推荐内容，包括搭配推荐、购买建议等
 */
@Table({
  tableName: 'recommendations',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_rec_user_id', fields: ['user_id'] },
    { name: 'idx_rec_type', fields: ['type'] },
    { name: 'idx_rec_status', fields: ['status'] },
    { name: 'idx_rec_entity', fields: ['entity_type', 'entity_id'] },
    { name: 'idx_rec_score', fields: ['score'] },
    { name: 'idx_rec_created', fields: ['created_at'] },
    { name: 'idx_rec_context', fields: ['context'] }
  ]
})
export class Recommendations extends BaseModel<Recommendations> {
  /**
   * 所属用户ID
   */
  @ForeignKey(() => User)
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'user_id',
    comment: '所属用户ID'
  })
  userId!: number;

  /**
   * 推荐类型
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(RecommendationType)),
    comment: '推荐类型'
  })
  type!: RecommendationType;

  /**
   * 推荐实体类型（clothing_item, outfit, etc.）
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(50),
    field: 'entity_type',
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    comment: '推荐实体类型'
  })
  entityType!: string;

  /**
   * 推荐实体ID
   */
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'entity_id',
    comment: '推荐实体ID'
  })
  entityId?: number;

  /**
   * 推荐标题
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    validate: {
      len: [1, 200],
      notEmpty: true
    },
    comment: '推荐标题'
  })
  title!: string;

  /**
   * 推荐描述
   */
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 1000]
    },
    comment: '推荐描述'
  })
  description?: string;

  /**
   * 推荐理由
   */
  @Column({
    type: DataType.JSON,
    field: 'reasons',
    defaultValue: [],
    comment: '推荐理由'
  })
  reasons?: Array<{
    factor: string;
    weight: number;
    description: string;
  }>;

  /**
   * 推荐评分（0-1之间）
   */
  @AllowNull(false)
  @Default(0)
  @Index
  @Column({
    type: DataType.DECIMAL(3, 2),
    validate: {
      min: 0,
      max: 1
    },
    comment: '推荐评分（0-1之间）'
  })
  score!: number;

  /**
   * 推荐状态
   */
  @Default('pending')
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(RecommendationStatus)),
    comment: '推荐状态'
  })
  status!: RecommendationStatus;

  /**
   * 推荐上下文信息
   */
  @Column({
    type: DataType.JSON,
    field: 'context',
    comment: '推荐上下文信息'
  })
  context?: RecommendationContext;

  /**
   * 推荐算法信息
   */
  @Column({
    type: DataType.JSON,
    field: 'algorithm_info',
    comment: '推荐算法信息'
  })
  algorithmInfo?: {
    name: string;
    version: string;
    parameters: any;
    executionTime: number;
  };

  /**
   * 用户反馈
   */
  @Column({
    type: DataType.JSON,
    field: 'user_feedback',
    comment: '用户反馈'
  })
  userFeedback?: {
    rating?: number;
    liked?: boolean;
    clicked?: boolean;
    purchased?: boolean;
    comments?: string;
    feedbackAt?: Date;
  };

  /**
   * 展示次数
   */
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    field: 'view_count',
    validate: {
      min: 0
    },
    comment: '展示次数'
  })
  viewCount!: number;

  /**
   * 点击次数
   */
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    field: 'click_count',
    validate: {
      min: 0
    },
    comment: '点击次数'
  })
  clickCount!: number;

  /**
   * 过期时间
   */
  @Column({
    type: DataType.DATE,
    field: 'expires_at',
    comment: '过期时间'
  })
  expiresAt?: Date;

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
  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'user'
  })
  user!: User;

  // ==================== 实例方法 ====================

  /**
   * 获取推荐信息的完整详情
   */
  async getFullInfo() {
    const user = await this.$get('user');

    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      entityType: this.entityType,
      entityId: this.entityId,
      title: this.title,
      description: this.description,
      reasons: this.reasons,
      score: this.score,
      status: this.status,
      context: this.context,
      algorithmInfo: this.algorithmInfo,
      userFeedback: this.userFeedback,
      viewCount: this.viewCount,
      clickCount: this.clickCount,
      expiresAt: this.expiresAt,
      user: user ? { id: user.id, username: user.username } : null,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 计算点击率
   */
  getClickThroughRate(): number {
    return this.viewCount > 0 ? this.clickCount / this.viewCount : 0;
  }

  /**
   * 检查是否已过期
   */
  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  /**
   * 标记为已查看
   */
  async markAsViewed() {
    this.viewCount += 1;
    await this.save();
  }

  /**
   * 标记为已点击
   */
  async markAsClicked() {
    this.clickCount += 1;
    await this.save();
  }

  /**
   * 更新用户反馈
   */
  async updateUserFeedback(feedback: {
    rating?: number;
    liked?: boolean;
    clicked?: boolean;
    purchased?: boolean;
    comments?: string;
  }) {
    this.userFeedback = {
      ...this.userFeedback,
      ...feedback,
      feedbackAt: new Date()
    };
    await this.save();
  }

  /**
   * 更新推荐状态
   */
  async updateStatus(status: RecommendationStatus) {
    this.status = status;
    await this.save();
  }

  // ==================== 静态方法 ====================

  /**
   * 为用户生成推荐
   */
  static async generateRecommendations(
    userId: number,
    type: RecommendationType,
    recommendations: Array<{
      entityType: string;
      entityId?: number;
      title: string;
      description?: string;
      reasons?: Array<{
        factor: string;
        weight: number;
        description: string;
      }>;
      score: number;
      context?: RecommendationContext;
      algorithmInfo?: {
        name: string;
        version: string;
        parameters: any;
        executionTime: number;
      };
      expiresAt?: Date;
    }>
  ): Promise<Recommendations[]> {
    const now = new Date();
    const defaultExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7天后过期

    const data = recommendations.map(rec => ({
      userId,
      type,
      entityType: rec.entityType,
      entityId: rec.entityId,
      title: rec.title,
      description: rec.description,
      reasons: rec.reasons || [],
      score: rec.score,
      context: rec.context,
      algorithmInfo: rec.algorithmInfo,
      expiresAt: rec.expiresAt || defaultExpiresAt,
      metadata: rec
    }));

    return this.bulkCreate(data as any, {
      ignoreDuplicates: true
    });
  }

  /**
   * 获取用户的推荐列表
   */
  static async getUserRecommendations(
    userId: number,
    type?: RecommendationType,
    status?: RecommendationStatus,
    limit: number = 20
  ) {
    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    } else {
      where.status = { [(this.sequelize as any).Op.in]: ['pending', 'accepted'] };
    }

    return this.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['score', 'DESC'], ['createdAt', 'DESC']],
      limit
    });
  }

  /**
   * 获取热门推荐
   */
  static async getPopularRecommendations(type: RecommendationType, limit: number = 10) {
    return this.findAll({
      where: {
        type,
        status: 'accepted',
        clickCount: { [(this.sequelize as any).Op.gt]: 0 }
      },
      order: [
        [(this.sequelize as any).literal('click_count / NULLIF(view_count, 0)'), 'DESC'],
        ['clickCount', 'DESC']
      ],
      limit
    });
  }

  /**
   * 获取推荐统计
   */
  static async getRecommendationStats(userId: number, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await this.findAll({
      where: {
        userId,
        createdAt: { [(this.sequelize as any).Op.gte]: since }
      },
      attributes: [
        'type',
        'status',
        [(this.sequelize as any).fn('COUNT', (this.sequelize as any).col('id')), 'count'],
        [(this.sequelize as any).fn('AVG', (this.sequelize as any).col('score')), 'avgScore'],
        [(this.sequelize as any).fn('SUM', (this.sequelize as any).col('view_count')), 'totalViews'],
        [(this.sequelize as any).fn('SUM', (this.sequelize as any).col('click_count')), 'totalClicks']
      ],
      group: ['type', 'status']
    });

    return stats.map(stat => ({
      type: stat.type,
      status: stat.status,
      count: parseInt(stat.get('count') as string),
      avgScore: parseFloat(stat.get('avgScore') as string),
      totalViews: parseInt(stat.get('totalViews') as string),
      totalClicks: parseInt(stat.get('totalClicks') as string),
      clickThroughRate: parseInt(stat.get('totalViews') as string) > 0 
        ? parseInt(stat.get('totalClicks') as string) / parseInt(stat.get('totalViews') as string)
        : 0
    }));
  }

  /**
   * 清理过期推荐
   */
  static async cleanupExpiredRecommendations(): Promise<number> {
    return this.destroy({
      where: {
        expiresAt: { [(this.sequelize as any).Op.lt]: new Date() }
      }
    });
  }

  /**
   * 根据实体获取推荐
   */
  static async getRecommendationsByEntity(entityType: string, entityId: number) {
    return this.findAll({
      where: { entityType, entityId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['score', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  /**
   * 更新推荐反馈
   */
  static async updateRecommendationsFeedback(
    userId: number,
    recommendationIds: number[],
    feedback: {
      rating?: number;
      liked?: boolean;
      clicked?: boolean;
      purchased?: boolean;
      comments?: string;
    }
  ): Promise<[number, Recommendations[]]> {
    return this.update(
      { userFeedback: feedback },
      {
        where: {
          userId,
          id: recommendationIds
        },
        returning: true
      }
    );
  }
}