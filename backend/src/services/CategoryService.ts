import logger from '../utils/logger';
import { Attribute } from '../models/entities/Attribute';
import { attributeRepository } from '../repositories';
import type { AttributeQueryOptions } from '../repositories/AttributeRepository';

// 分类查询选项接口
export interface CategoryQueryOptions {
  parentId?: number | null;
  name?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

// 分类创建数据接口
export interface CategoryCreateData {
  name: string;
  description?: string;
  parentId?: number | null;
  icon?: string;
  isActive?: boolean;
  level?: number;
}

// 分类更新数据接口
export interface CategoryUpdateData {
  name?: string;
  description?: string;
  parentId?: number | null;
  icon?: string;
  isActive?: boolean;
}

export class CategoryService {
  /**
   * 创建新分类
   */
  async create(data: CategoryCreateData): Promise<Attribute> {
    try {
      // 检查分类名称是否已存在
      const existingCategory = await attributeRepository.findAll({
        category: 'category',
        sortBy: 'name',
        sortOrder: 'ASC'
      });
      
      const nameExists = existingCategory.some(cat => cat.name === data.name);
      if (nameExists) {
        throw new Error(`分类名称 "${data.name}" 已存在`);
      }

      // 如果有父分类ID，验证父分类是否存在
      if (data.parentId !== undefined && data.parentId !== null) {
        const parentCategory = await this.getById(data.parentId);
        if (!parentCategory) {
          throw new Error(`父分类ID ${data.parentId} 不存在`);
        }
      }

      const categoryData: any = {
        name: data.name,
        displayName: data.name,
        category: 'category',
        type: 'category',
        description: data.description || '',
        parentId: data.parentId,
        icon: data.icon || null,
        enabled: data.isActive !== undefined ? data.isActive : true,
        level: data.level || 0,
        value: {}
      };

      const category = await attributeRepository.create(categoryData);
      logger.info(`创建分类 "${data.name}" 成功`);
      return category;
    } catch (error) {
      logger.error(`创建分类失败:`, error);
      throw new Error(`创建分类失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取所有分类
   */
  async getAll(options: CategoryQueryOptions = {}): Promise<Attribute[]> {
    try {
      const queryOptions = {
        category: 'category',
        sortBy: options.sortBy || 'name',
        sortOrder: options.sortOrder || 'ASC'
      };
      
      if (options.parentId !== undefined) {
        (queryOptions as any).parentId = options.parentId;
      }
      
      if (options.name) {
        // 简化实现，实际应根据AttributeRepository的功能调整
        const allCategories = await attributeRepository.findAll(queryOptions);
        const filtered = allCategories.filter(cat => 
          cat.name.toLowerCase().includes(options.name!.toLowerCase())
        );
        logger.info(`获取分类列表成功，共 ${filtered.length} 条记录`);
        return filtered;
      }
      
      const categories = await attributeRepository.findAll(queryOptions);
      logger.info(`获取分类列表成功，共 ${categories.length} 条记录`);
      return categories;
    } catch (error) {
      logger.error(`获取分类列表失败:`, error);
      throw new Error(`获取分类列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据ID获取分类
   */
  async getById(id: number): Promise<Attribute | null> {
    try {
      const category = await attributeRepository.findById(id);
      if (!category || category.category !== 'category') {
        logger.warn(`未找到ID为 ${id} 的分类`);
        return null;
      }
      logger.info(`获取分类ID ${id} 成功`);
      return category;
    } catch (error) {
      logger.error(`获取分类ID ${id} 失败:`, error);
      throw new Error(`获取分类失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 根据名称获取分类
   */
  async getByName(name: string): Promise<Attribute | null> {
    try {
      const categories = await attributeRepository.findAll({
        category: 'category',
        sortBy: 'name',
        sortOrder: 'ASC'
      });
      
      const category = categories.find(cat => cat.name === name);
      if (!category) {
        logger.warn(`未找到名称为 "${name}" 的分类`);
        return null;
      }
      logger.info(`获取分类名称 "${name}" 成功`);
      return category;
    } catch (error) {
      logger.error(`获取分类名称 "${name}" 失败:`, error);
      throw new Error(`获取分类失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取子分类列表
   */
  async getChildren(parentId: number, options: CategoryQueryOptions = {}): Promise<Attribute[]> {
    try {
      // 验证父分类是否存在
      const parentCategory = await this.getById(parentId);
      if (!parentCategory) {
        throw new Error(`父分类ID ${parentId} 不存在`);
      }

      const childOptions = {
        category: 'category',
        parentId,
        sortBy: options.sortBy || 'name',
        sortOrder: options.sortOrder || 'ASC'
      };
      const children = await attributeRepository.findAll(childOptions);
      logger.info(`获取父分类ID ${parentId} 的子分类列表成功，共 ${children.length} 条记录`);
      return children;
    } catch (error) {
      logger.error(`获取子分类列表失败:`, error);
      throw new Error(`获取子分类列表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 更新分类
   */
  async update(id: number, data: CategoryUpdateData): Promise<Attribute | null> {
    try {
      // 先检查分类是否存在
      const existingCategory = await this.getById(id);
      if (!existingCategory) {
        throw new Error(`分类ID ${id} 不存在`);
      }

      // 如果更新名称，检查新名称是否已存在
      if (data.name && data.name !== existingCategory.name) {
        const categories = await attributeRepository.findAll({ category: 'category' });
        const categoryWithSameName = categories.find(cat => cat.name === data.name && cat.id !== id);
        if (categoryWithSameName) {
          throw new Error(`分类名称 "${data.name}" 已存在`);
        }
      }

      // 如果更新父分类ID，验证父分类是否存在
      if (data.parentId !== undefined && data.parentId !== existingCategory.parentId) {
        if (data.parentId !== null) {
          const parentCategory = await this.getById(data.parentId);
          if (!parentCategory) {
            throw new Error(`父分类ID ${data.parentId} 不存在`);
          }
          
          // 避免循环引用
          if (await this.hasDescendant(parentCategory.id, id)) {
            throw new Error(`不能将分类设置为其子分类的子分类，会导致循环引用`);
          }
        }
      }

      const updateData: any = {};
      
      if (data.name !== undefined) {
        updateData.name = data.name;
        updateData.displayName = data.name;
      }
      if (data.description !== undefined) updateData.description = data.description;
      if (data.parentId !== undefined) updateData.parentId = data.parentId;
      if (data.icon !== undefined) updateData.icon = data.icon;
      if (data.isActive !== undefined) updateData.enabled = data.isActive;

      const updatedCategory = await attributeRepository.update(id, updateData);
      logger.info(`更新分类ID ${id} 成功`);
      return updatedCategory;
    } catch (error) {
      logger.error(`更新分类ID ${id} 失败:`, error);
      throw new Error(`更新分类失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 删除分类
   */
  async delete(id: number): Promise<boolean> {
    try {
      // 先检查分类是否存在
      const existingCategory = await this.getById(id);
      if (!existingCategory) {
        throw new Error(`分类ID ${id} 不存在`);
      }

      // 检查是否有子分类
      const children = await this.getChildren(id);
      if (children.length > 0) {
        throw new Error(`分类 "${existingCategory.name}" 包含子分类，不能直接删除`);
      }

      const result = await attributeRepository.delete(id);
      logger.info(`删除分类ID ${id} 成功`);
      return result;
    } catch (error) {
      logger.error(`删除分类ID ${id} 失败:`, error);
      throw new Error(`删除分类失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 切换分类启用状态
   */
  async toggleActive(id: number): Promise<Attribute | null> {
    try {
      const category = await this.getById(id);
      if (!category) {
        throw new Error(`分类ID ${id} 不存在`);
      }

      const updatedCategory = await attributeRepository.update(id, {
        enabled: !category.enabled
      });
      logger.info(`切换分类ID ${id} 的启用状态为 ${!category.enabled} 成功`);
      return updatedCategory;
    } catch (error) {
      logger.error(`切换分类启用状态失败:`, error);
      throw new Error(`切换分类启用状态失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取分类树结构
   */
  async getCategoryTree(options?: { isActive?: boolean }): Promise<any[]> {
    try {
      // 设置默认options对象
      const opts = options || {};
      
      const queryOptions: AttributeQueryOptions = {
        category: 'category',
        sortBy: 'level',
        sortOrder: 'ASC'
      };

      const categories = await attributeRepository.findAll(queryOptions);

      // 构建分类树
      const categoryMap: Map<number, any> = new Map();
      const tree: any[] = [];

      // 先将所有分类放入Map中
      categories.forEach(category => {
        // 过滤启用状态
        if (opts.isActive !== undefined && category.enabled !== opts.isActive) {
          return;
        }
        
        categoryMap.set(category.id, {
          ...category,
          children: []
        });
      });

      // 构建树结构
      categories.forEach(category => {
        // 只处理启用的分类（如果指定了isActive选项）
        if (opts.isActive !== undefined && category.enabled !== opts.isActive) {
          return;
        }
        
        if (category.parentId === null) {
          // 根节点直接加入树
          tree.push(categoryMap.get(category.id));
        } else if (category.parentId !== undefined) {
          // 子节点加入父节点的children数组，确保parentId不是undefined
          const parent = categoryMap.get(category.parentId);
          if (parent) {
            parent.children.push(categoryMap.get(category.id));
          }
        }
      });

      logger.info(`获取分类树结构成功`);
      return tree;
    } catch (error) {
      logger.error(`获取分类树结构失败:`, error);
      throw new Error(`获取分类树结构失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 检查分类是否有指定后代（避免循环引用）
   */
  private async hasDescendant(parentId: number, childId: number): Promise<boolean> {
    try {
      const children = await this.getChildren(parentId);
      
      // 检查直接子节点是否包含目标ID
      for (const child of children) {
        if (child.id === childId) {
          return true;
        }
        
        // 递归检查孙子节点
        const hasGrandChild = await this.hasDescendant(child.id, childId);
        if (hasGrandChild) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      logger.error(`检查分类后代关系失败:`, error);
      return false;
    }
  }
}