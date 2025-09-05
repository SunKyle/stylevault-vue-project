// 模型导出文件
// 统一导出所有模型，便于在其他地方引用

// 基础模型
export { BaseModel } from './base/BaseModel';

// 实体模型 - 按依赖顺序导出
import { User } from './entities/User';
import { Category } from './entities/Category';
import { ClothingItem } from './entities/ClothingItem';
import { Outfit } from './entities/Outfit';
import { OutfitClothing } from './entities/OutfitClothing';
import { Attribute } from './entities/Attribute';
import { EntityAttribute } from './entities/EntityAttribute';
import { UserPreferences } from './entities/UserPreferences';
import { UserBehavior } from './entities/UserBehavior';
import { WeatherData } from './entities/WeatherData';
import { Recommendations } from './entities/Recommendations';

// 重新导出所有模型
export { User };
export { Category };
export { ClothingItem };
export { Outfit };
export { OutfitClothing };
export { Attribute };
export { EntityAttribute };
export { UserPreferences };
export { UserBehavior };
export { WeatherData };
export { Recommendations };

// 类型定义
export * from '../types/model.types';

// 模型数组（用于Sequelize注册）
export const models = [
  User,
  Category,
  ClothingItem,
  Outfit,
  OutfitClothing,
  Attribute,
  EntityAttribute,
  UserPreferences,
  UserBehavior,
  WeatherData,
  Recommendations
];

// 模型关联配置
export const setupModelAssociations = () => {

  // User 关联
  User.hasMany(ClothingItem, {
    foreignKey: 'userId',
    as: 'clothingItems'
  });
  
  User.hasMany(Outfit, {
    foreignKey: 'userId',
    as: 'outfits'
  });
  
  User.hasOne(UserPreferences, {
    foreignKey: 'userId',
    as: 'preferences'
  });
  
  User.hasMany(UserBehavior, {
    foreignKey: 'userId',
    as: 'behaviors'
  });
  
  User.hasMany(Recommendations, {
    foreignKey: 'userId',
    as: 'recommendations'
  });

  // ClothingItem 关联
  ClothingItem.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  ClothingItem.belongsToMany(Outfit, {
    through: OutfitClothing,
    foreignKey: 'clothing_id',
    otherKey: 'outfit_id',
    as: 'outfits'
  });
  
  ClothingItem.hasMany(EntityAttribute, {
    foreignKey: 'entityId',
    constraints: false,
    scope: {
      entityType: 'clothing_item'
    },
    as: 'attributes'
  });

  // Outfit 关联
  Outfit.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  Outfit.belongsToMany(ClothingItem, {
    through: OutfitClothing,
    foreignKey: 'outfit_id',
    otherKey: 'clothing_id',
    as: 'clothingItems'
  });
  
  Outfit.hasMany(EntityAttribute, {
    foreignKey: 'entityId',
    constraints: false,
    scope: {
      entityType: 'outfit'
    },
    as: 'attributes'
  });

  // Attribute 关联
  Attribute.hasMany(EntityAttribute, {
    foreignKey: 'attributeId',
    as: 'entityAttributes'
  });

  // EntityAttribute 关联
  EntityAttribute.belongsTo(Attribute, {
    foreignKey: 'attributeId',
    as: 'attribute'
  });

  // UserPreferences 关联
  UserPreferences.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // UserBehavior 关联
  UserBehavior.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // WeatherData 关联
  // WeatherData 是独立的，没有直接关联

  // Recommendations 关联
  Recommendations.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

// 模型工具类
export class ModelUtils {
  /**
   * 获取所有模型名称
   */
  static getModelNames(): string[] {
    return models.map(model => model.name);
  }

  /**
   * 根据名称获取模型
   */
  static getModelByName(name: string) {
    return models.find(model => model.name === name);
  }

  /**
   * 验证模型是否存在
   */
  static isValidModel(name: string): boolean {
    return this.getModelByName(name) !== undefined;
  }

  /**
   * 获取模型关系信息
   */
  static getModelRelations(modelName: string) {
    const model = this.getModelByName(modelName);
    if (!model) return null;

    return {
      associations: model.associations,
      hasMany: Object.keys(model.associations).filter(key => 
        model.associations[key].associationType === 'HasMany'
      ),
      belongsTo: Object.keys(model.associations).filter(key => 
        model.associations[key].associationType === 'BelongsTo'
      ),
      belongsToMany: Object.keys(model.associations).filter(key => 
        model.associations[key].associationType === 'BelongsToMany'
      ),
      hasOne: Object.keys(model.associations).filter(key => 
        model.associations[key].associationType === 'HasOne'
      )
    };
  }
}