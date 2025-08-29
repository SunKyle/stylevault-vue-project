import {
  Table,
  Column,
  DataType,
  AllowNull,
  Length,
  HasMany,
  Default
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
// import { ClothingTag } from './ClothingTag';

@Table({
  tableName: 'tags'
})
export class Tag extends BaseModel {
  @AllowNull(false)
  @Length({ min: 1, max: 30 })
  @Column(DataType.STRING(30))
  name!: string;

  @Column(DataType.STRING(7))
  color?: string; // Hex color code

  @Column(DataType.STRING(50))
  icon?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSystem!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  usageCount!: number;

  @Column(DataType.STRING(50))
  category?: string;

  // 关联定义
  // @HasMany(() => ClothingTag)
  // clothingTags!: ClothingTag[];

  // 虚拟字段
  get isPopular(): boolean {
    return this.usageCount > 10;
  }

  get displayLabel(): string {
    return `#${this.name}`;
  }
}