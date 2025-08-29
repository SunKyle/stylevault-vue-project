import {
  Table,
  Column,
  DataType,
  AllowNull,
  Length,
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
// import { ClothingItem } from './ClothingItem';

@Table({
  tableName: 'categories'
})
export class Category extends BaseModel {
  @AllowNull(false)
  @Length({ min: 1, max: 50 })
  @Column(DataType.STRING(50))
  name!: string;

  @Column(DataType.STRING(100))
  displayName?: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  parentId?: number;

  @Column(DataType.STRING(50))
  icon?: string;

  @Column(DataType.STRING(7))
  color?: string; // Hex color code

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  sortOrder!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSystem!: boolean;

  // 关联定义
  @BelongsTo(() => Category)
  parent?: Category;

  // @HasMany(() => Category)
  // children!: Category[];

  // @HasMany(() => ClothingItem)
  // clothingItems!: ClothingItem[];

  // 虚拟字段
  get isTopLevel(): boolean {
    return !this.parentId;
  }

  get isLeaf(): boolean {
    // return !this.children || this.children.length === 0;
    return true;
  }
}