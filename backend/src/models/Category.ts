import { DataTypes, Op, WhereOptions } from 'sequelize';
import { BaseModel, BaseModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';

export interface CategoryAttributes extends BaseModelAttributes {
  name: string;
  description?: string;
  icon?: string;
  parentId?: number;
}

export class Category extends BaseModel<CategoryAttributes> implements CategoryAttributes {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare description?: string;
  declare icon?: string;
  declare parentId?: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  static async getRootCategories(userId: number): Promise<Category[]> {
    return this.findAll({
      where: {
        userId,
        parentId: null
      } as WhereOptions<CategoryAttributes>,
      order: [['name', 'ASC']]
    });
  }

  static async getChildren(parentId: number, userId: number): Promise<Category[]> {
    return this.findAll({
      where: {
        parentId,
        userId
      } as WhereOptions<CategoryAttributes>,
      order: [['name', 'ASC']]
    });
  }

  static async findByName(name: string, userId: number): Promise<Category | null> {
    return this.findOne({
      where: {
        name,
        userId
      } as WhereOptions<CategoryAttributes>
    });
  }

  static async searchByName(searchTerm: string, userId: number): Promise<Category[]> {
    return this.findAll({
      where: {
        name: { [Op.like]: `%${searchTerm}%` },
        userId
      } as WhereOptions<CategoryAttributes>,
      order: [['name', 'ASC']]
    });
  }

  static async getAllActive(userId: number): Promise<Category[]> {
    return this.findAll({
      where: {
        userId
      } as WhereOptions<CategoryAttributes>,
      order: [['name', 'ASC']]
    });
  }
}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at',
  },
}, {
  sequelize,
  tableName: 'categories',
  underscored: true,
  paranoid: true,
  indexes: [
    {
      fields: ['user_id', 'deleted_at']
    },
    {
      fields: ['parent_id', 'user_id']
    },
    {
      fields: ['user_id', 'name'],
      unique: true
    }
  ]
});