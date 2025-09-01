import { DataTypes } from 'sequelize';
import { UserOwnedModel, UserOwnedModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';
import {
  Field,
  StringField,
  TextField,
  IntegerField,
  BooleanField,
  JSONField,
  createFieldDefinitions,
} from '../decorators/field-decorator';

/**
 * 穿搭属性接口
 */
export interface OutfitAttributes extends UserOwnedModelAttributes {
  name: string;
  description?: string;
  occasion?: string;
  season?: string;
  weather?: string;
  rating?: number;
  isPublic: boolean;
  imageUrl?: string;
  tags?: string[];
  metadata?: object;
}

/**
 * 穿搭创建属性接口
 */
export interface OutfitCreationAttributes extends Partial<OutfitAttributes> {
  name: string;
}

/**
 * 穿搭模型
 * 管理用户的穿搭组合信息
 */
export class Outfit extends UserOwnedModel<OutfitAttributes> {
  @Field({ primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER })
  declare id: number;

  @StringField({ length: 200, allowNull: false })
  declare name: string;

  @TextField({ allowNull: true })
  declare description?: string;

  @StringField({ length: 50, allowNull: true })
  declare occasion?: string;

  @StringField({ length: 20, allowNull: true })
  declare season?: string;

  @StringField({ length: 50, allowNull: true })
  declare weather?: string;

  @IntegerField({ allowNull: true, validate: { min: 1, max: 5 } })
  declare rating?: number;

  @BooleanField({ defaultValue: false })
  declare isPublic: boolean;

  @StringField({ length: 500, allowNull: true })
  declare imageUrl?: string;

  @Field({ type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true })
  declare tags?: string[];

  @JSONField({ allowNull: true })
  declare metadata?: object;

  /**
   * 按用户ID获取穿搭
   */
  static async getByUserId(userId: number, options?: any): Promise<Outfit[]> {
    return this.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      ...options,
    });
  }

  /**
   * 获取公开穿搭
   */
  static async getPublicOutfits(): Promise<Outfit[]> {
    return this.findAll({
      where: { isPublic: true, isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * 按场合获取穿搭
   */
  static async getByOccasion(occasion: string, userId?: number): Promise<Outfit[]> {
    const where: any = { occasion, isActive: true };
    if (userId) where.userId = userId;
    
    return this.findAll({
      where,
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  /**
   * 按季节获取穿搭
   */
  static async getBySeason(season: string, userId?: number): Promise<Outfit[]> {
    const where: any = { season, isActive: true };
    if (userId) where.userId = userId;
    
    return this.findAll({
      where,
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  /**
   * 获取高评分穿搭
   */
  static async getTopRated(userId: number, limit: number = 10): Promise<Outfit[]> {
    return this.findAll({
      where: { userId, rating: { $gte: 4 }, isActive: true },
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
      limit,
    });
  }
}

// 使用装饰器构建模型定义
const fieldDefinitions = createFieldDefinitions(Outfit);

// 初始化模型
Outfit.init(fieldDefinitions, {
  sequelize,
  tableName: 'Outfits',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['user_id', 'is_active'],
    },
    {
      fields: ['occasion'],
    },
    {
      fields: ['season'],
    },
    {
      fields: ['is_public'],
    },
    {
      fields: ['rating'],
    },
    {
      fields: ['user_id', 'rating', 'is_active'],
    },
  ],
});

export default Outfit;