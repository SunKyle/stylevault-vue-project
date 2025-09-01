import { sequelize } from '../config/database';
import { User } from './User';
import { ClothingItem } from './ClothingItem';
import { Outfit } from './Outfit';
import { Category } from './Category';
import { Tag } from './Tag';
import { Upload } from './Upload';
import { OutfitItem } from './OutfitItem';
import { defineAssociations } from './associations';

export function initializeModels(): void {
  // 所有模型现在都在各自的文件中初始化
  // 这里只需要确保模型被导入即可触发初始化
  
  // 定义模型关联关系
  defineAssociations();
}

export {
  User,
  ClothingItem,
  Outfit,
  Category,
  Tag,
  Upload,
  OutfitItem,
};

export default {
  initializeModels,
  User,
  ClothingItem,
  Outfit,
  Category,
  Tag,
  Upload,
  OutfitItem,
};