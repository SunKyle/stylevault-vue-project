import { Table, Column, DataType, AllowNull, Index } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { BaseModel } from '../base/BaseModel';

/**
 * 天气数据模型
 * 存储天气信息，用于天气相关的推荐和过滤
 */
@Table({
  tableName: 'weather_data',
  paranoid: true,
  timestamps: true,
  indexes: [
    { name: 'idx_weather_city', fields: ['city'] },
    { name: 'idx_weather_date', fields: ['date'] },
    { name: 'idx_weather_city_date', fields: ['city', 'date'], unique: true },
    { name: 'idx_weather_temperature', fields: ['temperature'] },
    { name: 'idx_weather_condition', fields: ['condition'] }
  ]
})
export class WeatherData extends BaseModel<WeatherData> {
  /**
   * 城市名称
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [1, 100],
      notEmpty: true
    },
    comment: '城市名称'
  })
  city!: string;

  /**
   * 日期
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.DATEONLY,
    comment: '日期'
  })
  date!: Date;

  /**
   * 当前温度（摄氏度）
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.DECIMAL(4, 1),
    validate: {
      min: -50,
      max: 50
    },
    comment: '当前温度（摄氏度）'
  })
  temperature!: number;

  /**
   * 最低温度（摄氏度）
   */
  @Column({
    type: DataType.DECIMAL(4, 1),
    validate: {
      min: -50,
      max: 50
    },
    field: 'min_temperature',
    comment: '最低温度（摄氏度）'
  })
  minTemperature?: number;

  /**
   * 最高温度（摄氏度）
   */
  @Column({
    type: DataType.DECIMAL(4, 1),
    validate: {
      min: -50,
      max: 50
    },
    field: 'max_temperature',
    comment: '最高温度（摄氏度）'
  })
  maxTemperature?: number;

