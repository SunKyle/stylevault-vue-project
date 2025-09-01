import { DataTypes } from 'sequelize';

/**
 * Sequelize类型到TypeScript类型的映射
 * 解决类型推断失败的核心问题
 */
export interface SequelizeTypeMap {
  STRING: string;
  TEXT: string;
  INTEGER: number;
  BIGINT: number;
  DECIMAL: number;
  FLOAT: number;
  DOUBLE: number;
  DATE: Date;
  DATEONLY: Date;
  BOOLEAN: boolean;
  JSONB: any;
  UUID: string;
  UUIDV4: string;
  ENUM: string;
}

/**
 * 类型安全的字段定义
 * 解决DataTypes与TypeScript类型不匹配问题
 */
export type SequelizeField<T> = {
  type: keyof SequelizeTypeMap;
  allowNull?: boolean;
  defaultValue?: T;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: boolean | string;
  references?: {
    model: string;
    key: string;
  };
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
};

/**
 * 模型属性定义工具类型
 * 确保类型安全的同时保持Sequelize兼容性
 */
export type ModelAttributes<T> = {
  [K in keyof T]: SequelizeField<T[K]>;
};

/**
 * 标准Sequelize类型工具
 * 避免直接使用DataTypes导致的类型推断问题
 */
export const FieldTypes = {
  STRING: (length?: number) => ({ type: 'STRING' as const, length }),
  TEXT: () => ({ type: 'TEXT' as const }),
  INTEGER: () => ({ type: 'INTEGER' as const }),
  BIGINT: () => ({ type: 'BIGINT' as const }),
  DECIMAL: (precision?: number, scale?: number) => ({ 
    type: 'DECIMAL' as const, 
    precision, 
    scale 
  }),
  DATE: () => ({ type: 'DATE' as const }),
  BOOLEAN: () => ({ type: 'BOOLEAN' as const }),
  JSONB: () => ({ type: 'JSONB' as const }),
  UUID: () => ({ type: 'UUID' as const }),
  UUIDV4: () => ({ type: 'UUIDV4' as const }),
  ENUM: (...values: string[]) => ({ type: 'ENUM' as const, values }),
};

/**
 * 关联配置工具类型
 * 标准化关联定义，避免类型错误
 */
export interface AssociationConfig {
  foreignKey?: string;
  targetKey?: string;
  as?: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  through?: string;
}

/**
 * 模型验证工具
 * 确保模型定义的正确性
 */
export class ModelValidator {
  static validateAttributes<T>(attributes: ModelAttributes<T>): void {
    // 验证必填字段
    Object.entries(attributes).forEach(([key, config]) => {
      const fieldConfig = config as any;
      if (!fieldConfig.type) {
        throw new Error(`字段 ${key} 缺少类型定义`);
      }
    });
  }

  static validateAssociations(associations: any[]): void {
    // 验证关联配置的完整性
    associations.forEach((assoc, index) => {
      if (!assoc.model || !assoc.type) {
        throw new Error(`关联配置 ${index} 缺少必需字段`);
      }
    });
  }
}