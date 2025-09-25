// 导入所有仓库类
import { AttributeRepository } from './AttributeRepository';
import { ClothingRepository } from './ClothingRepository';
import { OutfitRepository } from './OutfitRepository';
import { OutfitClothingRepository } from './OutfitClothingRepository';
import { UserRepository } from './UserRepository';
import { UserPreferencesRepository } from './UserPreferencesRepository';
import { UserBehaviorRepository } from './UserBehaviorRepository';
import { RecommendationsRepository } from './RecommendationsRepository';
import { WeatherDataRepository } from './WeatherDataRepository';

// 创建仓库实例
export const attributeRepository = new AttributeRepository();
export const clothingRepository = new ClothingRepository();
export const outfitRepository = new OutfitRepository();
export const outfitClothingRepository = new OutfitClothingRepository();
export const userRepository = new UserRepository();
export const userPreferencesRepository = new UserPreferencesRepository();
export const userBehaviorRepository = new UserBehaviorRepository();
export const recommendationsRepository = new RecommendationsRepository();
export const weatherDataRepository = new WeatherDataRepository();

// 导出仓库类类型，便于类型导入
export type { AttributeRepository } from './AttributeRepository';
export type { ClothingRepository } from './ClothingRepository';
export type { OutfitRepository } from './OutfitRepository';
export type { OutfitClothingRepository } from './OutfitClothingRepository';
export type { UserRepository } from './UserRepository';
export type { UserPreferencesRepository } from './UserPreferencesRepository';
export type { UserBehaviorRepository } from './UserBehaviorRepository';
export type { RecommendationsRepository } from './RecommendationsRepository';
export type { WeatherDataRepository } from './WeatherDataRepository';

// 导出查询选项类型
export type {
  AttributeQueryOptions
} from './AttributeRepository';

export type {
  ClothingQueryOptions,
  ClothingStats
} from './ClothingRepository';

export type {
  OutfitQueryOptions,
  OutfitStats
} from './OutfitRepository';

export type {
  OutfitClothingQueryOptions
} from './OutfitClothingRepository';

export type {
  UserQueryOptions
} from './UserRepository';

export type {
  UserPreferencesQueryOptions
} from './UserPreferencesRepository';

export type {
  UserBehaviorQueryOptions,
  UserBehaviorStats
} from './UserBehaviorRepository';

export type {
  RecommendationsQueryOptions,
  RecommendationsStats,
  GenerateRecommendationsOptions
} from './RecommendationsRepository';

export type {
  WeatherDataQueryOptions,
  WeatherSuitabilityScore,
  WeatherStats
} from './WeatherDataRepository';

// 导出所有仓库的集合，方便一次性导入
export const repositories = {
  attribute: attributeRepository,
  clothing: clothingRepository,
  outfit: outfitRepository,
  outfitClothing: outfitClothingRepository,
  user: userRepository,
  userPreferences: userPreferencesRepository,
  userBehavior: userBehaviorRepository,
  recommendations: recommendationsRepository,
  weatherData: weatherDataRepository
};