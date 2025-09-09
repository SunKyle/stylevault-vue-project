import { Attribute } from '../models/entities/Attribute';

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
   * 获取衣物类型枚举值
   */
  async getClothingTypes(): Promise<EnumValue[]> {
    // 由于attributes表中没有clothing_type分类，我们使用scene分类作为替代
    // 或者返回一个预定义的衣物类型列表
    return [
      { value: 'top', label: '上装', color: '#4169E1', icon: 'tshirt' },
      { value: 'bottom', label: '下装', color: '#8B4513', icon: 'pants' },
      { value: 'dress', label: '连衣裙', color: '#DA70D6', icon: 'dress' },
      { value: 'outerwear', label: '外套', color: '#2F4F4F', icon: 'jacket' },
      { value: 'shoes', label: '鞋履', color: '#8B4513', icon: 'shoe' },
      { value: 'accessories', label: '配饰', color: '#FFD700', icon: 'accessory' },
      { value: 'bag', label: '包包', color: '#8B4513', icon: 'bag' },
      { value: 'hat', label: '帽子', color: '#8B4513', icon: 'hat' }
    ];
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