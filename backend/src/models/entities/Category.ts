import { Table, Column, DataType, HasMany, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { ClothingItem } from './ClothingItem';

/**
 * 衣物分类实体
 * 定义衣物的主要分类，如上衣、裤子、鞋子等
 */
@Table({
  tableName: 'categories',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_category_name', fields: ['name'] },
    { name: 'idx_category_slug', fields: ['slug'], unique: true },
    { name: 'idx_category_parent', fields: ['parent_id'] }
  ]
})
export class Category extends BaseModel<Category> {
  /**
   * 分类名称
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [1, 100],
      notEmpty: true
    },
    comment: '分类名称'
  })
  name!: string;

  /**
   * 分类英文标识符
   */
  @AllowNull(false)
  @Index({ unique: true })
  @Column({
    type: DataType.STRING(50),
    validate: {
      len: [1, 50],
      notEmpty: true,
      is: /^[a-z0-9-]+$/
    },
    comment: '分类英文标识符'
  })
  slug!: string;

  /**
   * 分类描述
   */
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 500]
    },
    comment: '分类描述'
  })
  description?: string;

  /**
   * 父级分类ID（用于层级结构）
   */
  @Index
  @Column({
    type: DataType.INTEGER,
    field: 'parent_id',
    comment: '父级分类ID'
  })
  parentId?: number;

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
   * 排序权重
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
   * 是否启用
   */
  @Default(true)
  @Index
  @Column({
    type: DataType.BOOLEAN,
    comment: '是否启用'
  })
  enabled!: boolean;

  /**
   * 分类下物品数量统计
   */
  @Default(0)
  @Index
  @Column({
    type: DataType.INTEGER,
    comment: '分类下物品数量统计'
  })
  itemCount!: number;

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
   * 父级分类
   */
  // @BelongsTo(() => Category, 'parentId')
  // parent?: Category;

  /**
   * 子级分类
   */
  // @HasMany(() => Category, 'parentId')
  // children?: Category[];

  /**
   * 该分类下的衣物
   */
  @HasMany(() => ClothingItem, 'categoryId')
  clothingItems?: ClothingItem[];

  // ==================== 实例方法 ====================

  /**
   * 获取分类的完整信息
   */
  async getFullInfo(): Promise<any> {
    const clothingItems = await this.$get('clothingItems');
    return {
      ...this.toJSON(),
      itemCount: clothingItems?.length || 0,
      clothingItems: clothingItems || []
    };
  }

  /**
   * 获取分类统计信息
   */
  async getStats(): Promise<any> {
    const clothingItems = await this.$get('clothingItems');
    const items: any[] = clothingItems || [];
    const totalValue = items.reduce((sum: number, item: any) => sum + (item?.price || 0), 0);
    return {
      totalItems: items.length,
      totalValue,
      averagePrice: items.length > 0 ? totalValue / items.length : 0
    };
  }

  /**
   * 获取分类的层级路径
   */
  async getHierarchyPath(): Promise<Category[]> {
    const path: Category[] = [this];
    let current: Category = this;
    
    while (current.parentId) {
      try {
        const parent = await Category.findByPk(current.parentId);
        if (parent) {
          path.unshift(parent);
          current = parent;
        } else {
          break;
        }
      } catch (error) {
        break;
      }
    }
    
    return path;
  }

  // ==================== 类方法 ====================

  /**
   * 获取所有启用的分类
   */
  static async getAllEnabled() {
    return this.findAll({
      where: { enabled: true },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
  }

  /**
   * 根据slug获取分类
   */
  static async findBySlug(slug: string) {
    return this.findOne({
      where: { slug, enabled: true }
    });
  }

  /**
   * 获取分类树形结构
   */
  static async getCategoryTree() {
    const categories = await this.getAllEnabled();
    const categoryMap = new Map();
    
    // 创建映射
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category.toJSON(),
        children: []
      });
    });
    
    const tree: any[] = [];
    
    // 构建树形结构
    categories.forEach(category => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        categoryMap.get(category.parentId).children.push(categoryMap.get(category.id));
      } else {
        tree.push(categoryMap.get(category.id));
      }
    });
    
    return tree;
  }

  /**
   * 获取分类及其子分类的所有ID
   */
  static async getCategoryAndChildrenIds(categoryId: number) {
    const category = await this.findByPk(categoryId);
    if (!category) return [categoryId];
    
    const children = await this.findAll({
      where: { parentId: categoryId, enabled: true }
    });
    
    let ids = [categoryId];
    
    for (const child of children) {
      const childIds = await this.getCategoryAndChildrenIds(child.id);
      ids = [...ids, ...childIds];
    }
    
    return ids;
  }
}