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
export {
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
};

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

// 导出模型类型
export type ModelType = 
  | typeof User
  | typeof ClothingItem
  | typeof Outfit
  | typeof OutfitItem
  | typeof Category
  | typeof Tag
  | typeof ClothingTag
  | typeof UserPreference
  | typeof Analytics
  | typeof Upload;