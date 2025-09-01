import { Model, Optional, Sequelize, ModelAttributes, InitOptions } from 'sequelize';
import { Database } from '../config/database';
import { ModelValidator } from './types/sequelize.types';

/**
 * 基础属性接口
 * 所有模型共享的基础字段
 */
export interface BaseModelAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

/**
 * 基础模型抽象类
 * 提供类型安全的模型定义和初始化
 */
export abstract class BaseModel<T extends {} = {}> extends Model {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date | null;

  /**
   * 获取基础模型属性
   * 确保所有模型都有统一的id、时间戳字段
   */
  protected static getBaseAttributes() {
    return {
      id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        type: 'DATE',
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: 'DATE',
        allowNull: false,
        field: 'updated_at',
      },
      deletedAt: {
        type: 'DATE',
        allowNull: true,
        field: 'deleted_at',
      },
    };
  }

  /**
   * 类型安全的模型初始化方法
   * 解决类型推断失败问题
   */
  public static initModel<M extends BaseModel<T>>(
    this: new () => M,
    attributes: Record<string, any>,
    options: {
      tableName: string;
      paranoid?: boolean;
      timestamps?: boolean;
      indexes?: any[];
    } = { tableName: '' }
  ): void {
    const sequelize = Database.getInstance().getSequelize();
    
    if (!sequelize) {
      throw new Error('Database instance not initialized');
    }

    const modelAttributes = {
      ...this.getBaseAttributes(),
      ...attributes,
    };

    // 验证模型属性
    ModelValidator.validateAttributes(modelAttributes);

    this.init(modelAttributes as any, {
      sequelize,
      tableName: options.tableName,
      paranoid: options.paranoid ?? true,
      timestamps: options.timestamps ?? true,
      underscored: true,
      indexes: options.indexes || [],
    });
  }

  /**
   * 获取模型实例
   * 提供类型安全的模型访问
   */
  public static getModel<M extends BaseModel<T>>(this: new () => M): typeof BaseModel {
    return this as any;
  }

  /**
   * 验证模型完整性
   */
  public static validateModel(): void {
    const model = this as any;
    if (!model.sequelize) {
      throw new Error(`${model.name} 模型未正确初始化`);
    }
  }
}