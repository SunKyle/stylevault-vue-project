import { Table, Column, DataType, ForeignKey, BelongsTo, AllowNull, Default, Index } from 'sequelize-typescript';
import { BaseModel } from '../base/BaseModel';
import { User } from './User';
import { StyleProfile, WeatherPreference, SizePreference } from '../../types/model.types';

/**
 * 用户偏好设置模型
 * 存储用户的个性化偏好设置，包括风格偏好、天气偏好、尺码偏好等
 */
@Table({
  tableName: 'user_preferences',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_user_pref_user_id', fields: ['user_id'], unique: true },
    { name: 'idx_user_pref_style', fields: ['style_profile'] },
    { name: 'idx_user_pref_weather', fields: ['weather_preference'] }
  ]
})
export class UserPreferences extends BaseModel<UserPreferences> {
  /**
   * 所属用户ID
   */
  @ForeignKey(() => User)
  @AllowNull(false)
  @Index({ unique: true })
  @Column({
    type: DataType.INTEGER,
    field: 'user_id',
    comment: '所属用户ID'
  })
  userId!: number;

  /**
   * 风格偏好配置
   */
  @Column({
    type: DataType.JSON,
    field: 'style_profile',
    defaultValue: {},
    comment: '风格偏好配置'
  })
  styleProfile!: StyleProfile;

  /**
   * 天气偏好配置
   */
  @Column({
    type: DataType.JSON,
    field: 'weather_preference',
    defaultValue: {},
    comment: '天气偏好配置'
  })
  weatherPreference!: WeatherPreference;

  /**
   * 尺码偏好配置
   */
  @Column({
    type: DataType.JSON,
    field: 'size_preference',
    defaultValue: {},
    comment: '尺码偏好配置'
  })
  sizePreference!: SizePreference;

  /**
   * 颜色偏好（颜色ID数组）
   */
  @Column({
    type: DataType.JSON,
    field: 'color_preferences',
    defaultValue: [],
    comment: '颜色偏好（颜色ID数组）'
  })
  colorPreferences!: number[];

  /**
   * 品牌偏好（品牌名称数组）
   */
  @Column({
    type: DataType.JSON,
    field: 'brand_preferences',
    defaultValue: [],
    comment: '品牌偏好（品牌名称数组）'
  })
  brandPreferences!: string[];

  /**
   * 价格范围偏好
   */
  @Column({
    type: DataType.JSON,
    field: 'price_range',
    defaultValue: { min: 0, max: 1000 },
    comment: '价格范围偏好'
  })
  priceRange!: { min: number; max: number };

  /**
   * 季节偏好
   */
  @Column({
    type: DataType.JSON,
    field: 'season_preferences',
    defaultValue: ['spring', 'summer', 'autumn', 'winter'],
    comment: '季节偏好'
  })
  seasonPreferences!: string[];

  /**
   * 场合偏好
   */
  @Column({
    type: DataType.JSON,
    field: 'occasion_preferences',
    defaultValue: ['casual', 'formal', 'business', 'sport', 'party', 'daily'],
    comment: '场合偏好'
  })
  occasionPreferences!: string[];

  /**
   * 通知偏好设置
   */
  @Column({
    type: DataType.JSON,
    field: 'notification_settings',
    defaultValue: {
      email: true,
      push: true,
      outfitRecommendations: true,
      weatherAlerts: true,
      newFeatures: true
    },
    comment: '通知偏好设置'
  })
  notificationSettings!: {
    email: boolean;
    push: boolean;
    outfitRecommendations: boolean;
    weatherAlerts: boolean;
    newFeatures: boolean;
  };

  /**
   * 隐私设置
   */
  @Column({
    type: DataType.JSON,
    field: 'privacy_settings',
    defaultValue: {
      profilePublic: false,
      outfitsPublic: false,
      clothingPublic: false,
      allowComments: true,
      allowSharing: true
    },
    comment: '隐私设置'
  })
  privacySettings!: {
    profilePublic: boolean;
    outfitsPublic: boolean;
    clothingPublic: boolean;
    allowComments: boolean;
    allowSharing: boolean;
  };

