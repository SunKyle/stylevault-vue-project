// 模型类型定义
// 包含所有模型的枚举类型和接口定义

// 用户行为类型枚举
export enum BehaviorType {
  VIEW = 'view',
  LIKE = 'like',
  SAVE = 'save',
  SHARE = 'share',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  PURCHASE = 'purchase',
  WEAR = 'wear',
  RECOMMEND = 'recommend'
}

// 推荐类型枚举
export enum RecommendationType {
  OUTFIT = 'outfit',
  PURCHASE = 'purchase',
  STYLE = 'style',
  SEASONAL = 'seasonal',
  TRENDING = 'trending',
  PERSONALIZED = 'personalized'
}

// 推荐状态枚举
export enum RecommendationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

// 衣物类型枚举
export enum ClothingType {
  TOP = 'top',
  BOTTOM = 'bottom',
  DRESS = 'dress',
  OUTERWEAR = 'outerwear',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories',
  BAG = 'bag',
  HAT = 'hat'
}

// 季节枚举
export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter'
}

// 场合枚举
export enum Occasion {
  CASUAL = 'casual',
  FORMAL = 'formal',
  BUSINESS = 'business',
  SPORT = 'sport',
  PARTY = 'party',
  DAILY = 'daily',
  DATE = 'date',
  TRAVEL = 'travel'
}

// 颜色枚举
export enum ColorCategory {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  PINK = 'pink',
  BROWN = 'brown',
  BLACK = 'black',
  WHITE = 'white',
  GRAY = 'gray',
  GOLD = 'gold',
  SILVER = 'silver'
}

// 材质枚举
export enum Material {
  COTTON = 'cotton',
  LINEN = 'linen',
  WOOL = 'wool',
  SILK = 'silks',
  POLYESTER = 'polyester',
  LEATHER = 'leather',
  DENIM = 'denim',
  VELVET = 'velvet',
  CHIFFON = 'chiffon',
  LACE = 'lace'
}

// 属性分类枚举
export enum AttributeCategory {
  BASIC = 'basic',
  STYLE = 'style',
  SEASON = 'season',
  OCCASION = 'occasion',
  COLOR = 'color',
  MATERIAL = 'material',
  SIZE = 'size',
  BRAND = 'brand',
  PATTERN = 'pattern',
  FIT = 'fit',
  PRICE = 'price',
  CUSTOM = 'custom'
}

// 属性类型枚举
export enum AttributeType {
  COLOR = 'color',
  MATERIAL = 'material',
  STYLE = 'style',
  PATTERN = 'pattern',
  BRAND = 'brand',
  SIZE = 'size',
  FIT = 'fit',
  SEASON = 'season',
  OCCASION = 'occasion',
  PRICE = 'price'
}

// 天气条件枚举
export enum WeatherCondition {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  WINDY = 'windy',
  FOGGY = 'foggy',
  STORMY = 'stormy'
}

// 行为上下文接口
export interface BehaviorContext {
  page?: string;
  section?: string;
  action?: string;
  source?: string;
  metadata?: Record<string, any>;
}

// 风格画像接口
export interface StyleProfile {
  preferredStyles?: string[];
  colorPalette?: string[];
  fitPreference?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  riskLevel?: 'conservative' | 'moderate' | 'adventurous';
  occasions?: string[];
  seasons?: string[];
  brands?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  weight?: number;
}

// 天气偏好接口
export interface WeatherPreference {
  temperatureRange?: {
    min: number;
    max: number;
  };
  humidityPreference?: 'low' | 'medium' | 'high';
  windTolerance?: 'low' | 'medium' | 'high';
  conditionPreferences?: WeatherCondition[];
  seasonalAdjustments?: boolean;
  weight?: number;
}

// 尺码偏好接口
export interface SizePreference {
  tops?: string;
  bottoms?: string;
  shoes?: string;
  accessories?: string;
  custom?: Record<string, string>;
  weight?: number;
}

// 用户偏好接口
export interface UserPreferences {
  styleProfile?: StyleProfile;
  weatherPreference?: WeatherPreference;
  sizePreference?: SizePreference;
  colorPreferences?: number[];
  brandPreferences?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  seasonPreferences?: Season[];
  occasionPreferences?: Occasion[];
  notificationSettings?: {
    email: boolean;
    push: boolean;
    outfitRecommendations: boolean;
    weatherAlerts: boolean;
    newFeatures: boolean;
  };
  privacySettings?: {
    profilePublic: boolean;
    outfitsPublic: boolean;
    clothingPublic: boolean;
    allowComments: boolean;
    allowSharing: boolean;
  };
  recommendationSettings?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    types: string[];
    sensitivity: number;
  };
  uiSettings?: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
    temperatureUnit: 'celsius' | 'fahrenheit';
    dateFormat: string;
  };
}

// 推荐上下文接口
export interface RecommendationContext {
  algorithm: string;
  score: number;
  reason: string;
  source: string;
  metadata?: Record<string, any>;
}

// 设备信息接口
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  appVersion?: string;
}

// 位置信息接口
export interface LocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

// 天气信息接口
export interface WeatherInfo {
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
}

// 分页参数接口
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// 排序参数接口
export interface SortParams {
  field: string;
  direction: 'ASC' | 'DESC';
}

// 过滤参数接口
export interface FilterParams {
  [key: string]: any;
}

// 搜索参数接口
export interface SearchParams {
  query?: string;
  filters?: FilterParams;
  pagination?: PaginationParams;
  sort?: SortParams;
}

// API响应接口
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 数据库配置接口
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb';
  logging?: boolean | ((sql: string, timing?: number) => void);
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

// JWT配置接口
export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret?: string;
  refreshExpiresIn?: string;
}

// Redis配置接口
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

// 衣物状况枚举
export enum ClothingCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

// 衣物元数据接口
export interface ClothingMetadata {
  usageCount?: number;
  lastWorn?: Date;
  favorite?: boolean;
  seasonalUsage?: {
    spring?: number;
    summer?: number;
    autumn?: number;
    winter?: number;
  };
  occasionUsage?: Record<string, number>;
  weatherSuitability?: Record<string, number>;
  styleTags?: string[];
  careInstructions?: string[];
  purchaseInfo?: {
    store?: string;
    purchaseDate?: Date;
    price?: number;
    currency?: string;
  };
  wearCount?: number;
  rating?: number;
  tags?: string[];
}

// 文件上传配置接口
export interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  uploadDir: string;
  maxFiles: number;
}

// 邮件配置接口
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

// 搭配状态枚举
export enum OutfitStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

// 搭配元数据接口
export interface OutfitMetadata {
  viewCount?: number;
  likeCount?: number;
  saveCount?: number;
  shareCount?: number;
  wearCount?: number;
  usageCount?: number;
  lastWornAt?: Date;
  lastUsedAt?: Date;
  lastRatedAt?: Date;
  ratingCount?: number;
  tags?: string[];
  publishedAt?: Date;
  archivedAt?: Date;
  featured?: boolean;
  featuredAt?: Date;
  seasonalScore?: number;
  occasionScore?: number;
  styleScore?: number;
  weatherCompatibility?: number;
  userRating?: number;
  complexity?: 'simple' | 'moderate' | 'complex';
  colors?: string[];
  materials?: string[];
  brands?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

// 环境配置接口
export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  database: DatabaseConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
  upload: UploadConfig;
  email: EmailConfig;
  logging: {
    level: string;
    file: string;
    console: boolean;
  };
}