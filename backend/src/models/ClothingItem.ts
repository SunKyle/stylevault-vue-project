import { DataTypes, Op } from 'sequelize';
import { UserOwnedModel, UserOwnedModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';
import {
  Field,
  StringField,
  TextField,
  IntegerField,
  BooleanField,
  DecimalField,
  DateTimeField,
  JSONField,
  ForeignKey,
  createFieldDefinitions,
} from '../decorators/field-decorator';

/**
 * 服装项目属性接口
 */
export interface ClothingItemAttributes extends UserOwnedModelAttributes {
  name: string;
  description?: string;
  categoryId: number;
  brand?: string;
  color?: string;
  size?: string;
  material?: string;
  price?: number;
  purchaseDate?: Date;
  imageUrl?: string;
  isFavorite: boolean;
  tags?: string[];
  metadata?: object;
}

/**
 * 服装项目创建属性接口
 */
export interface ClothingItemCreationAttributes extends Partial<ClothingItemAttributes> {
  name: string;
  categoryId: number;
}

/**
 * 服装项目模型
 * 管理用户的服装项目信息
 */
export class ClothingItem extends UserOwnedModel<ClothingItemAttributes> {
  @Field({ primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER })
  declare id: number;

  @StringField({ length: 200, allowNull: false })
  declare name: string;

  @TextField({ allowNull: true })
  declare description?: string;

  @ForeignKey(() => require('./Category').Category, { allowNull: false })
  declare categoryId: number;

  @StringField({ length: 100, allowNull: true })
  declare brand?: string;

  @StringField({ length: 50, allowNull: true })
  declare color?: string;

  @StringField({ length: 20, allowNull: true })
  declare size?: string;

  @StringField({ length: 100, allowNull: true })
  declare material?: string;

  @DecimalField({ precision: 10, scale: 2, allowNull: true })
  declare price?: number;

  @DateTimeField({ allowNull: true })
  declare purchaseDate?: Date;

  @StringField({ length: 500, allowNull: true })
  declare imageUrl?: string;

  @BooleanField({ defaultValue: false })
  declare isFavorite: boolean;

  @Field({ type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true })
  declare tags?: string[];

  @JSONField({ allowNull: true })
  declare metadata?: object;

  /**
   * 按分类获取服装项目
   */
  static async getByCategory(categoryId: number): Promise<ClothingItem[]> {
    return this.findAll({
      where: { categoryId, isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * 获取收藏的服装项目
   */
  static async getFavorites(userId: number): Promise<ClothingItem[]> {
    return this.findAll({
      where: { userId, isFavorite: true, isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * 搜索服装项目
   */
  static async search(userId: number, query: string): Promise<ClothingItem[]> {
    return this.findAll({
      where: {
        userId,
        isActive: true,
        name: { [Op.like]: `%${query}%` },
      },
      order: [['createdAt', 'DESC']],
    });
  }
}

// 使用装饰器构建模型定义
const fieldDefinitions = createFieldDefinitions(ClothingItem);

// 初始化模型
ClothingItem.init(fieldDefinitions, {
  sequelize,
  tableName: 'ClothingItems',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['user_id', 'is_active'],
    },
    {
      fields: ['category_id', 'is_active'],
    },
    {
      fields: ['user_id', 'is_favorite', 'is_active'],
    },
    {
      fields: ['user_id', 'name'],
    },
  ],
});

export default ClothingItem;