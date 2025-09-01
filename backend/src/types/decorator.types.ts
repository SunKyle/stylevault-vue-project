/**
 * 装饰器类型定义
 * 为模型装饰器提供完整的类型支持
 */

import { DataType, ModelAttributeColumnOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

/**
 * 字段映射配置
 */
export interface FieldDecoratorOptions extends Partial<ModelAttributeColumnOptions> {
  /** 数据库字段名 */
  name?: string;
  /** 数据类型 */
  type?: DataType;
  /** 是否允许为空 */
  allowNull?: boolean;
  /** 默认值 */
  defaultValue?: any;
  /** 字段注释 */
  comment?: string;
  /** 是否唯一 */
  unique?: boolean | string | { name: string; msg: string };
  /** 验证规则 */
  validate?: any;
  /** 引用 */
  references?: {
    model: string;
    key: string;
  };
}

/**
 * 验证规则配置
 */
export interface ValidationRule {
  /** 验证器名称 */
  validator: string;
  /** 验证参数 */
  args?: any[];
  /** 错误消息 */
  message?: string;
}

/**
 * 验证装饰器配置
 */
export interface ValidateDecoratorOptions {
  /** 验证规则数组 */
  rules?: ValidationRule[];
  /** 自定义验证函数 */
  custom?: (value: any) => boolean | string | Promise<boolean | string>;
  /** 验证组 */
  groups?: string[];
}

/**
 * 索引配置
 */
export interface IndexDecoratorOptions {
  /** 索引名称 */
  name?: string;
  /** 是否唯一索引 */
  unique?: boolean;
  /** 索引字段 */
  fields?: string[];
  /** 索引类型 */
  type?: string;
  /** 条件索引 */
  where?: any;
}

/**
 * 关联关系配置
 */
export interface AssociationDecoratorOptions {
  /** 关联类型 */
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  /** 关联模型 */
  target: () => typeof Model;
  /** 外键 */
  foreignKey?: string;
  /** 目标外键 */
  targetKey?: string;
  /** 关联名称 */
  as?: string;
  /** 级联操作 */
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  /** 中间表 */
  through?: string | (() => typeof Model);
}

/**
 * 查询增强配置
 */
export interface QueryDecoratorOptions {
  /** 默认作用域 */
  defaultScope?: {
    where?: any;
    include?: any[];
    attributes?: any;
  };
  /** 分页配置 */
  pagination?: {
    defaultLimit?: number;
    maxLimit?: number;
  };
  /** 排序配置 */
  defaultOrder?: [string, 'ASC' | 'DESC'][];
  /** 软删除配置 */
  paranoid?: boolean;
}

/**
 * 装饰器元数据存储
 */
export interface ModelMetadata {
  /** 字段映射 */
  fields: Map<string, FieldDecoratorOptions>;
  /** 验证规则 */
  validations: Map<string, ValidateDecoratorOptions>;
  /** 索引定义 */
  indexes: IndexDecoratorOptions[];
  /** 关联关系 */
  associations: Map<string, AssociationDecoratorOptions>;
  /** 查询配置 */
  query: QueryDecoratorOptions;
}

/**
 * 装饰器应用接口
 */
export interface DecoratorApplier {
  applyToModel(model: typeof Model): void;
}

/**
 * 模型配置接口
 */
export interface ModelConfiguration {
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
}

/**
 * 装饰器工具类型
 */
export type PropertyDecorator = (target: any, propertyKey: string | symbol) => void;
export type ClassDecorator = <T extends Function>(target: T) => T | void;

/**
 * 模型构建器接口
 */
export interface ModelBuilder {
  /** 构建模型定义 */
  build(): any;
  /** 添加字段 */
  addField(name: string, options: FieldDecoratorOptions): this;
  /** 添加验证 */
  addValidation(name: string, options: ValidateDecoratorOptions): this;
  /** 添加索引 */
  addIndex(options: IndexDecoratorOptions): this;
  /** 添加关联 */
  addAssociation(name: string, options: AssociationDecoratorOptions): this;
  /** 设置查询配置 */
  setQueryOptions(options: QueryDecoratorOptions): this;
}