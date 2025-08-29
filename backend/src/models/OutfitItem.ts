import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { Outfit } from './Outfit';
import { ClothingItem } from './ClothingItem';

@Table({
  tableName: 'outfit_items',
  indexes: [
    { unique: true, fields: ['outfitId', 'clothingItemId'] }
  ]
})
export class OutfitItem extends BaseModel {
  @ForeignKey(() => Outfit)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  outfitId!: number;

  @ForeignKey(() => ClothingItem)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  clothingItemId!: number;

  @Column(DataType.STRING(100))
  notes?: string;

  @Column(DataType.INTEGER)
  orderIndex?: number;

  // 关联定义
  @BelongsTo(() => Outfit)
  outfit!: Outfit;

  @BelongsTo(() => ClothingItem)
  clothingItem!: ClothingItem;
}