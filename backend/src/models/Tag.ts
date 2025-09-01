import { DataTypes, Op, WhereOptions } from 'sequelize';
import { BaseModel, BaseModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';

export interface TagAttributes extends BaseModelAttributes {
  name: string;
  description?: string;
  color?: string;
}

export class Tag extends BaseModel<TagAttributes> implements TagAttributes {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare description?: string;
  declare color?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  static async getUserTags(userId: number): Promise<Tag[]> {
    return this.findAll({
      where: {
        userId
      } as WhereOptions<TagAttributes>,
      order: [['name', 'ASC']]
    });
  }

  static async searchByName(name: string, userId: number): Promise<Tag[]> {
    return this.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
        userId
      } as WhereOptions<TagAttributes>,
      order: [['name', 'ASC']]
    });
  }

  static async findByName(name: string, userId: number): Promise<Tag | null> {
    return this.findOne({
      where: {
        name,
        userId
      } as WhereOptions<TagAttributes>
    });
  }

  static async getAllActive(userId: number): Promise<Tag[]> {
    return this.findAll({
      where: {
        userId
      } as WhereOptions<TagAttributes>,
      order: [['name', 'ASC']]
    });
  }

  static async getByColor(color: string, userId: number): Promise<Tag[]> {
    return this.findAll({
      where: {
        color,
        userId
      } as WhereOptions<TagAttributes>,
      order: [['name', 'ASC']]
    });
  }
}

Tag.init({
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
  color: {
    type: DataTypes.STRING,
    allowNull: true,
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
  tableName: 'tags',
  underscored: true,
  paranoid: true,
  indexes: [
    {
      fields: ['user_id', 'deleted_at']
    },
    {
      fields: ['user_id', 'name'],
      unique: true
    },
    {
      fields: ['user_id', 'color']
    }
  ]
});