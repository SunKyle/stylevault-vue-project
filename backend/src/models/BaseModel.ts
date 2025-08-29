import {
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';

export abstract class BaseModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date | null;

  // 公共方法
  toJSON() {
    const values = { ...this.get() };
    // 删除软删除字段，除非显式需要
    if (!values.deletedAt) {
      delete values.deletedAt;
    }
    return values;
  }

  // 获取排除字段的对象
  toSafeJSON(excludeFields: string[] = []): any {
    const values = this.toJSON();
    excludeFields.forEach(field => {
      delete values[field];
    });
    return values;
  }
}