import { Table, Column, DataType, ForeignKey, BelongsTo, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { Attribute } from './Attribute';

/**
 * 实体属性关联模型
 * 用于将属性关联到具体实体（衣物、搭配等）
 */
@Table({
  tableName: 'entity_attributes',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_entity_attr_entity', fields: ['entity_type', 'entity_id'] },
    { name: 'idx_entity_attr_attribute', fields: ['attribute_id'] },
    { name: 'idx_entity_attr_unique', fields: ['entity_type', 'entity_id', 'attribute_id'], unique: true },
    { name: 'idx_entity_attr_value', fields: ['value'] }
  ]
})
export class EntityAttribute extends BaseModel<EntityAttribute> {
  /**
   * 实体类型（clothing_item, outfit, user_preferences等）
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(50),
    field: 'entity_type',
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    comment: '实体类型'
  })
  entityType!: string;

  /**
   * 实体ID
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'entity_id',
    comment: '实体ID'
  })
  entityId!: number;

  /**
   * 属性ID
   */
  @ForeignKey(() => Attribute)
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'attribute_id',
    comment: '属性ID'
  })
  attributeId!: number;

  /**
   * 属性值（实际存储的值，可能与属性的默认值不同）
   */
  @Column({
    type: DataType.JSON,
    comment: '属性值'
  })
  value?: any;

  /**
   * 属性权重（用于排序或优先级）
   */
  @Default(0)
  @Index
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0,
      max: 100
    },
    comment: '属性权重（用于排序或优先级）'
  })
  weight!: number;

  /**
   * 是否为主要属性
   */
  @Default(false)
  @Index
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_primary',
    comment: '是否为主要属性'
  })
  isPrimary!: boolean;

  /**
   * 备注信息
   */
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 500]
    },
    comment: '备注信息'
  })
  notes?: string;

  /**
   * 用户ID（冗余字段，优化查询性能）
   */
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'user_id',
    comment: '用户ID（冗余字段，优化查询）'
  })
  userId?: number;

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

  /**
   * 关联的属性
   */
  @BelongsTo(() => Attribute, {
    foreignKey: 'attributeId',
    as: 'attribute'
  })
  attribute!: Attribute;

  // ==================== 实例方法 ====================

  /**
   * 获取实体属性的完整信息
   */
  async getFullInfo() {
    const attribute = await this.$get('attribute');

    return {
      id: this.id,
      entityType: this.entityType,
      entityId: this.entityId,
      attributeId: this.attributeId,
      value: this.value,
      weight: this.weight,
      isPrimary: this.isPrimary,
      notes: this.notes,
      attribute: attribute ? {
        id: attribute.id,
        name: attribute.name,
        displayName: attribute.displayName,
        category: attribute.category,
        type: attribute.type,
        icon: attribute.icon,
        color: attribute.color
      } : null,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 获取属性的显示值
   */
  getDisplayValue() {
    if (this.value !== undefined && this.value !== null) {
      return this.value;
    }
    return this.attribute?.value;
  }

  // ==================== 静态方法 ====================

  /**
   * 根据实体类型和ID获取所有属性
   */
  static async findByEntity(entityType: string, entityId: number) {
    return this.findAll({
      where: { entityType, entityId },
      include: [
        {
          model: Attribute,
          as: 'attribute',
          required: true
        }
      ],
      order: [
        ['isPrimary', 'DESC'],
        ['weight', 'DESC'],
        [{ model: Attribute, as: 'attribute' }, 'category', 'ASC'],
        [{ model: Attribute, as: 'attribute' }, 'sortOrder', 'ASC']
      ]
    });
  }

  /**
   * 根据实体类型和ID获取主要属性
   */
  static async findPrimaryAttributes(entityType: string, entityId: number) {
    return this.findAll({
      where: { entityType, entityId, isPrimary: true },
      include: [
        {
          model: Attribute,
          as: 'attribute',
          required: true
        }
      ],
      order: [
        ['weight', 'DESC'],
        [{ model: Attribute, as: 'attribute' }, 'category', 'ASC'],
        [{ model: Attribute, as: 'attribute' }, 'sortOrder', 'ASC']
      ]
    });
  }

  /**
   * 根据属性ID获取所有关联的实体
   */
  static async findByAttributeId(attributeId: number) {
    return this.findAll({
      where: { attributeId },
      include: [
        {
          model: Attribute,
          as: 'attribute',
          required: true
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 根据分类获取实体的属性
   */
  static async findByCategory(entityType: string, entityId: number, category: string) {
    return this.findAll({
      where: { entityType, entityId },
      include: [
        {
          model: Attribute,
          as: 'attribute',
          where: { category },
          required: true
        }
      ],
      order: [
        ['weight', 'DESC'],
        [{ model: Attribute, as: 'attribute' }, 'sortOrder', 'ASC']
      ]
    });
  }

  /**
   * 检查实体是否包含指定属性
   */
  static async hasAttribute(entityType: string, entityId: number, attributeId: number): Promise<boolean> {
    const count = await this.count({
      where: { entityType, entityId, attributeId }
    });
    return count > 0;
  }

  /**
   * 批量添加属性到实体
   */
  static async addAttributesToEntity(
    entityType: string,
    entityId: number,
    attributes: Array<{
      attributeId: number;
      value?: any;
      weight?: number;
      isPrimary?: boolean;
      notes?: string;
    }>
  ): Promise<EntityAttribute[]> {
    const associations = attributes.map(attr => ({
      entityType,
      entityId,
      attributeId: attr.attributeId,
      value: attr.value,
      weight: attr.weight || 0,
      isPrimary: attr.isPrimary || false,
      notes: attr.notes || null
    }));

    return this.bulkCreate(associations as any, {
      ignoreDuplicates: true,
      updateOnDuplicate: ['value', 'weight', 'isPrimary', 'notes', 'updatedAt']
    });
  }

  /**
   * 从实体中移除属性
   */
  static async removeAttributesFromEntity(
    entityType: string,
    entityId: number,
    attributeIds: number[]
  ): Promise<number> {
    return this.destroy({
      where: {
        entityType,
        entityId,
        attributeId: attributeIds
      }
    });
  }

  /**
   * 更新实体属性的值
   */
  static async updateAttributeValue(
    entityType: string,
    entityId: number,
    attributeId: number,
    value: any
  ): Promise<[number, EntityAttribute[]]> {
    return this.update(
      { value },
      {
        where: { entityType, entityId, attributeId },
        returning: true
      }
    );
  }

  /**
   * 批量更新实体属性的权重
   */
  static async updateAttributeWeights(
    entityType: string,
    entityId: number,
    weights: { [attributeId: number]: number }
  ): Promise<void> {
    const promises = Object.entries(weights).map(([attributeId, weight]) =>
      this.update(
        { weight },
        { where: { entityType, entityId, attributeId: parseInt(attributeId) } }
      )
    );

    await Promise.all(promises);
  }

  /**
   * 设置主要属性
   */
  static async setPrimaryAttribute(
    entityType: string,
    entityId: number,
    attributeId: number
  ): Promise<void> {
    // 先清除该实体的所有主要属性标记
    await this.update(
      { isPrimary: false },
      { where: { entityType, entityId } }
    );

    // 设置新的主要属性
    await this.update(
      { isPrimary: true },
      { where: { entityType, entityId, attributeId } }
    );
  }
}