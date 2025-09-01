/**
 * 字段映射装饰器
 * 实现驼峰式与下划线式自动映射
 */

import 'reflect-metadata';
import { DataTypes, ModelAttributeColumnOptions } from 'sequelize';
import { FieldDecoratorOptions } from '../types/decorator.types';

/**
 * 字段映射装饰器元数据键
 */
const FIELD_METADATA_KEY = Symbol('field:metadata');

/**
 * 将驼峰式命名转换为下划线命名
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * 将下划线命名转换为驼峰式命名
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 字段装饰器
 * 自动处理字段名映射和类型定义
 */
export function Field(options: FieldDecoratorOptions = {}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') {
      throw new Error('Field decorator can only be applied to string properties');
    }

    // 获取或创建字段元数据
    const fields = getFieldMetadata(target.constructor);
    
    // 自动映射数据库字段名（下划线命名）
    const dbFieldName = options.name || camelToSnake(propertyKey);
    
    // 合并配置
    const fieldConfig: FieldDecoratorOptions = {
      ...options,
      field: dbFieldName,
    };

    // 存储字段元数据
    fields.set(propertyKey, fieldConfig);

    // 存储到类元数据
    Reflect.defineMetadata(FIELD_METADATA_KEY, fields, target.constructor);
  };
}

/**
 * 获取字段元数据
 */
export function getFieldMetadata(target: any): Map<string, FieldDecoratorOptions> {
  const existing = Reflect.getMetadata(FIELD_METADATA_KEY, target);
  return existing || new Map();
}

/**
 * 获取所有字段定义
 */
export function getAllFields(target: any): Record<string, ModelAttributeColumnOptions> {
  const fields = getFieldMetadata(target);
  const result: Record<string, ModelAttributeColumnOptions> = {};

  fields.forEach((options, propertyKey) => {
    const { name, ...columnOptions } = options;
    result[propertyKey] = {
      ...columnOptions,
      field: name || camelToSnake(propertyKey),
    } as ModelAttributeColumnOptions;
  });

  return result;
}

/**
 * 主键字段装饰器
 */
export function PrimaryKey(options: Partial<FieldDecoratorOptions> = {}): PropertyDecorator {
  return Field({
    ...options,
    primaryKey: true,
    autoIncrement: true,
    type: 'INTEGER',
  });
}

/**
 * 字符串字段装饰器
 */
export function StringField(options: Partial<FieldDecoratorOptions> & { length?: number } = {}): PropertyDecorator {
  const { length = 255, ...rest } = options;
  return Field({
    ...rest,
    type: `STRING(${length})` as any,
  });
}

/**
 * 文本字段装饰器
 */
export function TextField(options: Partial<FieldDecoratorOptions> = {}): PropertyDecorator {
  return Field({
    ...options,
    type: 'TEXT' as any,
  });
}

/**
 * 整数字段装饰器
 */
export function IntegerField(options: Partial<FieldDecoratorOptions> = {}): PropertyDecorator {
  return Field({
    ...options,
    type: 'INTEGER' as any,
  });
}

/**
 * 布尔字段装饰器
 */
export function BooleanField(options: Partial<FieldDecoratorOptions> = {}): PropertyDecorator {
  return Field({
    ...options,
    type: 'BOOLEAN' as any,
    defaultValue: options.defaultValue ?? false,
  });
}

/**
 * 日期时间字段装饰器
 */
export function DateTimeField(options: Partial<FieldDecoratorOptions> = {}): PropertyDecorator {
  return Field({
    ...options,
    type: 'DATE' as any,
  });
}

/**
 * JSON字段装饰器
 */
export function JSONField(options: Partial<FieldDecoratorOptions> = {}): PropertyDecorator {
  return Field({
    ...options,
    type: 'JSON' as any,
  });
}

/**
 * 浮点数字段装饰器
 */
export function DecimalField(options: Partial<FieldDecoratorOptions> & { precision?: number; scale?: number } = {}): PropertyDecorator {
  const { precision = 10, scale = 2, ...rest } = options;
  return Field({
    ...rest,
    type: `DECIMAL(${precision}, ${scale})` as any,
  });
}

/**
 * 外键字段装饰器
 */
export function ForeignKey(
  targetModel: () => any,
  options: Partial<FieldDecoratorOptions> = {}
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    if (typeof propertyKey !== 'string') {
      throw new Error('ForeignKey decorator can only be applied to string properties');
    }

    const modelName = targetModel().name;
    const fieldName = camelToSnake(propertyKey);

    Field({
      ...options,
      type: 'INTEGER' as any,
      references: {
        model: camelToSnake(modelName) + 's',
        key: 'id',
      },
    })(target, propertyKey);
  };
}

/**
 * 枚举字段装饰器
 */
export function EnumField(
  values: string[],
  options: Partial<FieldDecoratorOptions> = {}
): PropertyDecorator {
  return Field({
    ...options,
    type: 'ENUM' as any,
    values,
  });
}

/**
 * 创建字段定义
 * 生成Sequelize模型初始化所需的字段定义
 */
export function createFieldDefinitions(ModelClass: any): Record<string, ModelAttributeColumnOptions> {
  const fields = getFieldMetadata(ModelClass);
  const result: Record<string, ModelAttributeColumnOptions> = {};

  fields.forEach((options, propertyKey) => {
    const { type, ...columnOptions } = options;
    
    // 将字符串类型转换为DataTypes
    let dataType: any;
    if (typeof type === 'string') {
      switch (type) {
        case 'INTEGER':
          dataType = DataTypes.INTEGER;
          break;
        case 'STRING':
          dataType = DataTypes.STRING;
          break;
        case 'TEXT':
          dataType = DataTypes.TEXT;
          break;
        case 'BOOLEAN':
          dataType = DataTypes.BOOLEAN;
          break;
        case 'DATE':
          dataType = DataTypes.DATE;
          break;
        case 'JSON':
          dataType = DataTypes.JSON;
          break;
        case 'DECIMAL':
          dataType = DataTypes.DECIMAL;
          break;
        case 'ENUM':
          dataType = DataTypes.ENUM;
          break;
        default:
          if (type.startsWith('STRING(')) {
            const match = type.match(/STRING\((\d+)\)/);
            dataType = DataTypes.STRING(parseInt(match![1]));
          } else if (type.startsWith('DECIMAL(')) {
            const match = type.match(/DECIMAL\((\d+),\s*(\d+)\)/);
            dataType = DataTypes.DECIMAL(parseInt(match![1]), parseInt(match![2]));
          } else {
            dataType = DataTypes.STRING;
          }
      }
    } else {
      dataType = type;
    }

    result[propertyKey] = {
      ...columnOptions,
      type: dataType,
    } as ModelAttributeColumnOptions;
  });

  return result;
}