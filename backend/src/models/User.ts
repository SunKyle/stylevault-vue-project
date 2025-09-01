import { DataTypes } from 'sequelize';
import { BaseModel, BaseModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';

/**
 * 用户属性接口
 */
export interface UserAttributes extends BaseModelAttributes {
  username: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  avatar?: string;
  displayName?: string;
  bio?: string;
  preferences?: object;
  metadata?: object;
}

/**
 * 用户创建属性接口
 */
export interface UserCreationAttributes extends Partial<UserAttributes> {
  username: string;
  email: string;
  passwordHash: string;
}

/**
 * 用户模型
 * 管理用户信息
 */
export class User extends BaseModel<UserAttributes> {
  declare id: number;
  declare username: string;
  declare email: string;
  declare passwordHash: string;
  declare isEmailVerified: boolean;
  declare avatar?: string;
  declare displayName?: string;
  declare bio?: string;
  declare preferences?: object;
  declare metadata?: object;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  /**
   * 按用户名查找用户
   */
  static async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ where: { username } });
  }

  /**
   * 按邮箱查找用户
   */
  static async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  /**
   * 创建新用户
   */
  static async createUser(attributes: UserCreationAttributes): Promise<User> {
    return this.create(attributes as any);
  }

  /**
   * 更新用户信息
   */
  async updateProfile(updates: Partial<UserAttributes>): Promise<void> {
    Object.assign(this, updates);
    await this.save();
  }

  /**
   * 验证密码
   */
  async validatePassword(password: string): Promise<boolean> {
    // 这里应该实现密码验证逻辑
    // 暂时返回true，实际应该使用bcrypt等库进行验证
    return true;
  }

  /**
   * 更新密码
   */
  async updatePassword(newPassword: string): Promise<void> {
    // 这里应该实现密码哈希逻辑
    // 暂时直接保存，实际应该使用bcrypt等库进行哈希
    this.passwordHash = newPassword;
    await this.save();
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(): Promise<void> {
    this.isEmailVerified = true;
    await this.save();
  }

  /**
   * 获取公开信息
   */
  toPublicJSON(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      isEmailVerified: this.isEmailVerified,
      avatar: this.avatar,
      displayName: this.displayName,
      bio: this.bio,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// 初始化模型
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
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
    tableName: 'Users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['username'],
        unique: true,
      },
      {
        fields: ['email'],
        unique: true,
      },
    ],
  }
);

export default User;