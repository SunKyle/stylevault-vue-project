import { Attribute } from '../models/entities/Attribute';

/**
 * 属性查询选项
 */
export interface AttributeQueryOptions {
  /** 属性分类 */
  category?: string;
  /** 属性类型 */
  type?: string;
  /** 是否启用 */
  enabled?: boolean;
  /** 父属性ID */
  parentId?: number | null;
  /** 是否包含子属性 */
  includeChildren?: boolean;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
  /** 分页页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 属性仓库类，封装属性数据的访问逻辑
 */
export class AttributeRepository {
  /**
   * 查找所有属性
   * @param options 查询选项
   * @returns 属性列表
   */
  async findAll(options: AttributeQueryOptions = {}): Promise<Attribute[]> {
    const { category, type, enabled, parentId, sortBy = 'name', sortOrder = 'ASC', page, pageSize } = options;
    
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (enabled !== undefined) {
      where.enabled = enabled;
    }
    
    if (parentId !== undefined) {
      where.parentId = parentId;
    }
    
    const findOptions: any = {
      where,
      order: [[sortBy, sortOrder]]
    };
    
    if (page !== undefined && pageSize !== undefined) {
      findOptions.offset = (page - 1) * pageSize;
      findOptions.limit = pageSize;
    }
    
    // 如果需要包含子属性
    if (options.includeChildren) {
      findOptions.include = [
        {
          model: Attribute,
          as: 'children',
          order: [['name', 'ASC']]
        }
      ];
    }
    
    return Attribute.findAll(findOptions);
  }

  /**
   * 根据ID查找属性
   * @param id 属性ID
   * @returns 属性对象或null
   */
  async findById(id: number): Promise<Attribute | null> {
    return Attribute.findByPk(id);
  }

  /**
   * 创建新属性
   * @param data 属性数据
   * @returns 创建的属性对象
   */
  async create(data: any): Promise<Attribute> {
    return Attribute.create(data);
  }

  /**
   * 更新属性
   * @param id 属性ID
   * @param data 更新数据
   * @returns 更新后的属性对象或null
   */
  async update(id: number, data: Partial<Attribute>): Promise<Attribute | null> {
    const attribute = await this.findById(id);
    if (!attribute) {
      return null;
    }
    
    return attribute.update(data);
  }

  /**
   * 删除属性
   * @param id 属性ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const result = await Attribute.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 根据分类查找属性
   * @param category 属性分类
   * @returns 属性列表
   */
  async findByCategory(category: string): Promise<Attribute[]> {
    return Attribute.findAll({
      where: { category },
      order: [['name', 'ASC']]
    });
  }

  /**
   * 获取属性树结构
   * @returns 属性树结构
   */
  async getAttributeTree(): Promise<Attribute[]> {
    const allAttributes = await Attribute.findAll({
      order: [['name', 'ASC']]
    });
    
    const attributeMap = new Map<number, Attribute>();
    const tree: Attribute[] = [];
    
    // 构建属性映射
    allAttributes.forEach(attribute => {
      attributeMap.set(attribute.id, attribute);
      const attributeWithChildren = attribute as Attribute & { children: Attribute[] };
      attributeWithChildren.children = [];
    });
    
    // 构建属性树
    allAttributes.forEach(attribute => {
      if (attribute.parentId === null) {
        tree.push(attribute);
      } else if (attribute.parentId && attributeMap.has(attribute.parentId)) {
        const parent = attributeMap.get(attribute.parentId);
        if (parent) {
          const parentWithChildren = parent as Attribute & { children: Attribute[] };
          parentWithChildren.children.push(attribute);
        }
      }
    });
    
    return tree;
  }

  /**
   * 检查属性是否被使用
   * @param attributeId 属性ID
   * @returns 是否被使用
   */
  async isAttributeUsed(attributeId: number): Promise<boolean> {
    // 这里应该检查属性是否被服装或搭配使用
    // 由于没有直接的关联，这里简化实现
    return false;
  }

  /**
   * 批量创建属性
   * @param attributes 属性数据列表
   * @returns 创建的属性对象列表
   */
  async bulkCreate(attributes: any[]): Promise<Attribute[]> {
    return Attribute.bulkCreate(attributes, {
      ignoreDuplicates: true
    });
  }

  /**
   * 查找多个ID的属性
   * @param ids 属性ID列表
   * @returns 属性列表
   */
  async findByIds(ids: number[]): Promise<Attribute[]> {
    return Attribute.findAll({
      where: {
        id: ids
      },
      order: [['name', 'ASC']]
    });
  }

  /**
   * 查找热门属性
   * @param limit 返回数量
   * @returns 热门属性列表
   */
  async findPopularAttributes(limit: number = 10): Promise<Attribute[]> {
    // 简化实现，实际应该根据使用频率排序
    return Attribute.findAll({
      limit,
      order: [['name', 'ASC']]
    });
  }

  /**
   * 获取属性统计信息
   * @returns 属性统计信息
   */
  async getAttributeStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    withChildren: number;
  }> {
    const total = await Attribute.count();
    
    // 获取分类统计
    const categories = await Attribute.findAll({
      attributes: ['category', [Attribute.sequelize!.fn('COUNT', '*'), 'count']],
      group: ['category']
    });
    
    const byCategory: Record<string, number> = {};
    categories.forEach((category: any) => {
      byCategory[category.category] = category.dataValues.count;
    });
    
    // 获取有子属性的属性数量
    const withChildren = await Attribute.count({
      where: {
        id: {
          '$in': await Attribute.findAll({
            attributes: ['parentId'],
            where: {
              parentId: {
                '$ne': null
              }
            },
            raw: true
          }).then(results => results.map((r: any) => r.parentId))
        }
      }
    });
    
    return {
      total,
      byCategory,
      withChildren
    };
  }
}