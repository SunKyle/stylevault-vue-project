import { BaseModel } from '../base/BaseModel';
import { User } from './User';
import { Attribute } from './Attribute';
import { OutfitClothing } from './OutfitClothing';
import { Table, Column, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany, Unique, AllowNull, Default, Index, DataType, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

/**
 * 衣物模型
 * 存储用户的衣物信息，采用属性标准化设计
 */
@Table({
  tableName: 'clothing',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_clothing_user_id', fields: ['user_id'] },
    { name: 'idx_clothing_user_category', fields: ['user_id', 'category'] },
    { name: 'idx_clothing_user_color', fields: ['user_id', 'color'] },
    { name: 'idx_clothing_user_style', fields: ['user_id', 'style'] },
    { name: 'idx_clothing_public', fields: ['is_public', 'user_id'] },
    { name: 'idx_clothing_brand', fields: ['brand', 'user_id'] }
  ]
})
export class Clothing extends BaseModel<Clothing> {
  /**
   * 所属用户ID
   */
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'user_id',
    comment: '关联用户ID'
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
   * 品牌名称（直接存储文本）
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
   * 尺码ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Column({
    type: DataType.INTEGER,
    comment: '尺码ID（关联attributes表）'
  })
  size?: number;

  /**
   * 备注信息
   */
  @Column({
    type: DataType.TEXT,
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
   * 主图URL
   */
  @Column({
    type: DataType.STRING(255),
    field: 'main_image_url',
    comment: '主图URL'
  })
  mainImageUrl?: string;

  /**
   * 分类ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Index
  @Column({
    type: DataType.INTEGER,
    comment: '分类ID（关联attributes表）'
  })
  category?: number;

  /**
   * 风格ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Index
  @Column({
    type: DataType.INTEGER,
    comment: '风格ID（关联attributes表）'
  })
  style?: number;

  /**
   * 颜色ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Index
  @Column({
    type: DataType.INTEGER,
    comment: '颜色ID（关联attributes表）'
  })
  color?: number;

  /**
   * 季节ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Column({
    type: DataType.INTEGER,
    comment: '季节ID（关联attributes表）'
  })
  season?: number;

  /**
   * 材质ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Column({
    type: DataType.INTEGER,
    comment: '材质ID（关联attributes表）'
  })
  material?: number;

  /**
   * 图案ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Column({
    type: DataType.INTEGER,
    comment: '图案ID（关联attributes表）'
  })
  pattern?: number;

  /**
   * 新旧程度ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Column({
    type: DataType.INTEGER,
    comment: '新旧程度ID（关联attributes表）'
  })
  condition?: number;

  /**
   * 状态ID（关联attributes表）
   */
  @ForeignKey(() => Attribute)
  @Column({
    type: DataType.INTEGER,
    comment: '状态ID（关联attributes表）'
  })
  status?: number;

  /**
   * 是否公开
   */
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_public',
    defaultValue: 0,
    comment: '是否公开'
  })
  isPublic?: boolean;

  /**
   * 是否收藏
   */
  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_favorite',
    defaultValue: 0,
    comment: '是否收藏'
  })
  isFavorite!: boolean;

  /**
   * 父级衣物ID
   */
  @ForeignKey(() => Clothing)
  @Column({
    type: DataType.INTEGER,
    field: 'parent_id',
    comment: '父级衣物ID'
  })
  parentId?: number;

  /**
   * 关联的用户
   */
  @BelongsTo(() => User)
  user?: User;

  /**
   * 关联的尺码属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'size',
    constraints: false
  })
  sizeAttribute?: Attribute;

  /**
   * 关联的分类属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'category',
    constraints: false
  })
  categoryAttribute?: Attribute;

  /**
   * 关联的风格属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'style',
    constraints: false
  })
  styleAttribute?: Attribute;

  /**
   * 关联的颜色属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'color',
    constraints: false
  })
  colorAttribute?: Attribute;

  /**
   * 关联的季节属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'season',
    constraints: false
  })
  seasonAttribute?: Attribute;

  /**
   * 关联的材质属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'material',
    constraints: false
  })
  materialAttribute?: Attribute;

  /**
   * 关联的图案属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'pattern',
    constraints: false
  })
  patternAttribute?: Attribute;

  /**
   * 关联的新旧程度属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'condition',
    constraints: false
  })
  conditionAttribute?: Attribute;

  /**
   * 关联的状态属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'status',
    constraints: false
  })
  statusAttribute?: Attribute;

  /**
   * 关联的搭配
   */
  @HasMany(() => OutfitClothing)
  outfitClothings?: OutfitClothing[];

  /**
   * 子衣物
   */
  @HasMany(() => Clothing, {
    foreignKey: 'parentId'
  })
  children?: Clothing[];

  /**
   * 父衣物
   */
  @BelongsTo(() => Clothing, {
    foreignKey: 'parentId'
  })
  parent?: Clothing;
}