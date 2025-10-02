// 导出所有服务
export { UserService } from './UserService';
export { UserPreferencesService } from './UserPreferencesService';
export { UserBehaviorService } from './UserBehaviorService';
export { CategoryService } from './CategoryService';
export { AttributeService } from './AttributeService';
export { SeasonService } from './SeasonService';
export { ClothingService } from './ClothingService';
export { OutfitService } from './OutfitService';
export { AuthService } from './AuthService';

// 导出服务实例
import { UserService } from './UserService';
import { UserPreferencesService } from './UserPreferencesService';
import { UserBehaviorService } from './UserBehaviorService';
import { CategoryService } from './CategoryService';
import { AttributeService } from './AttributeService';
import { SeasonService } from './SeasonService';
import { ClothingService } from './ClothingService';
import { OutfitService } from './OutfitService';
import { AuthService } from './AuthService';

export const userService = new UserService();
export const userPreferencesService = new UserPreferencesService();
export const userBehaviorService = new UserBehaviorService();
export const categoryService = new CategoryService();
export const attributeService = new AttributeService();
export const seasonService = new SeasonService();
export const clothingService = new ClothingService();
export const outfitService = new OutfitService();
export const authService = new AuthService();