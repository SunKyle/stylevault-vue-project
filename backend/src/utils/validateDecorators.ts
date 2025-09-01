import { Model } from 'sequelize';
import { sequelize } from '../config/database';
import { ClothingItem } from '../models/ClothingItem';
import { Outfit } from '../models/Outfit';
import { Category } from '../models/Category';
import { Tag } from '../models/Tag';
import { Upload } from '../models/Upload';
import { OutfitItem } from '../models/OutfitItem';

interface ModelValidationResult {
  modelName: string;
  isInitialized: boolean;
  tableName: string;
  fields: string[];
  indexes: any[];
  errors: string[];
}

export class DecoratorValidator {
  private static models = [
    ClothingItem,
    Outfit,
    Category,
    Tag,
    Upload,
    OutfitItem,
  ];

  /**
   * 验证所有模型是否正确初始化
   */
  static async validateAllModels(): Promise<ModelValidationResult[]> {
    const results: ModelValidationResult[] = [];

    for (const ModelClass of this.models) {
      const result = await this.validateModel(ModelClass);
      results.push(result);
    }

    return results;
  }

  /**
   * 验证单个模型
   */
  private static async validateModel(ModelClass: any): Promise<ModelValidationResult> {
    const modelName = ModelClass.name;
    const result: ModelValidationResult = {
      modelName,
      isInitialized: false,
      tableName: '',
      fields: [],
      indexes: [],
      errors: [],
    };

    try {
      // 检查模型是否已初始化
      if (!ModelClass.sequelize) {
        result.errors.push('Model not initialized with sequelize');
        return result;
      }

      result.isInitialized = true;
      result.tableName = ModelClass.tableName;

      // 获取字段定义
      const rawAttributes = ModelClass.rawAttributes;
      result.fields = Object.keys(rawAttributes);

      // 获取索引定义
      const indexes = ModelClass.options?.indexes || [];
      result.indexes = indexes;

      // 验证关键字段
      this.validateRequiredFields(ModelClass, rawAttributes, result);

    } catch (error) {
      result.errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * 验证必需字段
   */
  private static validateRequiredFields(
    ModelClass: any,
    rawAttributes: any,
    result: ModelValidationResult
  ): void {
    const requiredFields = ['id', 'createdAt', 'updatedAt', 'isActive'];
    
    for (const field of requiredFields) {
      if (!rawAttributes[field]) {
        result.errors.push(`Missing required field: ${field}`);
      }
    }

    // 验证用户相关模型是否包含userId
    const isUserOwnedModel = ['ClothingItem', 'Outfit', 'Category', 'Tag', 'Upload'].includes(ModelClass.name);
    if (isUserOwnedModel && !rawAttributes.userId) {
      result.errors.push(`Missing userId field for user-owned model: ${ModelClass.name}`);
    }
  }

  /**
   * 生成验证报告
   */
  static async generateReport(): Promise<string> {
    const results = await this.validateAllModels();
    
    let report = '=== 装饰器验证报告 ===\n\n';
    
    for (const result of results) {
      report += `模型: ${result.modelName}\n`;
      report += `初始化: ${result.isInitialized ? '✅' : '❌'}\n`;
      report += `表名: ${result.tableName}\n`;
      report += `字段数: ${result.fields.length}\n`;
      report += `索引数: ${result.indexes.length}\n`;
      
      if (result.errors.length > 0) {
        report += `错误: ❌\n`;
        result.errors.forEach(error => {
          report += `  - ${error}\n`;
        });
      } else {
        report += `状态: ✅ 验证通过\n`;
      }
      
      report += '\n' + '-'.repeat(50) + '\n\n';
    }

    return report;
  }
}

// 运行验证
export async function runDecoratorValidation(): Promise<void> {
  console.log('开始验证装饰器配置...');
  
  try {
    const report = await DecoratorValidator.generateReport();
    console.log(report);
    
    // 保存报告到文件
    const fs = require('fs');
    const path = require('path');
    
    const reportPath = path.join(__dirname, '../../docs/模型优化分析/DECORATOR_VALIDATION_REPORT.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(`验证报告已保存到: ${reportPath}`);
  } catch (error) {
    console.error('验证过程出错:', error);
  }
}