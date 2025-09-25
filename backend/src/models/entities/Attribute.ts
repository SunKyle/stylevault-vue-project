import { Table, Column, DataType, HasMany, AllowNull, Default, Index } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { BaseModel } from '../base/BaseModel';
import { AttributeType, AttributeCategory } from '../../types/model.types';

/**
 * 属性模型
 * 定义系统支持的属性类型，如颜色、材质、风格等
 */
@Table({
  tableName: 'attributes',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_attribute_category', fields: ['category'] },
    { name: 'idx_attribute_type', fields: ['type'] },
    { name: 'idx_attribute_name', fields: ['name'] },
    { name: 'idx_attribute_category_name', fields: ['category', 'name'], unique: true }
  ]
})
export class Attribute extends BaseModel<Attribute> {
  /**
   * 属性名称
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [1, 100],
      notEmpty: true
    },
    comment: '属性名称'
  })
  name!: string;

  /**
   * 属性显示名称（多语言支持）
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [1, 100],
      notEmpty: true
    },
    field: 'display_name',
    comment: '属性显示名称'
  })
  displayName!: string;

  /**
   * 属性分类
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    comment: '属性分类'
  })
  category!: string;

  /**
   * 属性类型
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.ENUM(...Object.values(AttributeType)),
    comment: '属性类型'
  })
  type!: AttributeType;

  /**
   * 属性值（JSON格式，支持复杂数据结构）
   */
  @Column({
    type: DataType.JSON,
    defaultValue: {},
    comment: '属性值（JSON格式）'
  })
  value?: any;

  /**
   * 层级路径（用于快速层级查询）
   */
  @Index
  @Column({
    type: DataType.STRING(500),
    field: 'path',
    comment: '层级路径（如：1/2/3）'
  })
  path?: string;

  /**
   * 层级深度
   */
  @Default(0)
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'level',
    comment: '层级深度（0为根节点）'
  })
  level!: number;

  /**
   * 属性描述
   */
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 500]
    },
    comment: '属性描述'
  })
  description?: string;

  /**
   * 是否系统属性（用户不可删除）
   */
  @Default(false)
  @Index
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_system',
    comment: '是否系统属性'
  })
  isSystem!: boolean;

  /**
   * 排序权重（用于前端展示排序）
   */
  @Default(0)
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'sort_order',
    comment: '排序权重'
  })
  sortOrder!: number;

  /**
   * 图标URL或图标名称
   */
  @Column({
    type: DataType.STRING(255),
    validate: {
      len: [0, 255]
    },
    comment: '图标URL或图标名称'
  })
  icon?: string;

  /**
   * 颜色值（用于颜色类属性）
   */
  @Column({
    type: DataType.STRING(7),
    validate: {
      len: [0, 7],
      is: /^#[0-9A-Fa-f]{6}$/
    },
    comment: '颜色值（十六进制）'
  })
  color?: string;

  /**
   * 父级属性ID（用于层级结构）
   */
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'parent_id',
    comment: '父级属性ID'
  })
  parentId?: number;

  /**
   * 是否启用
   */
  @Default(true)
  @Index
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_active',
    comment: '是否启用'
  })
  enabled!: boolean;

  /**
   * 元数据（扩展信息）
   */
  @Column({
    type: DataType.JSON,
    defaultValue: {},
    comment: '元数据（扩展信息）'
  })
  metadata?: any;

  // ==================== 关联关系 ====================

  

  // ==================== 实例方法 ====================

  /**
   * 获取属性的完整信息
   */
  async getFullInfo() {
    const usageCount = await this.$count('entityAttributes');

    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      category: this.category,
      type: this.type,
      value: this.value,
      description: this.description,
      isSystem: this.isSystem,
      sortOrder: this.sortOrder,
      icon: this.icon,
      color: this.color,
      parentId: this.parentId,
      enabled: this.enabled,
      metadata: this.metadata,
      usageCount: usageCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 检查属性是否被使用
   */
  async isUsed(): Promise<boolean> {
    const count = await this.$count('entityAttributes');
    return count > 0;
  }

  // ==================== 静态方法 ====================

  /**
   * 根据分类获取属性
   */
  static async findByCategory(category: string) {
    return this.findAll({
      where: { category, enabled: true },
      order: [['sortOrder', 'ASC'], ['displayName', 'ASC']]
    });
  }

  /**
   * 根据类型获取属性
   */
  static async findByType(type: AttributeType) {
    return this.findAll({
      where: { type, enabled: true },
      order: [['sortOrder', 'ASC'], ['displayName', 'ASC']]
    });
  }

  /**
   * 获取系统属性
   */
  static async findSystemAttributes() {
    return this.findAll({
      where: { isSystem: true, enabled: true },
      order: [['category', 'ASC'], ['sortOrder', 'ASC']]
    });
  }

  /**
   * 获取用户可自定义属性
   */
  static async findCustomizableAttributes() {
    return this.findAll({
      where: { isSystem: false, enabled: true },
      order: [['category', 'ASC'], ['sortOrder', 'ASC']]
    });
  }

  /**
   * 根据名称查找属性
   */
  static async findByName(name: string, category?: AttributeCategory) {
    const where: any = { name };
    if (category) {
      where.category = category;
    }

    return this.findOne({ where });
  }

  /**
   * 根据显示名称查找属性
   */
  static async findByDisplayName(displayName: string, category?: AttributeCategory) {
    const where: any = { displayName };
    if (category) {
      where.category = category;
    }

    return this.findOne({ where });
  }

  /**
   * 获取属性树结构（支持层级）
   */
  static async getAttributeTree(category?: AttributeCategory) {
    const where: any = { enabled: true };
    if (category) {
      where.category = category;
    }

    const attributes = await this.findAll({
      where,
      order: [['category', 'ASC'], ['parentId', 'ASC'], ['sortOrder', 'ASC']]
    });

    const tree: any[] = [];
    const map: Record<number, any> = {};

    // 创建节点映射
    attributes.forEach(attr => {
      const node = {
        ...attr.toJSON(),
        children: []
      };
      map[attr.id] = node;

      if (!attr.parentId) {
        tree.push(node);
      } else if (map[attr.parentId]) {
        map[attr.parentId].children.push(node);
      }
    });

    return tree;
  }

  /**
   * 搜索属性
   */
  static async searchAttributes(query: string, category?: AttributeCategory) {
    const where: any = {
      enabled: true,
      [(this.sequelize as any).Op.or]: [
        { name: { [(this.sequelize as any).Op.like]: `%${query}%` } },
        { displayName: { [(this.sequelize as any).Op.like]: `%${query}%` } },
        { description: { [(this.sequelize as any).Op.like]: `%${query}%` } }
      ]
    };

    if (category) {
      where.category = category;
    }

    return this.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['displayName', 'ASC']]
    });
  }
}