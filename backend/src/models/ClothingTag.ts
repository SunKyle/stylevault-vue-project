import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

interface ClothingTagAttributes {
  clothingItemId: string;
  tagId: string;
}

interface ClothingTagCreationAttributes extends Partial<ClothingTagAttributes> {}

export class ClothingTag extends BaseModel<ClothingTagAttributes> {
  public clothingItemId!: string;
  public tagId!: string;

  /**
   * 获取衣物的标签
   */
  public static async getClothingItemTags(clothingItemId: string): Promise<ClothingTagAttributes[]> {
    const tags = await this.findAll({
      where: { clothingItemId },
    });
    return tags.map(tag => tag.toJSON() as ClothingTagAttributes);
  }

  /**
   * 获取标签的衣物
   */
  public static async getTagClothingItems(tagId: string): Promise<ClothingTagAttributes[]> {
    const tags = await this.findAll({
      where: { tagId },
    });
    return tags.map(tag => tag.toJSON() as ClothingTagAttributes);
  }

  /**
   * 为衣物添加标签
   */
  public static async addTagToClothingItem(
    clothingItemId: string,
    tagId: string
  ): Promise<ClothingTagAttributes> {
    const tag = await this.create({
      clothingItemId,
      tagId,
    });
    return tag.toJSON() as ClothingTagAttributes;
  }

  /**
   * 从衣物移除标签
   */
  public static async removeTagFromClothingItem(
    clothingItemId: string,
    tagId: string
  ): Promise<number> {
    return this.destroy({
      where: {
        clothingItemId,
        tagId,
      },
    });
  }
}