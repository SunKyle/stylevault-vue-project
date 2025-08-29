import {
  Table,
  Column,
  DataType,
  Unique,
  AllowNull,
  Length,
  HasMany,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import { BaseModel } from './BaseModel';
import bcrypt from 'bcryptjs';

@Table({
  tableName: 'users',
  indexes: [
    { unique: true, fields: ['email'] },
    { unique: true, fields: ['username'] }
  ]
})
export class User extends BaseModel {
  @Unique
  @AllowNull(false)
  @Length({ min: 3, max: 50 })
  @Column(DataType.STRING(50))
  username!: string;

  @Unique
  @AllowNull(false)
  @Length({ min: 5, max: 100 })
  @Column(DataType.STRING(100))
  email!: string;

  @AllowNull(false)
  @Length({ min: 6, max: 255 })
  @Column(DataType.STRING(255))
  password!: string;

  @Column(DataType.STRING(255))
  avatar?: string;

  @Column(DataType.STRING(100))
  firstName?: string;

  @Column(DataType.STRING(100))
  lastName?: string;

  @Column(DataType.DATE)
  dateOfBirth?: Date;

  @Column(DataType.ENUM('male', 'female', 'other', 'prefer_not_to_say'))
  gender?: string;

  @Column(DataType.TEXT)
  bio?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isEmailVerified!: boolean;

  @Column(DataType.STRING(255))
  refreshToken?: string;

  // 关联定义
  // @HasMany(() => ClothingItem)
  // clothingItems!: ClothingItem[];

  // @HasMany(() => Outfit)
  // outfits!: Outfit[];

  // @HasOne(() => UserPreference)
  // preference?: UserPreference;

  // 密码哈希
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const saltRounds = 12;
      instance.password = await bcrypt.hash(instance.password, saltRounds);
    }
  }

  // 验证密码
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // 获取全名
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
  }

  // 安全返回用户数据
  toSafeJSON() {
    return super.toSafeJSON(['password', 'refreshToken']);
  }
}