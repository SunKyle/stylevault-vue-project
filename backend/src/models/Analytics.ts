import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { User } from './User';
import { ClothingItem } from './ClothingItem';
import { Outfit } from './Outfit';

export enum AnalyticsType {
  VIEW = 'view',
  LIKE = 'like',
  SHARE = 'share',
  WEAR = 'wear',
  PURCHASE = 'purchase',
  UPLOAD = 'upload',
  SEARCH = 'search'
}

@Table({
  tableName: 'analytics'
})
export class Analytics extends BaseModel {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.ENUM(...Object.values(AnalyticsType)))
  type!: AnalyticsType;

  @ForeignKey(() => ClothingItem)
  @Column(DataType.INTEGER)
  clothingItemId?: number;

  @ForeignKey(() => Outfit)
  @Column(DataType.INTEGER)
  outfitId?: number;

  @Column(DataType.STRING(100))
  action?: string;

  @Column(DataType.JSON)
  metadata?: {
    [key: string]: any;
  };

  @Column(DataType.STRING(50))
  ipAddress?: string;

  @Column(DataType.STRING(500))
  userAgent?: string;

  @Column(DataType.STRING(50))
  referrer?: string;

  // 关联定义
  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => ClothingItem)
  clothingItem?: ClothingItem;

  @BelongsTo(() => Outfit)
  outfit?: Outfit;
}