import { DataTypes } from 'sequelize';
import { BaseModel, BaseModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';

/**
 * 用户偏好设置属性接口
 */
export interface UserPreferenceAttributes extends BaseModelAttributes {
  userId: number;
  preferenceKey: string;
  preferenceValue: string;
}

/**
 * 用户偏好设置创建属性接口
 */
export interface UserPreferenceCreationAttributes extends Partial<UserPreferenceAttributes> {
  userId: number;
  preferenceKey: string;
  preferenceValue: string;
}

/**
 * 用户偏好设置模型
 * 存储用户的个性化偏好设置，如主题、语言等
 */
export class UserPreference extends BaseModel<UserPreferenceAttributes> {
  declare id: number;
  declare userId: number;
  declare preferenceKey: string;
  declare preferenceValue: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  /**
   * 获取用户的所有偏好设置
   */
  static async getUserPreferences(userId: number): Promise<UserPreference[]> {
    return this.findAll({ where: { userId } });
  }

  /**
   * 更新或创建用户偏好设置
   */
  static async updatePreference(
    userId: number,
    key: string,
    value: string
  ): Promise<[UserPreference, boolean]> {
    return this.findOrCreate({
      where: { userId, preferenceKey: key },
      defaults: { userId, preferenceKey: key, preferenceValue: value } as any
    });
  }

  /**
   * 删除用户偏好设置
   */
  static async deletePreference(userId: number, key: string): Promise<number> {
    return this.destroy({ where: { userId, preferenceKey: key } });
  }
}

// 初始化模型
UserPreference.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    preferenceKey: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    preferenceValue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'UserPreferences',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'preferenceKey'],
      },
    ],
  }
);

export default UserPreference;