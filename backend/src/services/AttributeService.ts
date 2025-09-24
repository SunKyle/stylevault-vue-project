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
    try {
      // 由于Category模型已移除，这里返回空数组或默认值
      // 实际项目中应根据新的数据结构调整
      return [
        { value: '1', label: '上衣' },
        { value: '2', label: '裤子' },
        { value: '3', label: '裙子' },
        { value: '4', label: '鞋子' },
        { value: '5', label: '配件' }
      ];

      /* 或者，如果有新的数据来源，可以从其他地方获取
      // 示例：从Attribute表获取服装类型
      const clothingTypeAttributes = await Attribute.findAll({
        where: {
          category: 'clothing_type',
          enabled: true
        },
        order: [['sortOrder', 'ASC']]
      });

      return clothingTypeAttributes.map(attr => ({
        value: attr.value,
        label: attr.displayName || attr.name,
        icon: attr.icon || undefined,
        metadata: attr.metadata || {}
      }));
      */
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