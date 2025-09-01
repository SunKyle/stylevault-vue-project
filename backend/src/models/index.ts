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
import { defineAssociations } from './associations';

// 导出所有模型
export { User } from './User';
export { ClothingItem } from './ClothingItem';
export { Outfit } from './Outfit';
export { OutfitItem } from './OutfitItem';
export { Category } from './Category';
export { Tag } from './Tag';
export { ClothingTag } from './ClothingTag';
export { UserPreference } from './UserPreference';
export { Analytics } from './Analytics';
export { Upload } from './Upload';

// 导出模型类型
export type ModelType = 
  | 'User'
  | 'ClothingItem'
  | 'Outfit'
  | 'OutfitItem'
  | 'Category'
  | 'Tag'
  | 'ClothingTag'
  | 'UserPreference'
  | 'Analytics'
  | 'Upload';

// 模型数组
export const models = [
  User,
  ClothingItem,
  Outfit,
  OutfitItem,
  Category,
  Tag,
  ClothingTag,
  UserPreference,
  Analytics,
  Upload
];

// 初始化所有关联关系
export const initAssociations = () => {
  defineAssociations();
};

// 初始化所有模型
export const initModels = () => {
  // 初始化关联关系
  initAssociations();
};