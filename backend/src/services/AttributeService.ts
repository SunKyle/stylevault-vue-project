import { Attribute } from '../models/entities/Attribute';
import { Category } from '../models/entities/Category';

export interface EnumValue {
  value: string;
  label: string;
  color?: string;
  icon?: string;
  metadata?: any;
}

export class AttributeService {
  /**
   * 获取指定分类的枚举值
   */
  async getEnumValues(category: string): Promise<EnumValue[]> {
    try {
      const attributes = await Attribute.findAll({
      where: {
        category,
        enabled: true
      },
      order: [['sortOrder', 'ASC']]
    });

      return attributes.map(attr => ({
        value: attr.value || attr.name.toLowerCase().replace(/\s+/g, '_'),
        label: attr.displayName || attr.name,
        color: attr.color || undefined,
        icon: attr.icon || undefined,
        metadata: attr.metadata || {}
      }));
    } catch (error) {
      console.error(`获取 ${category} 枚举值失败:`, error);
      throw new Error(`获取 ${category} 枚举值失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取衣物类型枚举值 - 从categories表获取
   */
  async getClothingTypes(): Promise<EnumValue[]> {
    try {
      const categories = await Category.findAll({
        where: { enabled: true },
        order: [['sortOrder', 'ASC']]
      });

      return categories.map(category => ({
        value: category.id.toString(),
        label: category.name,
        icon: category.icon || undefined,
        metadata: {
          id: category.id,
          description: category.description,
          slug: category.slug
        }
      }));
    } catch (error) {
      console.error('获取衣物类型失败:', error);
      throw new Error('获取衣物类型失败');
    }
  }

  /**
   * 获取季节枚举值
   */
  async getSeasons(): Promise<EnumValue[]> {
    return this.getEnumValues('season');
  }

  /**
   * 获取场合枚举值
   */
  async getOccasions(): Promise<EnumValue[]> {
    return this.getEnumValues('occasion');
  }

  /**
   * 获取风格枚举值
   */
  async getStyles(): Promise<EnumValue[]> {
    return this.getEnumValues('style');
  }

  /**
   * 获取场景枚举值
   */
  async getScenes(): Promise<EnumValue[]> {
    return this.getEnumValues('scene');
  }

  /**
   * 获取颜色枚举值
   */
  async getColors(): Promise<EnumValue[]> {
    return this.getEnumValues('color');
  }

  /**
   * 获取材质枚举值
   */
  async getMaterials(): Promise<EnumValue[]> {
    return this.getEnumValues('material');
  }

  /**
   * 获取所有枚举值
   */
  async getAllEnums(): Promise<Record<string, EnumValue[]>> {
    try {
      const [clothingTypes, seasons, occasions, styles, scenes, colors, materials] = await Promise.all([
        this.getClothingTypes(),
        this.getSeasons(),
        this.getOccasions(),
        this.getStyles(),
        this.getScenes(),
        this.getColors(),
        this.getMaterials()
      ]);

      return {
        clothingTypes,
        seasons,
        occasions,
        styles,
        scenes,
        colors,
        materials
      };
    } catch (error) {
      console.error('获取所有枚举值失败:', error);
      throw new Error('获取所有枚举值失败');
    }
  }
}