  /**
   * 推荐设置
   */
  @Column({
    type: DataType.JSON,
    field: 'recommendation_settings',
    defaultValue: {
      enabled: true,
      frequency: 'daily',
      types: ['outfit', 'purchase', 'style'],
      sensitivity: 0.7
    },
    comment: '推荐设置'
  })
  recommendationSettings!: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    types: string[];
    sensitivity: number;
  };

  /**
   * 界面设置
   */
  @Column({
    type: DataType.JSON,
    field: 'ui_settings',
    defaultValue: {
      theme: 'light',
      language: 'zh-CN',
      currency: 'CNY',
      temperatureUnit: 'celsius',
      dateFormat: 'YYYY-MM-DD'
    },
    comment: '界面设置'
  })
  uiSettings!: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
    temperatureUnit: 'celsius' | 'fahrenheit';
    dateFormat: string;
  };

  /**
   * 元数据（扩展信息）
   */
  @Column({
    type: DataType.JSON,
    defaultValue: {},
    comment: '元数据（扩展信息）'
  })
  metadata?: any;

  // ==================== 关联关系 ====================

  /**
   * 所属用户
   */
  @BelongsTo(() => User, {
    foreignKey: 'userId',
    as: 'user'
  })
  user!: User;

  // ==================== 实例方法 ====================

  /**
   * 获取用户偏好的完整信息
   */
  async getFullInfo() {
    const user = await this.$get('user');

    return {
      id: this.id,
      userId: this.userId,
      styleProfile: this.styleProfile,
      weatherPreference: this.weatherPreference,
      sizePreference: this.sizePreference,
      colorPreferences: this.colorPreferences,
      brandPreferences: this.brandPreferences,
      priceRange: this.priceRange,
      seasonPreferences: this.seasonPreferences,
      occasionPreferences: this.occasionPreferences,
      notificationSettings: this.notificationSettings,
      privacySettings: this.privacySettings,
      recommendationSettings: this.recommendationSettings,
      uiSettings: this.uiSettings,
      user: user ? { id: user.id, username: user.username, email: user.email } : null,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 更新风格偏好
   */
  async updateStyleProfile(updates: Partial<StyleProfile>) {
    this.styleProfile = {
      ...this.styleProfile,
      ...updates
    };
    await this.save();
  }

  /**
   * 更新天气偏好
   */
  async updateWeatherPreference(updates: Partial<WeatherPreference>) {
    this.weatherPreference = {
      ...this.weatherPreference,
      ...updates
    };
    await this.save();
  }

  /**
   * 更新尺码偏好
   */
  async updateSizePreference(updates: Partial<SizePreference>) {
    this.sizePreference = {
      ...this.sizePreference,
      ...updates
    };
    await this.save();
  }

  /**
   * 添加颜色偏好
   */
  async addColorPreference(colorId: number) {
    if (!this.colorPreferences.includes(colorId)) {
      this.colorPreferences = [...this.colorPreferences, colorId];
      await this.save();
    }
  }

  /**
   * 移除颜色偏好
   */
  async removeColorPreference(colorId: number) {
    this.colorPreferences = this.colorPreferences.filter(id => id !== colorId);
    await this.save();
  }

  /**
   * 添加品牌偏好
   */
  async addBrandPreference(brand: string) {
    if (!this.brandPreferences.includes(brand)) {
      this.brandPreferences = [...this.brandPreferences, brand];
      await this.save();
    }
  }

  /**
   * 移除品牌偏好
   */
  async removeBrandPreference(brand: string) {
    this.brandPreferences = this.brandPreferences.filter(b => b !== brand);
    await this.save();
  }

  /**
   * 更新价格范围
   */
  async updatePriceRange(min: number, max: number) {
    this.priceRange = { min, max };
    await this.save();
  }

  /**
   * 检查价格是否在偏好范围内
   */
  isPriceInRange(price: number): boolean {
    return price >= this.priceRange.min && price <= this.priceRange.max;
  }

  /**
   * 获取推荐权重配置
   */
  getRecommendationWeights() {
    return {
      style: this.styleProfile.weight || 0.3,
      weather: this.weatherPreference.weight || 0.2,
      color: 0.15,
      brand: 0.1,
      price: 0.15,
      season: 0.1
    };
  }

  // ==================== 静态方法 ====================

  /**
   * 根据用户ID获取偏好设置
   */
  static async findByUserId(userId: number) {
    return this.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
  }

  /**
   * 创建或更新用户偏好设置
   */
  static async createOrUpdate(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const [userPreferences, created] = await this.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        ...preferences
      } as any
    });

    if (!created && preferences) {
      await userPreferences.update(preferences);
    }

    return userPreferences;
  }

  /**
   * 获取用户的推荐配置
   */
  static async getRecommendationConfig(userId: number) {
    const preferences = await this.findByUserId(userId);
    if (!preferences) {
      return null;
    }

    return {
      enabled: preferences.recommendationSettings.enabled,
      frequency: preferences.recommendationSettings.frequency,
      types: preferences.recommendationSettings.types,
      sensitivity: preferences.recommendationSettings.sensitivity,
      weights: preferences.getRecommendationWeights(),
      priceRange: preferences.priceRange,
      colorPreferences: preferences.colorPreferences,
      brandPreferences: preferences.brandPreferences,
      seasonPreferences: preferences.seasonPreferences,
      occasionPreferences: preferences.occasionPreferences
    };
  }
}