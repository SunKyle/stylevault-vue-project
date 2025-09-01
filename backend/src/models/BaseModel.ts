import { Model, FindOptions, WhereOptions, Optional, Op } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * 最基础的模型属性接口
 * 只包含系统必需字段
 */
export interface BaseModelAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 带用户关联的模型属性接口
 * 继承自BaseModelAttributes，添加用户相关字段
 */
export interface UserOwnedModelAttributes extends BaseModelAttributes {
  userId: number;
  isActive: boolean;
}

/**
 * 分页元数据接口
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 分页结果接口
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * 查询选项接口
 */
export interface QueryOptions extends Omit<FindOptions, 'limit' | 'offset'> {
  page?: number;
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}

/**
 * 基础模型类
 * 提供通用的CRUD操作和软删除功能
 */
export abstract class BaseModel<T extends BaseModelAttributes = BaseModelAttributes> extends Model<T> {
  declare id: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  /**
   * 检查记录是否已被软删除
   */
  checkSoftDeleted(): boolean {
    return this.deletedAt !== null;
  }

  /**
   * 软删除（带验证）
   */
  async softDelete(): Promise<this> {
    if (this.checkSoftDeleted()) {
      throw new Error('Record is already soft deleted');
    }
    await this.destroy();
    return this;
  }

  /**
   * 恢复软删除的记录（带验证）
   */
  async restoreRecord(): Promise<this> {
    if (!this.checkSoftDeleted()) {
      throw new Error('Record is not soft deleted');
    }
    await this.restore();
    return this;
  }

  /**
   * 强制删除（绕过软删除）
   */
  async forceDelete(): Promise<void> {
    await this.destroy({ force: true });
  }

  /**
   * 分页查询
   */
  static async paginate<T extends BaseModelAttributes>(
    this: new () => BaseModel<T>,
    options: QueryOptions = {}
  ): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 10,
      offset,
      includeDeleted = false,
      ...findOptions
    } = options;

    const actualOffset = offset ?? (page - 1) * limit;
    const paranoid = !includeDeleted;

    const [rows, total] = await Promise.all([
      (this as any).findAll({
        ...findOptions,
        limit,
        offset: actualOffset,
        paranoid,
      }),
      (this as any).count({
        where: findOptions.where,
        paranoid,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const data = rows.map((row: any) => row.toJSON() as T);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 按ID查找
   */
  static async findById<T extends BaseModelAttributes>(
    this: new () => BaseModel<T>,
    id: number,
    options: Omit<QueryOptions, 'page' | 'limit' | 'offset'> = {}
  ): Promise<T | null> {
    const { includeDeleted = false, ...findOptions } = options;
    const result = await (this as any).findOne({
      where: { id },
      paranoid: !includeDeleted,
      ...findOptions,
    });
    return result ? result.toJSON() as T : null;
  }

  /**
   * 按ID恢复软删除的记录
   */
  static async restoreById<T extends BaseModelAttributes>(
    this: new () => BaseModel<T>,
    id: number
  ): Promise<number> {
    return (this as any).restore({ where: { id }, paranoid: false });
  }

  /**
   * 按日期范围查找
   */
  static async findByDateRange<T extends BaseModelAttributes>(
    this: new () => BaseModel<T>,
    startDate: Date,
    endDate: Date,
    options: QueryOptions = {}
  ): Promise<BaseModel<T>[]> {
    const { includeDeleted = false, ...findOptions } = options;
    const where = {
      ...findOptions.where,
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    };

    return (this as any).findAll({
      ...findOptions,
      where,
      paranoid: !includeDeleted,
    });
  }

  /**
   * 批量软删除
   */
  static async bulkSoftDelete<T extends BaseModelAttributes>(
    this: new () => BaseModel<T>,
    where: WhereOptions
  ): Promise<number> {
    return (this as any).destroy({ where });
  }

  /**
   * 统计记录数量
   */
  static async countRecords<T extends BaseModelAttributes>(
    this: new () => BaseModel<T>,
    where?: WhereOptions,
    includeDeleted = false
  ): Promise<number> {
    return (this as any).count({ where, paranoid: !includeDeleted });
  }
}

/**
 * 用户拥有的模型类
 * 继承自BaseModel，添加用户相关字段和功能
 */
export abstract class UserOwnedModel<T extends UserOwnedModelAttributes = UserOwnedModelAttributes> extends BaseModel<T> {
  declare userId: number;
  declare isActive: boolean;

  /**
   * 激活记录
   */
  async activate(): Promise<this> {
    if (this.isActive) {
      throw new Error('Record is already active');
    }
    this.isActive = true;
    await this.save();
    return this;
  }

  /**
   * 停用记录
   */
  async deactivate(): Promise<this> {
    if (!this.isActive) {
      throw new Error('Record is already inactive');
    }
    this.isActive = false;
    await this.save();
    return this;
  }

  /**
   * 按用户ID查询
   */
  static async findByUser<T extends UserOwnedModelAttributes>(
    this: new () => UserOwnedModel<T>,
    userId: number,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const { includeDeleted = false, ...findOptions } = options;
    const where = {
      ...findOptions.where,
      userId,
      isActive: true,
    };

    const rows = await (this as any).findAll({
      ...findOptions,
      where,
      paranoid: !includeDeleted,
    });
    
    return rows.map((row: any) => row.toJSON() as T);
  }

  /**
   * 按用户ID分页查询
   */
  static async paginateByUser<T extends UserOwnedModelAttributes>(
    this: new () => UserOwnedModel<T>,
    userId: number,
    options: QueryOptions = {}
  ): Promise<PaginatedResult<T>> {
    return (this as any).paginate({
      ...options,
      where: { ...options.where, userId, isActive: true },
    });
  }

  /**
   * 按用户ID统计
   */
  static async countByUser<T extends UserOwnedModelAttributes>(
    this: new () => UserOwnedModel<T>,
    userId: number,
    where?: WhereOptions,
    includeDeleted = false
  ): Promise<number> {
    const finalWhere = {
      ...where,
      userId,
      isActive: true,
    };

    return (this as any).countRecords(finalWhere, includeDeleted);
  }

  /**
   * 批量软删除用户所有记录
   */
  static async bulkSoftDeleteByUser<T extends UserOwnedModelAttributes>(
    this: new () => UserOwnedModel<T>,
    userId: number
  ): Promise<number> {
    return (this as any).bulkSoftDelete({ userId });
  }
}

/**
 * 基础模型配置
 */
export const baseModelConfig = {
  sequelize,
  timestamps: true,
  paranoid: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
} as const;