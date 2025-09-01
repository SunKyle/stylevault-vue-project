import { DataTypes, Op, WhereOptions } from 'sequelize';
import { BaseModel, BaseModelAttributes } from './BaseModel';
import { sequelize } from '../config/database';

export interface OutfitItemAttributes extends BaseModelAttributes {
  outfitId: number;
  clothingItemId: number;
  positionX: number;
  positionY: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

export class OutfitItem extends BaseModel<OutfitItemAttributes> implements OutfitItemAttributes {
  declare id: number;
  declare userId: number;
  declare outfitId: number;
  declare clothingItemId: number;
  declare positionX: number;
  declare positionY: number;
  declare rotation: number;
  declare scale: number;
  declare zIndex: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  static async findByOutfit(outfitId: number): Promise<OutfitItem[]> {
    return this.findAll({
      where: {
        outfitId
      } as WhereOptions<OutfitItemAttributes>,
      order: [['zIndex', 'ASC']]
    });
  }

  static async updateLayerOrder(outfitId: number, itemIds: number[]): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      for (let i = 0; i < itemIds.length; i++) {
        await this.update(
          { zIndex: i },
          {
            where: {
              id: itemIds[i],
              outfitId
            } as WhereOptions<OutfitItemAttributes>,
            transaction
          }
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async clearOutfit(outfitId: number): Promise<void> {
    await this.destroy({
      where: {
        outfitId
      } as WhereOptions<OutfitItemAttributes>
    });
  }
}

OutfitItem.init({
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
  outfitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'outfit_id',
  },
  clothingItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'clothing_item_id',
  },
  positionX: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'position_x',
  },
  positionY: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'position_y',
  },
  rotation: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'rotation',
  },
  scale: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1,
    field: 'scale',
  },
  zIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'z_index',
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
  tableName: 'outfit_items',
  underscored: true,
  paranoid: true,
  indexes: [
    {
      fields: ['outfit_id', 'deleted_at']
    },
    {
      fields: ['clothing_item_id', 'deleted_at']
    },
    {
      fields: ['outfit_id', 'z_index']
    }
  ]
});