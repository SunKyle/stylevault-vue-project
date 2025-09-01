import { Table, Column, DataType, ForeignKey, BelongsTo, BelongsToMany, HasMany, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { User } from './User';
import { ClothingItem } from './ClothingItem';
import { OutfitClothing } from './OutfitClothing';
import { EntityAttribute } from './EntityAttribute';
import { OutfitMetadata, OutfitStatus } from '../../types/model.types';

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
    { name: 'idx_outfit_season', fields: ['season', 'user_id'] },
    { name: 'idx_outfit_occasion', fields: ['occasion', 'user_id'] },
    { name: 'idx_outfit_style', fields: ['style_id', 'user_id'] },
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
   * 季节（spring, summer, autumn, winter, all）
   */
  @Column({
    type: DataType.ENUM('spring', 'summer', 'autumn', 'winter', 'all'),
    comment: '季节'
  })
  season?: string;

  /**
   * 场合（casual, formal, business, sport, party, daily）
   */
  @Column({
    type: DataType.ENUM('casual', 'formal', 'business', 'sport', 'party', 'daily'),
    comment: '场合'
  })
  occasion?: string;

  /**
   * 主要风格ID（冗余字段，提高查询性能）
   */
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'style_id',
    comment: '主要风格ID'
  })
  styleId?: number;

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
  @BelongsToMany(() => ClothingItem, () => OutfitClothing, 'outfit_id', 'clothing_id')
  clothingItems?: ClothingItem[];

  /**
   * 属性关联列表
   */
  @HasMany(() => EntityAttribute, {
    foreignKey: 'entityId',
    constraints: false,
    scope: {
      entityType: 'outfit'
    },
    as: 'attributes'
  })
  attributes?: EntityAttribute[];

  // ==================== 实例方法 ====================

  /**
   * 获取搭配的完整信息
   */
  async getFullInfo() {
    const [user, clothingItems, attributes] = await Promise.all([
      this.$get('user'),
      this.$get('clothingItems'),
      this.$get('attributes')
    ]);

    return {
      id: this.id,
      name: this.name,
      description: this.description,
      season: this.season,
      occasion: this.occasion,
      styleId: this.styleId,
      coverImageUrl: this.coverImageUrl,
      imageUrls: this.imageUrls,
      rating: this.rating,
      status: this.status,
      metadata: this.metadata,
      isPublic: this.isPublic,
      user: user ? { id: user.id, username: user.username } : null,
      clothingItemsCount: clothingItems?.length || 0,
      attributesCount: attributes?.length || 0,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 获取搭配的衣物详情
   */
  async getClothingItemsWithDetails() {
    const clothingItems = await this.$get('clothingItems', {
      include: [
        {
          model: EntityAttribute,
          as: 'attributes',
          where: { entityType: 'clothing_item' },
          required: false
        }
      ]
    });

    return (clothingItems || []).map(item => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      condition: item.condition,
      mainImageUrl: item.mainImageUrl,
      categoryId: item.categoryId,
      colorId: item.colorId,
      styleId: item.styleId,
      attributes: item.attributes || []
    }));
  }

  /**
   * 计算搭配总价
   */
  async calculateTotalPrice(): Promise<number> {
    const clothingItems = await this.$get('clothingItems');
    return clothingItems?.reduce((total, item) => total + (item.price || 0), 0) || 0;
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