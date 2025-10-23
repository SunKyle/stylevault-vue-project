import { Attribute } from '../models/entities/Attribute';
import { attributeRepository } from '../repositories';
import logger from '../utils/logger';

// 枚举值接口
export interface EnumValue {
  value: string;
  label: string;
  color?: string;
  icon?: string;
  metadata?: any;
}

// 属性查询选项接口
export interface AttributeQueryOptions {
  name?: string;
  type?: string;
  enabled?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
}

// 属性创建数据接口
export interface AttributeCreateData {
  name: string;
  type: string;
  description?: string;
  values?: string[];
  enabled?: boolean;
}

// 属性更新数据接口
export interface AttributeUpdateData {
  name?: string;
  type?: string;
  description?: string;
  values?: string[];
  enabled?: boolean;
}

export class AttributeService {
  /**
   * 创建新属性
   */
  async create(data: AttributeCreateData): Promise<Attribute> {
    try {
      // 检查属性名称是否已存在
      const allAttributes = await attributeRepository.findAll({});
      const attributeWithSameName = allAttributes.find(attr => attr.name === data.name);
      if (attributeWithSameName) {
        throw new Error(`属性名称 "${data.name}" 已存在`);
      }

      const attributeData: any = {
        name: data.name,
        type: data.type,
        description: data.description || '',
        value: data.values || [],
        enabled: data.enabled !== undefined ? data.enabled : true
      };

      const attribute = await attributeRepository.create(attributeData);
      logger.info(`创建属性 "${data.name}" 成功`);
      return attribute;
    } catch (error) {
      logger.error(`创建属性失败:`, error);
      throw new Error(`创建属性失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取所有属性
   */
  async getAll(options: AttributeQueryOptions = {}): Promise<Attribute[]> {
    try {
      // 转换查询选项，将name转换为适合仓库的格式
      const repositoryOptions: any = { ...options };
      if (repositoryOptions.name) {
        // 由于仓库没有按名称查找的方法，我们在这里处理
        // 注意：这不是最高效的方式，但为了兼容性暂时这样处理
        const allAttributes = await attributeRepository.findAll({});
        const filteredAttributes = allAttributes.filter(attr => 
          attr.name.toLowerCase().includes(repositoryOptions.name.toLowerCase())
        );
        logger.info(`获取属性列表成功，共 ${filteredAttributes.length} 条记录`);
        return filteredAttributes;
      }
      
      const attributes = await attributeRepository.findAll(repositoryOptions);
      logger.info(`获取属性列表成功，共 ${attributes.length} 条记录`);
      return attributes;
    } catch (error) {
      logger.error(`获取属性列表失败:`, error);
      throw new Error(`获取属性列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据ID获取属性
   */
  async getById(id: number): Promise<Attribute | null> {
    try {
      const attribute = await attributeRepository.findById(id);
      if (!attribute) {
        logger.warn(`未找到ID为 ${id} 的属性`);
        return null;
      }
      logger.info(`获取属性ID ${id} 成功`);
      return attribute;
    } catch (error) {
      logger.error(`获取属性ID ${id} 失败:`, error);
      throw new Error(`获取属性失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据名称获取属性
   */
  async getByName(name: string): Promise<Attribute | null> {
    try {
      const attributes = await attributeRepository.findAll({});
      const attribute = attributes.find(attr => attr.name === name);
      if (!attribute) {
        logger.warn(`未找到名称为 "${name}" 的属性`);
        return null;
      }
      logger.info(`获取属性名称 "${name}" 成功`);
      return attribute;
    } catch (error) {
      logger.error(`获取属性名称 "${name}" 失败:`, error);
      throw new Error(`获取属性失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据类型获取属性
   */
  async getByType(type: string, options: AttributeQueryOptions = {}): Promise<Attribute[]> {
    try {
      const typeOptions = {
        ...options,
        type
      };
      const attributes = await attributeRepository.findAll(typeOptions);
      logger.info(`获取类型为 "${type}" 的属性列表成功，共 ${attributes.length} 条记录`);
      return attributes;
    } catch (error) {
      logger.error(`获取属性列表失败:`, error);
      throw new Error(`获取属性列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更新属性
   */
  async update(id: number, data: AttributeUpdateData): Promise<Attribute | null> {
    try {
      // 先检查属性是否存在
      const existingAttribute = await this.getById(id);
      if (!existingAttribute) {
        throw new Error(`属性ID ${id} 不存在`);
      }

      // 如果更新名称，检查新名称是否已存在
      if (data.name && data.name !== existingAttribute.name) {
        const attributes = await attributeRepository.findAll({});
        const attributeWithSameName = attributes.find(attr => attr.name === data.name);
        if (attributeWithSameName) {
          throw new Error(`属性名称 "${data.name}" 已存在`);
        }
      }

      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.values !== undefined) updateData.value = data.values;
      if (data.enabled !== undefined) updateData.enabled = data.enabled;

      const updatedAttribute = await attributeRepository.update(id, updateData);
      logger.info(`更新属性ID ${id} 成功`);
      return updatedAttribute;
    } catch (error) {
      logger.error(`更新属性ID ${id} 失败:`, error);
      throw new Error(`更新属性失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 删除属性
   */
  async delete(id: number): Promise<boolean> {
    try {
      // 先检查属性是否存在
      const existingAttribute = await this.getById(id);
      if (!existingAttribute) {
        throw new Error(`属性ID ${id} 不存在`);
      }

      const result = await attributeRepository.delete(id);
      logger.info(`删除属性ID ${id} 成功`);
      return result;
    } catch (error) {
      logger.error(`删除属性ID ${id} 失败:`, error);
      throw new Error(`删除属性失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 切换属性启用状态
   */
  async toggleActive(id: number): Promise<Attribute | null> {
    try {
      const attribute = await this.getById(id);
      if (!attribute) {
        throw new Error(`属性ID ${id} 不存在`);
      }

      const updatedAttribute = await attributeRepository.update(id, {
        enabled: !attribute.enabled
      });
      logger.info(`切换属性ID ${id} 的启用状态为 ${!attribute.enabled} 成功`);
      return updatedAttribute;
    } catch (error) {
      logger.error(`切换属性启用状态失败:`, error);
      throw new Error(`切换属性启用状态失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 添加属性值
   */
  async addValue(id: number, value: string): Promise<Attribute | null> {
    try {
      const attribute = await this.getById(id);
      if (!attribute) {
        throw new Error(`属性ID ${id} 不存在`);
      }

      // 检查值是否已存在
      const existingValues = attribute.value || [];
      if (existingValues.includes(value)) {
        throw new Error(`属性值 "${value}" 已存在`);
      }

      // 添加新值
      const updatedValues = [...existingValues, value];
      const updatedAttribute = await attributeRepository.update(id, {
        value: updatedValues
      });
      logger.info(`向属性ID ${id} 添加值 "${value}" 成功`);
      return updatedAttribute;
    } catch (error) {
      logger.error(`添加属性值失败:`, error);
      throw new Error(`添加属性值失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 移除属性值
   */
  async removeValue(id: number, value: string): Promise<Attribute | null> {
    try {
      const attribute = await this.getById(id);
      if (!attribute) {
        throw new Error(`属性ID ${id} 不存在`);
      }

      // 确保值是数组格式
      let existingValues: string[] = [];
      if (attribute.value && Array.isArray(attribute.value)) {
        existingValues = attribute.value;
      }

      // 检查值是否存在
      if (!existingValues.includes(value)) {
        throw new Error(`属性值 "${value}" 不存在`);
      }

      // 移除值
      const updatedValues = existingValues.filter(v => v !== value);
      const updatedAttribute = await attributeRepository.update(id, {
        value: updatedValues
      });
      logger.info(`从属性ID ${id} 移除值 "${value}" 成功`);
      return updatedAttribute;
    } catch (error) {
      logger.error(`移除属性值失败:`, error);
      throw new Error(`移除属性值失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 批量获取属性
   */
  async getByIds(ids: number[]): Promise<Attribute[]> {
    try {
      const attributes = await attributeRepository.findByIds(ids);
      logger.info(`批量获取属性成功，共 ${attributes.length} 条记录`);
      return attributes;
    } catch (error) {
      logger.error(`批量获取属性失败:`, error);
      throw new Error(`批量获取属性失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取属性统计信息
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    typeDistribution: Record<string, number>;
  }> {
    try {
      // 使用仓库提供的getAttributeStats方法
      const stats = await attributeRepository.getAttributeStats();
      
      // 转换为所需的格式
      const activeCount = await Attribute.count({ where: { enabled: true } });
      const result = {
        total: stats.total,
        active: activeCount,
        inactive: stats.total - activeCount,
        typeDistribution: stats.byCategory
      };
      
      logger.info(`获取属性统计信息成功`);
      return result;
    } catch (error) {
      logger.error(`获取属性统计信息失败:`, error);
      throw new Error(`获取属性统计信息失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取指定分类的枚举值
   */
  async getEnumValues(category: string): Promise<EnumValue[]> {
    try {
      // 使用attributeRepository而不是直接使用Attribute模型
      // 注意：数据库使用category列区分类型，is_active列标识是否启用
      const attributes = await attributeRepository.findAll({
        category: category,
        enabled: true
      });

      return attributes.map(attr => ({
        value: attr.id.toString(), // 使用ID作为value
        label: attr.displayName || attr.name,
        color: attr.color,
        icon: attr.icon,
        metadata: attr.metadata || {}
      }));
    } catch (error) {
      logger.error(`获取 ${category} 枚举值失败:`, error);
      throw new Error(`获取 ${category} 枚举值失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取衣物类型枚举值
   */
  async getClothingTypes(): Promise<EnumValue[]> {
    return this.getEnumValues('clothing_type');
  }

  /**
   * 获取衣物大类枚举值
   */
  async getCategories(): Promise<EnumValue[]> {
    return this.getEnumValues('category');
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
   * 获取尺寸枚举值
   */
  async getSizes(): Promise<EnumValue[]> {
    return this.getEnumValues('size');
  }

  /**
   * 获取所有枚举值
   */
  async getAllEnums(): Promise<Record<string, EnumValue[]>> {
    try {
      // 确保变量顺序和函数调用顺序完全匹配
      const seasons = await this.getSeasons();
      const occasions = await this.getOccasions();
      const styles = await this.getStyles();
      const scenes = await this.getScenes();
      const colors = await this.getColors();
      const materials = await this.getMaterials();
      const categories = await this.getCategories();
      const sizes = await this.getSizes();

      return {
        seasons,
        occasions,
        styles,
        scenes,
        colors,
        materials,
        categories,
        sizes
      };
    } catch (error) {
      logger.error('获取所有枚举值失败:', error);
      throw new Error('获取所有枚举值失败');
    }
  }
}