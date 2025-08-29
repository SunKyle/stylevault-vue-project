import {
  Table,
  Column,
  DataType,
  AllowNull,
  Length,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { User } from './User';
import { Category } from './Category';
// import { ClothingTag } from './ClothingTag';

export enum ClothingType {
  TOP = 'top',
  BOTTOM = 'bottom',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories',
  OUTERWEAR = 'outerwear',
  DRESS = 'dress'
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter',
  ALL_SEASON = 'all_season'
}

@Table({
  tableName: 'clothing_items'
})
export class ClothingItem extends BaseModel {
  @AllowNull(false)
  @Length({ min: 1, max: 100 })
  @Column(DataType.STRING(100))
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  categoryId?: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ClothingType)))
  type!: ClothingType;

  @Column(DataType.STRING(50))
  brand?: string;

  @Column(DataType.DECIMAL(10, 2))
  price?: number;

  @Column(DataType.STRING(20))
  size?: string;

  @Column(DataType.STRING(50))
  color?: string;

  @Column(DataType.STRING(50))
  material?: string;

  @Column(DataType.ENUM(...Object.values(Season)))
  season?: Season;

  @Column(DataType.TEXT)
  occasion?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isClean!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isAvailable!: boolean;

  @Column(DataType.STRING(500))
  imageUrl?: string;

  @Column(DataType.JSON)
  images?: string[];

  @Column(DataType.DATE)
  lastWorn?: Date;

  @Column(DataType.INTEGER)
  wearCount?: number;

  @Default(0)
  @Column(DataType.INTEGER)
  viewCount!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  likeCount!: number;

  // 关联定义
  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Category)
  category?: Category;

  // @HasMany(() => ClothingTag)
  // clothingTags!: ClothingTag[];

  // @HasMany(() => OutfitItem)
  // outfitItems!: OutfitItem[];

  // 虚拟字段
  get imageCount(): number {
    return this.images?.length || 0;
  }

  get isWornRecently(): boolean {
    if (!this.lastWorn) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.lastWorn > thirtyDaysAgo;
  }
}