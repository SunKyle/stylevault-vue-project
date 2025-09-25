import { Clothing } from '../models/entities/Clothing';
import { Outfit } from '../models/entities/Outfit';
import { OutfitClothing } from '../models/entities/OutfitClothing';

/**
 * 搭配-服装关联查询选项
 */
export interface OutfitClothingQueryOptions {
  /** 搭配ID */
  outfitId?: number;
  /** 服装ID */
  clothingId?: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
  /** 是否包含服装信息 */
  includeClothing?: boolean;
  /** 是否包含搭配信息 */
  includeOutfit?: boolean;
}

/**
 * 搭配-服装关联仓库类，封装搭配-服装关联数据的访问逻辑
 */
export class OutfitClothingRepository {
  /**
   * 查找所有搭配-服装关联
   * @param options 查询选项
   * @returns 搭配-服装关联列表
   */
  async findAll(options: OutfitClothingQueryOptions = {}): Promise<OutfitClothing[]> {
    const { 
      outfitId, 
      clothingId, 
      sortBy = 'orderIndex', 
      sortOrder = 'ASC',
      includeClothing = false,
      includeOutfit = false
    } = options;
    
    const where: any = {};
    
    if (outfitId) {
      where.outfitId = outfitId;
    }
    
    if (clothingId) {
      where.clothingId = clothingId;
    }
    
    const findOptions: any = {
      where,
      order: [[sortBy, sortOrder]]
    };
    
    const includes: any[] = [];
    
    // 包含服装信息
    if (includeClothing) {
      includes.push({
        model: Clothing,
        as: 'clothing',
        attributes: ['id', 'name', 'category', 'imageUrl', 'price']
      });
    }
    
    // 包含搭配信息
    if (includeOutfit) {
      includes.push({
        model: Outfit,
        as: 'outfit',
        attributes: ['id', 'name', 'description', 'status']
      });
    }
    
    if (includes.length > 0) {
      findOptions.include = includes;
    }
    
    return OutfitClothing.findAll(findOptions);
  }

  /**
   * 根据ID查找搭配-服装关联
   * @param id 关联ID
   * @returns 搭配-服装关联对象或null
   */
  async findById(id: number): Promise<OutfitClothing | null> {
    return OutfitClothing.findByPk(id, {
      include: [
        {
          model: Clothing,
          as: 'clothing',
          attributes: ['id', 'name', 'category', 'imageUrl', 'price']
        },
        {
          model: Outfit,
          as: 'outfit',
          attributes: ['id', 'name', 'description', 'status']
        }
      ]
    });
  }

  /**
   * 创建新的搭配-服装关联
   * @param data 关联数据
   * @returns 创建的关联对象
   */
  async create(data: any): Promise<OutfitClothing> {
    return OutfitClothing.create(data);
  }

  /**
   * 更新搭配-服装关联
   * @param id 关联ID
   * @param data 更新数据
   * @returns 更新后的关联对象或null
   */
  async update(id: number, data: Partial<OutfitClothing>): Promise<OutfitClothing | null> {
    const outfitClothing = await this.findById(id);
    if (!outfitClothing) {
      return null;
    }
    
    return outfitClothing.update(data);
  }

  /**
   * 删除搭配-服装关联
   * @param id 关联ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const result = await OutfitClothing.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 根据搭配ID查找关联的服装
   * @param outfitId 搭配ID
   * @returns 搭配-服装关联列表
   */
  async findByOutfitId(outfitId: number): Promise<OutfitClothing[]> {
    return OutfitClothing.findAll({
      where: { outfitId },
      include: [
        {
          model: Clothing,
          as: 'clothing',
          attributes: ['id', 'name', 'category', 'imageUrl', 'price']
        }
      ],
      order: [['orderIndex', 'ASC']]
    });
  }

  /**
   * 根据服装ID查找关联的搭配
   * @param clothingId 服装ID
   * @returns 搭配-服装关联列表
   */
  async findByClothingId(clothingId: number): Promise<OutfitClothing[]> {
    return OutfitClothing.findAll({
      where: { clothingId },
      include: [
        {
          model: Outfit,
          as: 'outfit',
          attributes: ['id', 'name', 'description', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 添加服装到搭配
   * @param outfitId 搭配ID
   * @param clothingId 服装ID
   * @param orderIndex 顺序索引
   * @returns 创建的关联对象
   */
  async addClothingToOutfit(
    outfitId: number,
    clothingId: number,
    orderIndex: number = 0
  ): Promise<OutfitClothing> {
    // 先检查是否已经存在该关联
    const existing = await OutfitClothing.findOne({
      where: { outfitId, clothingId }
    });
    
    if (existing) {
      // 如果已存在，则更新顺序索引
      return existing.update({ orderIndex });
    }
    
    // 否则创建新关联
    return OutfitClothing.create({
      outfitId,
      clothingId,
      orderIndex
    } as any);
  }

  /**
   * 从搭配中移除服装
   * @param outfitId 搭配ID
   * @param clothingId 服装ID
   * @returns 是否移除成功
   */
  async removeClothingFromOutfit(outfitId: number, clothingId: number): Promise<boolean> {
    const result = await OutfitClothing.destroy({
      where: { outfitId, clothingId }
    });
    return result > 0;
  }

  /**
   * 批量添加服装到搭配
   * @param outfitId 搭配ID
   * @param clothingIds 服装ID列表
   * @returns 创建的关联对象列表
   */
  async addClothesToOutfit(
    outfitId: number,
    clothingIds: number[]
  ): Promise<OutfitClothing[]> {
    const existingRelations = await OutfitClothing.findAll({
      where: {
        outfitId,
        clothingId: clothingIds
      }
    });
    
    const existingClothingIds = new Set(existingRelations.map(rel => rel.clothingId));
    const newRelations = clothingIds
      .filter(id => !existingClothingIds.has(id))
      .map((id, index) => ({
        outfitId,
        clothingId: id,
        orderIndex: index
      }));
    
    if (newRelations.length === 0) {
      return existingRelations;
    }
    
    const created = await OutfitClothing.bulkCreate(newRelations as any[]);
    return [...existingRelations, ...created];
  }

  /**
   * 重新排序搭配中的服装
   * @param outfitId 搭配ID
   * @param clothingOrder 服装ID和顺序索引的映射
   * @returns 更新后的关联对象列表
   */
  async reorderClothesInOutfit(
    outfitId: number,
    clothingOrder: Record<number, number>
  ): Promise<OutfitClothing[]> {
    const relations = await OutfitClothing.findAll({
      where: {
        outfitId,
        clothingId: Object.keys(clothingOrder).map(Number)
      }
    });
    
    const updates = relations.map(rel => 
      rel.update({ orderIndex: clothingOrder[rel.clothingId] || 0 })
    );
    
    return Promise.all(updates);
  }

  /**
   * 清空搭配中的所有服装
   * @param outfitId 搭配ID
   * @returns 被删除的记录数量
   */
  async clearOutfitClothes(outfitId: number): Promise<number> {
    return OutfitClothing.destroy({
      where: { outfitId }
    });
  }

  /**
   * 获取搭配中服装的数量
   * @param outfitId 搭配ID
   * @returns 服装数量
   */
  async countClothesInOutfit(outfitId: number): Promise<number> {
    return OutfitClothing.count({
      where: { outfitId }
    });
  }

  /**
   * 获取搭配的完整信息
   * @param id 关联ID
   * @returns 搭配的完整信息
   */
  async getFullInfo(id: number): Promise<OutfitClothing | null> {
    return this.findById(id);
  }
}