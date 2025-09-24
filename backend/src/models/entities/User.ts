import { Table, Column, DataType, HasMany, Unique, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { Clothing } from './Clothing';
import { Outfit } from './Outfit';
import { UserPreferences } from './UserPreferences';
import { UserBehavior } from './UserBehavior';
import { WeatherData } from './WeatherData';
import { Recommendations } from './Recommendations';
import { StyleProfile } from '../../types/model.types';

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

/**
 * 用户模型
 * 存储用户基础信息、认证信息和偏好设置
 */
@Table({
  tableName: 'users',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_users_username', fields: ['username'], unique: true },
    { name: 'idx_users_email', fields: ['email'], unique: true },
    { name: 'idx_users_created_at', fields: ['created_at'] }
  ]
})
export class User extends BaseModel<User> {
  /**
   * 用户名
   * 唯一标识，用于登录和显示
   */
  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      len: [3, 50],
      isAlphanumeric: true,
      notEmpty: true
    },
    comment: '用户名，唯一标识'
  })
  username!: string;

  /**
   * 电子邮箱
   * 用于登录、通知和密码重置
   */
  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [5, 100],
      isEmail: true,
      notEmpty: true
    },
    comment: '电子邮箱地址'
  })
  email!: string;

  /**
   * 密码哈希
   * 存储加密后的密码
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    field: 'password_hash',
    validate: {
      len: [6, 255],
      notEmpty: true
    },
    comment: '密码哈希值'
  })
  passwordHash!: string;

  /**
   * 头像URL
   * 用户头像的网络地址
   */
  @Column({
    type: DataType.STRING(255),
    field: 'avatar_url',
    validate: {
      len: [0, 255],
      isUrl: true
    },
    comment: '用户头像URL'
  })
  avatarUrl?: string;

  /**
   * 用户偏好设置
   * JSON格式存储用户的个性化设置
   */
  @Column({
    type: DataType.JSON,
    field: 'preferences',
    defaultValue: {},
    comment: '用户偏好设置（主题、语言等）'
  })
  preferences?: object;

  /**
   * 用户风格画像
   * JSON格式存储用户的风格偏好
   */
  @Column({
    type: DataType.JSON,
    field: 'style_profile',
    defaultValue: {},
    comment: '用户风格画像'
  })
  styleProfile?: StyleProfile;

  /**
   * 用户状态
   */
  @Default(UserStatus.ACTIVE)
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    comment: '用户状态'
  })
  status!: UserStatus;

  /**
   * 最后登录时间
   */
  @Column({
    type: DataType.DATE,
    field: 'last_login_at',
    comment: '最后登录时间'
  })
  lastLoginAt?: Date;

  // ==================== 关联关系 ====================

  /**
   * 用户拥有的衣物列表
   */
  @HasMany(() => Clothing, {
    foreignKey: 'userId',
    as: 'clothes'
  })
  clothes?: Clothing[];

  /**
   * 用户创建的搭配列表
   */
  @HasMany(() => Outfit, {
    foreignKey: 'userId',
    as: 'outfits'
  })
  outfits?: Outfit[];

  /**
   * 用户的偏好配置列表
   */
  @HasMany(() => UserPreferences, {
    foreignKey: 'userId',
    as: 'userPreferences'
  })
  userPreferences?: UserPreferences[];

  /**
   * 用户的行为日志列表
   */
  @HasMany(() => UserBehavior, {
    foreignKey: 'userId',
    as: 'behaviors'
  })
  behaviors?: UserBehavior[];

  /**
   * 用户的天气数据列表
   */
  @HasMany(() => WeatherData, {
    foreignKey: 'userId',
    as: 'weatherData'
  })
  weatherData?: WeatherData[];

  /**
   * 用户的推荐结果列表
   */
  @HasMany(() => Recommendations, {
    foreignKey: 'userId',
    as: 'recommendations'
  })
  recommendations?: Recommendations[];

  // ==================== 实例方法 ====================

  /**
   * 获取用户的公开衣物数量
   */
  get publicClothesCount(): Promise<number> {
    return this.$count('clothes', {
      where: { isPublic: true }
    });
  }

  /**
   * 获取用户的公开搭配数量
   */
  get publicOutfitsCount(): Promise<number> {
    return this.$count('outfits', {
      where: { isPublic: true }
    });
  }

  /**
   * 获取用户的完整信息（包含统计）
   */
  async getProfileWithStats() {
    const [clothingCount, outfitCount] = await Promise.all([
      this.$count('clothes'),
      this.$count('outfits')
    ]);

    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatarUrl: this.avatarUrl,
      preferences: this.preferences,
      styleProfile: this.styleProfile,
      stats: {
        totalClothingItems: clothingCount,
        totalOutfits: outfitCount,
        createdAt: this.createdAt
      }
    };
  }

  // ==================== 静态方法 ====================

  /**
   * 根据用户名查找用户
   */
  static async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ where: { username } });
  }

  /**
   * 更新最后登录时间
   */
  async updateLastLogin() {
    await this.update({ lastLoginAt: new Date() });
  }

  /**
   * 根据状态查找用户
   */
  static async findByStatus(status: string): Promise<User[]> {
    return this.findAll({ where: { status } });
  }

  /**
   * 根据邮箱查找用户
   */
  static async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  /**
   * 检查用户名是否已存在
   */
  static async isUsernameTaken(username: string): Promise<boolean> {
    const count = await this.count({ where: { username } });
    return count > 0;
  }

  /**
   * 检查邮箱是否已存在
   */
  static async isEmailTaken(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }
}