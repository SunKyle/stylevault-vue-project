import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { User } from './User';
import { Outfit } from './Outfit';
import { OutfitClothing } from './OutfitClothing';
import { EntityAttribute } from './EntityAttribute';
import { ClothingCondition, ClothingMetadata } from '../../types/model.types';

/**
 * 衣物模型
 * 存储用户的衣物基础信息、图片和扩展属性
 */
@Table({
  tableName: 'clothing_items',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_clothing_user_id', fields: ['user_id'] },
    { name: 'idx_clothing_category', fields: ['category_id', 'user_id'] },
    { name: 'idx_clothing_color', fields: ['color_id', 'user_id'] },
    { name: 'idx_clothing_style', fields: ['style_id', 'user_id'] },
    { name: 'idx_clothing_public', fields: ['is_public', 'user_id'] },
    { name: 'idx_clothing_condition', fields: ['condition', 'user_id'] },
    { name: 'idx_clothing_brand', fields: ['brand', 'user_id'] }
  ]
})
export class ClothingItem extends BaseModel<ClothingItem> {
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
   * 衣物名称
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [1, 100],
      notEmpty: true
    },
    comment: '衣物名称'
  })
  name!: string;

  /**
   * 品牌名称
   */
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [0, 100]
    },
    comment: '品牌名称'
  })
  brand?: string;

  /**
   * 价格
   */
  @Column({
    type: DataType.DECIMAL(10, 2),
    validate: {
      min: 0,
      max: 999999.99
    },
    comment: '价格'
  })
  price?: number;

  /**
   * 购买日期
   */
  @Column({
    type: DataType.DATEONLY,
    field: 'purchase_date',
    comment: '购买日期'
  })
  purchaseDate?: Date;

  /**
   * 尺码
   */
  @Column({
    type: DataType.STRING(20),
    validate: {
      len: [0, 20]
    },
    comment: '尺码'
  })
  size?: string;

  /**
   * 状况
   */
  @Column({
    type: DataType.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
    comment: '衣物状况'
  })
  condition?: string;

  /**
   * 备注信息
   */
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 2000]
    },
    comment: '备注信息'
  })
  notes?: string;

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
   * 主图URL（封面图）
   */
  @Column({
    type: DataType.STRING(255),
    field: 'main_image_url',
    validate: {
      len: [0, 255],
      isUrl: true
    },
    comment: '主图URL'
  })
  mainImageUrl?: string;

  /**
   * 主要分类ID（冗余字段，提高查询性能）
   */
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'category_id',
    comment: '主要分类ID'
  })
  categoryId?: number;

  /**
   * 主要颜色ID（冗余字段，提高查询性能）
   */
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'color_id',
    comment: '主要颜色ID'
  })
  colorId?: number;

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
   * 元数据（统计数据、使用频率等）
   */
  @Column({
    type: DataType.JSON,
    defaultValue: {},
    comment: '元数据（统计数据、使用频率等）'
  })
  metadata?: ClothingMetadata;

  /**
   * 状态
   */
  @Default('active')
  @Index
  @Column({
    type: DataType.ENUM('active', 'inactive', 'archived', 'deleted'),
    comment: '状态：active-活跃, inactive-非活跃, archived-已归档, deleted-已删除'
  })
  status!: string;

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
   * 所属的搭配列表
   */
  @BelongsToMany(() => Outfit, () => OutfitClothing, 'clothing_id', 'outfit_id')
  outfits?: Outfit[];

  /**
   * 属性关联列表
   */
  @HasMany(() => EntityAttribute, {
    foreignKey: 'entityId',
    constraints: false,
    scope: {
      entityType: 'clothing_item'
    },
    as: 'attributes'
  })
  attributes?: EntityAttribute[];

  // ==================== 实例方法 ====================

  /**
   * 获取衣物的完整信息
   */
  async getFullInfo() {
    const [user, outfits, attributes] = await Promise.all([
      this.$get('user'),
      this.$get('outfits'),
      this.$get('attributes')
    ]);

    return {
      id: this.id,
      name: this.name,
      brand: this.brand,
      price: this.price,
      purchaseDate: this.purchaseDate,
      size: this.size,
      condition: this.condition,
      notes: this.notes,
      imageUrls: this.imageUrls,
      mainImageUrl: this.mainImageUrl,
      categoryId: this.categoryId,
      colorId: this.colorId,
      styleId: this.styleId,
      metadata: this.metadata,
      isPublic: this.isPublic,
      user: user ? { id: user.id, username: user.username } : null,
      outfitsCount: outfits?.length || 0,
      attributesCount: attributes?.length || 0,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 获取衣物的使用统计
   */
  getUsageStats() {
    return {
      wearCount: this.metadata?.wearCount || 0,
      lastWorn: this.metadata?.lastWorn || null,
      isFavorite: this.metadata?.favorite || false,
      rating: this.metadata?.rating || 0,
      tags: this.metadata?.tags || []
    };
  }

  /**
   * 增加穿着次数
   */
  async incrementWearCount() {
    const currentCount = this.metadata?.wearCount || 0;
    this.metadata = {
      ...this.metadata,
      wearCount: currentCount + 1,
      lastWorn: new Date()
    };
    await this.save();
  }

  // ==================== 静态方法 ====================

  /**
   * 根据用户ID查找衣物
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
   * 根据分类查找衣物
   */
  static async findByCategory(userId: number, categoryId: number) {
    return this.findAll({
      where: { userId, categoryId },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 获取用户的公开衣物
   */
  static async findPublicByUserId(userId: number) {
    return this.findAll({
      where: { userId, isPublic: true },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 根据状态查找衣物
   */
  static async findByStatus(userId: number, status: string) {
    return this.findAll({
      where: { userId, status },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 统计用户的衣物数量
   */
  static async countByUserId(userId: number) {
    return this.count({ where: { userId } });
  }
}