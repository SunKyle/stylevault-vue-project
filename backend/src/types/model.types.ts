/**
 * 模型类型扩展定义
 * 为装饰器模式提供类型支持
 */

import { Model, Optional } from 'sequelize';
import { BaseModelAttributes, UserOwnedModelAttributes } from '../models/BaseModel';

/**
 * 基础模型类型
 */
export interface BaseEntity extends BaseModelAttributes {
  // 基础字段已在BaseModelAttributes中定义
}

/**
 * 用户相关模型类型
 */
export interface UserEntity extends UserOwnedModelAttributes {
  // 用户相关字段已在UserOwnedModelAttributes中定义
}

/**
 * 模型创建属性（排除自动生成字段）
 */
export type CreationAttributes<T extends BaseEntity> = Optional<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

/**
 * 用户模型创建属性
 */
export type UserCreationAttributes<T extends UserEntity> = Optional<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive'>;

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /** 页码（从1开始） */
  page?: number;
  /** 每页条数 */
  limit?: number;
  /** 排序字段 */
  orderBy?: string;
  /** 排序方向 */
  orderDirection?: 'ASC' | 'DESC';
  /** 过滤条件 */
  where?: any;
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  /** 数据列表 */
  data: T[];
  /** 总条数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  limit: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
}

/**
 * 查询选项
 */
export interface QueryOptions {
  /** 包含关联 */
  include?: any[];
  /** 排序 */
  order?: any[];
  /** 限制字段 */
  attributes?: any;
  /** 事务 */
  transaction?: any;
  /** 作用域 */
  scope?: string | string[];
}

/**
 * 用户查询选项
 */
export interface UserQueryOptions extends QueryOptions {
  /** 用户ID */
  userId?: number;
  /** 是否包含软删除数据 */
  paranoid?: boolean;
}

/**
 * 模型装饰器接口
 */
export interface ModelDecorator<T extends Model> {
  /** 应用装饰器到模型 */
  apply(target: typeof Model): void;
  /** 获取模型元数据 */
  getMetadata(): any;
}

/**
 * 模型构建器接口
 */
export interface ModelBuilder<T extends Model> {
  /** 设置表名 */
  tableName(name: string): this;
  /** 设置模型名 */
  modelName(name: string): this;
  /** 设置时间戳 */
  timestamps(enabled: boolean): this;
  /** 设置软删除 */
  paranoid(enabled: boolean): this;
  /** 构建模型 */
  build(): typeof Model;
}

/**
 * 关联查询配置
 */
export interface AssociationQueryOptions {
  /** 关联模型 */
  model: typeof Model;
  /** 关联别名 */
  as?: string;
  /** 关联条件 */
  where?: any;
  /** 关联字段 */
  attributes?: string[];
  /** 嵌套关联 */
  include?: AssociationQueryOptions[];
}

/**
 * 模型验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 错误信息 */
  errors: ValidationError[];
}

/**
 * 验证错误
 */
export interface ValidationError {
  /** 字段名 */
  field: string;
  /** 错误消息 */
  message: string;
  /** 验证规则 */
  rule?: string;
  /** 实际值 */
  value?: any;
}

/**
 * 模型生命周期钩子
 */
export interface ModelHooks {
  beforeValidate?: (instance: any, options: any) => Promise<void>;
  afterValidate?: (instance: any, options: any) => Promise<void>;
  beforeCreate?: (instance: any, options: any) => Promise<void>;
  afterCreate?: (instance: any, options: any) => Promise<void>;
  beforeUpdate?: (instance: any, options: any) => Promise<void>;
  afterUpdate?: (instance: any, options: any) => Promise<void>;
  beforeDestroy?: (instance: any, options: any) => Promise<void>;
  afterDestroy?: (instance: any, options: any) => Promise<void>;
  beforeRestore?: (instance: any, options: any) => Promise<void>;
  afterRestore?: (instance: any, options: any) => Promise<void>;
}

/**
 * 模型配置选项
 */
export interface ModelOptions {
  /** 表名 */
  tableName?: string;
  /** 模型名称 */
  modelName?: string;
  /** 时间戳 */
  timestamps?: boolean;
  /** 软删除 */
  paranoid?: boolean;
  /** 引擎 */
  engine?: string;
  /** 字符集 */
  charset?: string;
  /** 排序规则 */
  collate?: string;
  /** 钩子 */
  hooks?: ModelHooks;
  /** 作用域 */
  scopes?: any;
  /** 默认作用域 */
  defaultScope?: any;
}