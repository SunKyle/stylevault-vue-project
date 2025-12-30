import { Table, Column, DataType, ForeignKey, BelongsTo, BelongsToMany, HasMany, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { User } from './User';
import { Clothing } from './Clothing';
import { OutfitClothing } from './OutfitClothing';
import { Attribute } from './Attribute';
import { OutfitMetadata } from '../../types/model.types';

/**
 * 搭配模型
 * 存储用户的服装搭配方案，包括季节、场合、风格等信息
 */
@Table({
  tableName: 'outfits',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_outfit_user_id', fields: ['user_id'] },
    { name: 'idx_outfits_user_season', fields: ['user_id', 'season'] },
    { name: 'idx_outfits_user_occasion', fields: ['user_id', 'occasion'] },
    { name: 'idx_outfit_style', fields: ['style', 'user_id'] },
    { name: 'idx_outfit_public', fields: ['is_public', 'user_id'] },
    { name: 'idx_outfit_status', fields: ['status', 'user_id'] },
    { name: 'idx_outfit_rating', fields: ['rating', 'user_id'] },
    { name: 'idx_outfit_created', fields: ['created_at', 'user_id'] }
  ]
})
export class Outfit extends BaseModel<Outfit> {
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
   * 搭配名称
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [1, 100],
      notEmpty: true
    },
    comment: '搭配名称'
  })
  name!: string;

  /**
   * 搭配描述
   */
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 1000]
    },
    comment: '搭配描述'
  })
  description?: string;

  /**
   * 季节ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Index
  @Column({
    type: DataType.INTEGER,
    comment: '季节ID（关联attributes表）'
  })
  season?: number;

  /**
   * 场合ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Index
  @Column({
    type: DataType.INTEGER,
    comment: '场合ID（关联attributes表）'
  })
  occasion?: number;

  /**
   * 主要风格ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Index
  @Column({
    type: DataType.INTEGER,
    comment: '主要风格ID（关联attributes表）'
  })
  style?: number;

  /**
   * 封面图片URL
   */
  @Column({
    type: DataType.STRING(255),
    field: 'cover_image_url',
    validate: {
      len: [0, 255],
      isUrl: true
    },
    comment: '封面图片URL'
  })
  coverImageUrl?: string;

  /**
   * 图片URL数组
   */
  @Column({
    type: DataType.JSON,
    field: 'image_urls',
    defaultValue: [],
    comment: '图片URL数组'
  })
  imageUrls?: string[];

  /**
   * 评分（1-5星）
   */
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    comment: '评分（1-5星）'
  })
  rating?: number;

  /**
   * 状态（draft, published, archived）
   */
  @Default('draft')
  @Index
  @Column({
    type: DataType.ENUM('draft', 'published', 'archived', 'deleted'),
    comment: '状态'
  })
  status!: string;

  /**
   * 元数据（统计数据、使用频率等）
   */
  @Column({
    type: DataType.JSON,
    defaultValue: {},
    comment: '元数据（统计数据、使用频率等）'
  })
  metadata?: OutfitMetadata;

  /**
   * 是否公开
   */
  @Default(false)
  @Index
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_public',
    comment: '是否公开'
  })
  isPublic!: boolean;

  /**
   * 多选季节数组（存储season的多个选项）
   */
  @Column({
    type: DataType.JSON,
    field: 'seasons',
    defaultValue: [],
    comment: '季节数组（多选）'
  })
  seasons?: string[];

  /**
   * 多选场合数组（存储occasion的多个选项）
   */
  @Column({
    type: DataType.JSON,
    field: 'scenes',
    defaultValue: [],
    comment: '场合数组（多选）'
  })
  scenes?: string[];

  /**
   * 多选风格数组（存储style的多个选项）
   */
  @Column({
    type: DataType.JSON,
    field: 'styles',
    defaultValue: [],
    comment: '风格数组（多选）'
  })
  styles?: string[];

  /**
   * 点赞数
   */
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    comment: '点赞数'
  })
  likes!: number;

  // ==================== 关联关系 ====================

  /**
   * 所属用户
   */
  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'user'
  })
  user!: User;

  /**
   * 包含的衣物列表
   */
  @BelongsToMany(() => Clothing, () => OutfitClothing, 'outfit_id', 'clothing_id')
  clothes?: Clothing[];



  // ==================== 实例方法 ====================

  /**
   * 获取搭配的完整信息
   */
  async getFullInfo() {
    const [user, clothes] = await Promise.all([
      this.$get('user'),
      this.$get('clothes')
    ]);

    return {
      id: this.id,
      name: this.name,
      description: this.description,
      season: this.season,
      occasion: this.occasion,
      style: this.style,
      coverImageUrl: this.coverImageUrl,
      imageUrls: this.imageUrls,
      rating: this.rating,
      status: this.status,
      metadata: this.metadata,
      isPublic: this.isPublic,
      user: user ? { id: user.id, username: user.username } : null,
      clothesCount: clothes?.length || 0,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 获取搭配的衣物详情
   */
  async getClothesWithDetails() {
    const clothes = await this.$get('clothes');

    return (clothes || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      condition: item.condition,
      mainImageUrl: item.mainImageUrl,
      categoryId: item.categoryId,
      colorId: item.colorId,
      styleId: item.styleId
    }));
  }

  /**
   * 计算搭配总价
   */
  async calculateTotalPrice(): Promise<number> {
    const clothes = await this.$get('clothes');
    return clothes?.reduce((total: number, item: any) => total + (item.price || 0), 0) || 0;
  }

  /**
   * 更新搭配评分
   */
  async updateRating(newRating: number) {
    if (newRating < 1 || newRating > 5) {
      throw new Error('评分必须在1-5之间');
    }

    this.rating = newRating;
    this.metadata = {
      ...this.metadata,
      ratingCount: (this.metadata?.ratingCount || 0) + 1,
      lastRatedAt: new Date()
    };
    await this.save();
  }

  /**
   * 增加使用次数
   */
  async incrementUsageCount() {
    const currentCount = this.metadata?.usageCount || 0;
    this.metadata = {
      ...this.metadata,
      usageCount: currentCount + 1,
      lastUsedAt: new Date()
    };
    await this.save();
  }

  /**
   * 发布搭配
   */
  async publish() {
    if (this.status === 'published') {
      throw new Error('搭配已发布');
    }

    this.status = 'published';
    this.metadata = {
      ...this.metadata,
      publishedAt: new Date()
    };
    await this.save();
  }

  /**
   * 归档搭配
   */
  async archive() {
    this.status = 'archived';
    this.metadata = {
      ...this.metadata,
      archivedAt: new Date()
    };
    await this.save();
  }

  // ==================== 静态方法 ====================

  /**
   * 根据用户ID查找搭配
   */
  static async findByUserId(userId: number, includePublic: boolean = false) {
    const where: any = { userId };
    if (!includePublic) {
      where.isPublic = false;
    }

    return this.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 根据季节查找搭配
   */
  static async findBySeason(userId: number, season: string) {
    return this.findAll({
      where: { userId, season },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 根据场合查找搭配
   */
  static async findByOccasion(userId: number, occasion: string) {
    return this.findAll({
      where: { userId, occasion },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 获取用户的公开搭配
   */
  static async findPublicByUserId(userId: number) {
    return this.findAll({
      where: { userId, isPublic: true },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 获取用户的草稿搭配
   */
  static async findDraftsByUserId(userId: number) {
    return this.findAll({
      where: { userId, status: 'draft' },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 获取评分最高的搭配
   */
  static async findTopRated(userId: number, limit: number = 10) {
    return this.findAll({
      where: { userId, rating: { $gte: 4 } },
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
      limit
    });
  }

  /**
   * 统计用户的搭配数量
   */
  static async countByUserId(userId: number) {
    return this.count({ where: { userId } });
  }

  /**
   * 统计各状态的搭配数量
   */
  static async countByStatus(userId: number) {
    const counts = await this.findAll({
      where: { userId },
      attributes: ['status', [this.sequelize!.fn('COUNT', this.sequelize!.col('id')), 'count']],
      group: ['status']
    });

    return counts.reduce((result, item) => {
      result[item.status] = parseInt(item.get('count') as string);
      return result;
    }, {} as Record<string, number>);
  }
}