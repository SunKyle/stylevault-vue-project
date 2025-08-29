import { User } from './User';
import { ClothingItem } from './ClothingItem';
import { Outfit } from './Outfit';
import { OutfitItem } from './OutfitItem';
import { Category } from './Category';
import { Tag } from './Tag';
import { ClothingTag } from './ClothingTag';
import { UserPreference } from './UserPreference';
import { Analytics } from './Analytics';
import { Upload } from './Upload';

// 定义所有模型关联关系
export const defineAssociations = () => {
  // User关联
  User.hasMany(ClothingItem, {
    foreignKey: 'userId',
    as: 'clothingItems'
  });

  User.hasMany(Outfit, {
    foreignKey: 'userId',
    as: 'outfits'
  });

  User.hasOne(UserPreference, {
    foreignKey: 'userId',
    as: 'preference'
  });

  User.hasMany(Analytics, {
    foreignKey: 'userId',
    as: 'analytics'
  });

  User.hasMany(Upload, {
    foreignKey: 'userId',
    as: 'uploads'
  });

  // ClothingItem关联
  ClothingItem.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  ClothingItem.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });

  ClothingItem.hasMany(ClothingTag, {
    foreignKey: 'clothingItemId',
    as: 'clothingTags'
  });

  ClothingItem.hasMany(OutfitItem, {
    foreignKey: 'clothingItemId',
    as: 'outfitItems'
  });

  ClothingItem.hasMany(Analytics, {
    foreignKey: 'clothingItemId',
    as: 'analytics'
  });

  // Outfit关联
  Outfit.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Outfit.hasMany(OutfitItem, {
    foreignKey: 'outfitId',
    as: 'outfitItems'
  });

  Outfit.hasMany(Analytics, {
    foreignKey: 'outfitId',
    as: 'analytics'
  });

  // Category关联
  Category.hasMany(ClothingItem, {
    foreignKey: 'categoryId',
    as: 'clothingItems'
  });

  Category.belongsTo(Category, {
    foreignKey: 'parentId',
    as: 'parent'
  });

  Category.hasMany(Category, {
    foreignKey: 'parentId',
    as: 'children'
  });

  // Tag关联
  Tag.hasMany(ClothingTag, {
    foreignKey: 'tagId',
    as: 'clothingTags'
  });

  // OutfitItem关联
  OutfitItem.belongsTo(Outfit, {
    foreignKey: 'outfitId',
    as: 'outfit'
  });

  OutfitItem.belongsTo(ClothingItem, {
    foreignKey: 'clothingItemId',
    as: 'clothingItem'
  });

  // ClothingTag关联
  ClothingTag.belongsTo(ClothingItem, {
    foreignKey: 'clothingItemId',
    as: 'clothingItem'
  });

  ClothingTag.belongsTo(Tag, {
    foreignKey: 'tagId',
    as: 'tag'
  });

  // UserPreference关联
  UserPreference.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // Analytics关联
  Analytics.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Analytics.belongsTo(ClothingItem, {
    foreignKey: 'clothingItemId',
    as: 'clothingItem'
  });

  Analytics.belongsTo(Outfit, {
    foreignKey: 'outfitId',
    as: 'outfit'
  });

  // Upload关联
  Upload.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
};