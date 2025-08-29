import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Unique
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import { ClothingItem } from './ClothingItem';
import { Tag } from './Tag';

@Table({
  tableName: 'clothing_tags',
  indexes: [
    { unique: true, fields: ['clothingItemId', 'tagId'] }
  ]
})
export class ClothingTag extends BaseModel {
  @ForeignKey(() => ClothingItem)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  clothingItemId!: number;

  @ForeignKey(() => Tag)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  tagId!: number;

  // 关联定义
  @BelongsTo(() => ClothingItem)
  clothingItem!: ClothingItem;

  @BelongsTo(() => Tag)
  tag!: Tag;
}