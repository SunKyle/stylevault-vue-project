import { Table, Column, DataType, ForeignKey, BelongsTo, AllowNull, Index, Unique } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { Outfit } from './Outfit';
import { Clothing } from './Clothing';

/**
 * 搭配-衣物关联模型
 * 定义搭配与衣物之间的多对多关系，包含排序权重等额外信息
 */
@Table({
  tableName: 'outfit_clothing',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_outfit_clothing_outfit_id', fields: ['outfit_id'] },
    { name: 'idx_outfit_clothing_clothing_id', fields: ['clothing_id'] },
    { name: 'idx_outfit_clothing_unique', fields: ['outfit_id', 'clothing_id'], unique: true },
    { name: 'idx_outfit_clothing_order', fields: ['outfit_id', 'position'] }
  ]
})
export class OutfitClothing extends BaseModel<OutfitClothing> {
  /**
   * 搭配ID
   */
  @ForeignKey(() => Outfit)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'outfit_id',
    comment: '搭配ID'
  })
  outfitId!: number;

  /**
   * 衣物ID
   */
  @ForeignKey(() => Clothing)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'clothing_id',
    comment: '衣物ID'
  })
  clothingId!: number;

  /**
   * 位置权重（用于衣物在搭配中的展示顺序）
   */
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    field: 'position',
    defaultValue: 0,
    comment: '位置权重（用于衣物在搭配中的展示顺序）'
  })
  position!: number;

  /**
   * 衣物在搭配中的区域类型（如上身、下身、外套、鞋子、配饰等）
   */
  @Column({
    type: DataType.STRING(20),
    field: 'area',
    validate: {
      len: [0, 20]
    },
    comment: '衣物在搭配中的区域类型'
  })
  area?: string;

  // ==================== 关联关系 ====================

  /**
   * 所属搭配
   */
  @BelongsTo(() => Outfit, {
    foreignKey: 'outfitId',
    as: 'outfit'
  })
  outfit!: Outfit;

  /**
   * 关联的衣物
   */
  @BelongsTo(() => Clothing, {
    foreignKey: 'clothingId',
    as: 'clothing'
  })
  clothing?: Clothing;

  // ==================== 实例方法 ====================

  /**
   * 获取关联信息的完整详情
   */
  async getFullInfo() {
    const [outfit, clothing] = await Promise.all([
      this.$get('outfit'),
      this.$get('clothing')
    ]);

    return {
      id: this.id,
      outfitId: this.outfitId,
      clothingId: this.clothingId,
      position: this.position,
      area: this.area,
      outfit: outfit ? {
        id: outfit.id,
        name: outfit.name,
        coverImageUrl: outfit.coverImageUrl
      } : null,
      clothing: clothing ? {
        id: clothing.id,
        name: clothing.name,
        brand: clothing.brand,
        mainImageUrl: clothing.mainImageUrl,
        price: clothing.price
      } : null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    };
  }

  // ==================== 静态方法 ====================

  /**
   * 根据搭配ID获取所有关联的衣物
   */
  static async findByOutfitId(outfitId: number) {
    return this.findAll({
      where: { outfitId },
      include: [
        {
          model: Clothing,
          as: 'clothing'
        }
      ],
      order: [['position', 'ASC']]
    });
  }

  /**
   * 根据衣物ID获取所有关联的搭配
   */
  static async findByClothingId(clothingId: number) {
    return this.findAll({
      where: { clothingId },
      include: [
        {
          model: Outfit,
          as: 'outfit'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 检查搭配是否包含指定衣物
   */
  static async hasClothing(outfitId: number, clothingId: number): Promise<boolean> {
    const count = await this.count({
      where: { outfitId, clothingId }
    });
    return count > 0;
  }

  /**
   * 获取搭配中的衣物数量
   */
  static async countClothingInOutfit(outfitId: number): Promise<number> {
    return this.count({
      where: { outfitId }
    });
  }

  /**
   * 批量添加衣物到搭配
   */
  static async addClothingToOutfit(outfitId: number, clothingIds: number[], areas?: string[]): Promise<OutfitClothing[]> {
    const associations = clothingIds.map((clothingId, index) => ({
      outfitId,
      clothingId,
      position: index,
      area: areas?.[index] || null
    }));

    return this.bulkCreate(associations as any, {
      ignoreDuplicates: true
    });
  }

  /**
   * 从搭配中移除衣物
   */
  static async removeClothingFromOutfit(outfitId: number, clothingIds: number[]): Promise<number> {
    return this.destroy({
      where: {
        outfitId,
        clothingId: clothingIds
      }
    });
  }

  /**
   * 更新衣物在搭配中的排序
   */
  static async updateOrder(outfitId: number, clothingOrders: { clothingId: number; position: number }[]): Promise<void> {
    const promises = clothingOrders.map(({ clothingId, position }) =>
      this.update(
        { position },
        { where: { outfitId, clothingId } }
      )
    );

    await Promise.all(promises);
  }
}