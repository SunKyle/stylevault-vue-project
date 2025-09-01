import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface UserOwnedModelAttributes {
  id: number;
  userId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOwnedModelCreationAttributes extends Optional<UserOwnedModelAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class UserOwnedModel<T extends UserOwnedModelAttributes> extends Model<T, UserOwnedModelCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// 设置原型方法以确保所有子类都能使用
(UserOwnedModel as any).prototype.toJSON = function() {
  const values = { ...this.get() };
  // 移除不需要的字段
  delete values.deletedAt;
  return values;
};