import { Model, PrimaryKey, AutoIncrement, Column, DataType, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

/**
 * 基础抽象模型类
 * 为所有实体模型提供公共字段和基础功能
 */
export abstract class BaseModel<T extends Model> extends Model<T> {
  /**
   * 主键ID
   * 自增整数类型
   */
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '主键ID'
  })
  id!: number;

  /**
   * 创建时间
   * 自动设置为当前时间
   */
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
    comment: '创建时间'
  })
  createdAt!: Date;

  /**
   * 更新时间
   * 自动更新为当前时间
   */
  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
    comment: '更新时间'
  })
  updatedAt!: Date;

  /**
   * 删除时间
   * 软删除标记，为null表示未删除
   */
  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
    comment: '删除时间'
  })
  deletedAt?: Date;

  /**
   * 检查记录是否被软删除
   */
  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  /**
   * 获取模型的JSON表示，排除软删除字段
   */
  toJSON(): object {
    const values = { ...this.get() };
    if (values.deletedAt === null) {
      delete values.deletedAt;
    }
    return values;
  }
}