  /**
   * 天气状况
   */
  @AllowNull(false)
  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    comment: '天气状况'
  })
  condition!: string;

  /**
   * 天气状况代码
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(20),
    validate: {
      len: [1, 20],
      notEmpty: true
    },
    field: 'condition_code',
    comment: '天气状况代码'
  })
  conditionCode!: string;

  /**
   * 湿度百分比
   */
  @Column({
    type: DataType.DECIMAL(5, 2),
    validate: {
      min: 0,
      max: 100
    },
    comment: '湿度百分比'
  })
  humidity?: number;

  /**
   * 风速（km/h）
   */
  @Column({
    type: DataType.DECIMAL(5, 2),
    validate: {
      min: 0,
      max: 200
    },
    comment: '风速（km/h）'
  })
  windSpeed?: number;

  /**
   * 风向
   */
  @Column({
    type: DataType.STRING(20),
    validate: {
      len: [0, 20]
    },
    field: 'wind_direction',
    comment: '风向'
  })
  windDirection?: string;

  /**
   * 气压（hPa）
   */
  @Column({
    type: DataType.DECIMAL(6, 2),
    validate: {
      min: 800,
      max: 1200
    },
    comment: '气压（hPa）'
  })
  pressure?: number;

  /**
   * 能见度（km）
   */
  @Column({
    type: DataType.DECIMAL(4, 2),
    validate: {
      min: 0,
      max: 100
    },
    comment: '能见度（km）'
  })
  visibility?: number;

  /**
   * 紫外线指数
   */
  @Column({
    type: DataType.DECIMAL(3, 1),
    validate: {
      min: 0,
      max: 15
    },
    field: 'uv_index',
    comment: '紫外线指数'
  })
  uvIndex?: number;

  /**
   * 日出时间
   */
  @Column({
    type: DataType.TIME,
    field: 'sunrise_time',
    comment: '日出时间'
  })
  sunriseTime?: string;

  /**
   * 日落时间
   */
  @Column({
    type: DataType.TIME,
    field: 'sunset_time',
    comment: '日落时间'
  })
  sunsetTime?: string;

  /**
   * 天气图标URL
   */
  @Column({
    type: DataType.STRING(255),
    validate: {
      len: [0, 255]
    },
    field: 'icon_url',
    comment: '天气图标URL'
  })
  iconUrl?: string;

  /**
   * 天气描述
   */
  @Column({
    type: DataType.TEXT,
    validate: {
      len: [0, 500]
    },
    comment: '天气描述'
  })
  description?: string;

  /**
   * 数据来源
   */
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      len: [1, 50],
      notEmpty: true
    },
    field: 'data_source',
    comment: '数据来源'
  })
  dataSource!: string;

  /**
   * 原始数据（API返回的完整数据）
   */
  @Column({
    type: DataType.JSON,
    field: 'raw_data',
    comment: '原始数据'
  })
  rawData?: any;

  /**
   * 元数据（扩展信息）
   */
  @Column({
    type: DataType.JSON,
    defaultValue: {},
    comment: '元数据（扩展信息）'
  })
  metadata?: any;

  // ==================== 实例方法 ====================

  /**
   * 获取天气数据的完整信息
   */
  async getFullInfo() {
    return {
      id: this.id,
      city: this.city,
      date: this.date,
      temperature: this.temperature,
      minTemperature: this.minTemperature,
      maxTemperature: this.maxTemperature,
      condition: this.condition,
      conditionCode: this.conditionCode,
      humidity: this.humidity,
      windSpeed: this.windSpeed,
      windDirection: this.windDirection,
      pressure: this.pressure,
      visibility: this.visibility,
      uvIndex: this.uvIndex,
      sunriseTime: this.sunriseTime,
      sunsetTime: this.sunsetTime,
      iconUrl: this.iconUrl,
      description: this.description,
      dataSource: this.dataSource,
      rawData: this.rawData,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 获取天气适宜性评分（用于服装推荐）
   */
  getWeatherSuitabilityScore(): number {
    let score = 5; // 基础分数

    // 根据温度调整分数
    const temp = parseFloat(this.temperature.toString());
    if (temp < 0 || temp > 35) {
      score -= 2; // 极端天气
    } else if (temp < 5 || temp > 30) {
      score -= 1; // 较冷或较热
    }

    // 根据天气状况调整分数
    const condition = this.condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('storm')) {
      score -= 1.5; // 雨天
    } else if (condition.includes('snow')) {
      score -= 2; // 雪天
    } else if (condition.includes('fog') || condition.includes('haze')) {
      score -= 1; // 雾天或雾霾
    }

    // 根据风速调整分数
    if (this.windSpeed && this.windSpeed > 30) {
      score -= 1; // 大风天气
    }

    return Math.max(1, Math.min(5, score));
  }

  /**
   * 判断是否为适合户外活动的天气
   */
  isGoodForOutdoor(): boolean {
    const temp = parseFloat(this.temperature.toString());
    const condition = this.condition.toLowerCase();
    
    return (
      temp >= 15 && temp <= 30 &&
      !condition.includes('rain') &&
      !condition.includes('storm') &&
      !condition.includes('snow') &&
      (!this.windSpeed || this.windSpeed <= 25)
    );
  }

  /**
   * 获取推荐的服装类型
   */
  getRecommendedClothingTypes(): string[] {
    const temp = parseFloat(this.temperature.toString());
    const types: string[] = [];

    if (temp < 5) {
      types.push('winter', 'heavy-coat', 'scarf', 'gloves');
    } else if (temp < 15) {
      types.push('autumn', 'jacket', 'sweater');
    } else if (temp < 25) {
      types.push('spring', 'light-jacket', 'long-sleeve');
    } else {
      types.push('summer', 't-shirt', 'shorts', 'dress');
    }

    // 根据天气状况添加建议
    const condition = this.condition.toLowerCase();
    if (condition.includes('rain')) {
      types.push('raincoat', 'umbrella');
    }
    if (this.windSpeed && this.windSpeed > 20) {
      types.push('windbreaker');
    }
    if (this.uvIndex && this.uvIndex > 7) {
      types.push('hat', 'sunglasses');
    }

    return types;
  }

  // ==================== 静态方法 ====================

  /**
   * 根据城市和日期获取天气数据
   */
  static async findByCityAndDate(city: string, date: Date) {
    return this.findOne({
      where: { city, date }
    });
  }

  /**
   * 根据城市获取最新天气数据
   */
  static async findLatestByCity(city: string) {
    return this.findOne({
      where: { city },
      order: [['date', 'DESC']]
    });
  }

  /**
   * 获取城市的天气历史数据
   */
  static async getWeatherHistory(city: string, startDate: Date, endDate: Date) {
    return this.findAll({
      where: {
        city,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });
  }

  /**
   * 获取未来天气预报
   */
  static async getForecast(city: string, days: number = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);

    return this.findAll({
      where: {
        city,
        date: {
          [Op.gte]: today,
          [Op.lte]: futureDate
        }
      },
      order: [['date', 'ASC']]
    });
  }

  /**
   * 批量保存天气数据
   */
  static async batchSaveWeatherData(weatherDataList: Array<{
    city: string;
    date: Date;
    temperature: number;
    minTemperature?: number;
    maxTemperature?: number;
    condition: string;
    conditionCode: string;
    humidity?: number;
    windSpeed?: number;
    windDirection?: string;
    pressure?: number;
    visibility?: number;
    uvIndex?: number;
    sunriseTime?: string;
    sunsetTime?: string;
    iconUrl?: string;
    description?: string;
    dataSource: string;
    rawData?: any;
  }>): Promise<WeatherData[]> {
    return this.bulkCreate(weatherDataList as any, {
      updateOnDuplicate: [
        'temperature',
        'minTemperature',
        'maxTemperature',
        'condition',
        'conditionCode',
        'humidity',
        'windSpeed',
        'windDirection',
        'pressure',
        'visibility',
        'uvIndex',
        'sunriseTime',
        'sunsetTime',
        'iconUrl',
        'description',
        'rawData',
        'updatedAt'
      ]
    });
  }

  /**
   * 获取适合服装推荐的城市天气
   */
  static async getCitiesForRecommendation(cities: string[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.findAll({
      where: {
        city: cities,
        date: today
      },
      order: [['city', 'ASC']]
    });
  }

  /**
   * 清理旧天气数据
   */
  static async cleanupOldWeatherData(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return this.destroy({
      where: {
        date: { [Op.lt]: cutoffDate }
      }
    });
  }
}