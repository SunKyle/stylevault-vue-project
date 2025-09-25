import { WeatherData } from '../models/entities/WeatherData';
import { DataType } from 'sequelize';

/**
 * 天气数据查询选项
 */
export interface WeatherDataQueryOptions {
  /** 城市 */
  cities?: string[];
  /** 国家 */
  countries?: string[];
  /** 最小温度 */
  minTemperature?: number;
  /** 最大温度 */
  maxTemperature?: number;
  /** 天气状况 */
  conditions?: string[];
  /** 最小湿度 */
  minHumidity?: number;
  /** 最大湿度 */
  maxHumidity?: number;
  /** 最小风速 */
  minWindSpeed?: number;
  /** 最大风速 */
  maxWindSpeed?: number;
  /** 开始日期 */
  startDate?: Date;
  /** 结束日期 */
  endDate?: Date;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'ASC' | 'DESC';
  /** 限制数量 */
  limit?: number;
  /** 偏移量 */
  offset?: number;
}

/**
 * 天气适合度评分
 */
export interface WeatherSuitabilityScore {
  /** 总体适合度评分 (0-100) */
  overall: number;
  /** 温度适合度评分 (0-100) */
  temperature: number;
  /** 湿度适合度评分 (0-100) */
  humidity: number;
  /** 风速适合度评分 (0-100) */
  windSpeed: number;
  /** 天气状况适合度评分 (0-100) */
  condition: number;
  /** 推荐的衣物类型 */
  recommendedClothingTypes: string[];
  /** 适合度说明 */
  explanation: string;
}

/**
 * 天气统计信息
 */
export interface WeatherStats {
  /** 平均温度 */
  averageTemperature: number;
  /** 最高温度 */
  maxTemperature: number;
  /** 最低温度 */
  minTemperature: number;
  /** 平均湿度 */
  averageHumidity: number;
  /** 平均风速 */
  averageWindSpeed: number;
  /** 天气状况分布 */
  conditionDistribution: Record<string, number>;
}

/**
 * 天气数据仓库类，封装天气数据的访问逻辑
 */
export class WeatherDataRepository {
  /**
   * 查找所有天气数据
   * @param options 查询选项
   * @returns 天气数据列表
   */
  async findAll(options: WeatherDataQueryOptions = {}): Promise<WeatherData[]> {
    const { 
      cities, 
      countries, 
      minTemperature, 
      maxTemperature, 
      conditions, 
      minHumidity, 
      maxHumidity, 
      minWindSpeed, 
      maxWindSpeed, 
      startDate, 
      endDate, 
      sortBy = 'date', 
      sortOrder = 'DESC', 
      limit = 100, 
      offset = 0 
    } = options;
    
    const where: any = {};
    
    if (cities && cities.length > 0) {
      where.city = cities;
    }
    
    if (countries && countries.length > 0) {
      where.country = countries;
    }
    
    if (minTemperature !== undefined || maxTemperature !== undefined) {
      where.temperature = {};
      if (minTemperature !== undefined) {
        where.temperature['$gte'] = minTemperature;
      }
      if (maxTemperature !== undefined) {
        where.temperature['$lte'] = maxTemperature;
      }
    }
    
    if (conditions && conditions.length > 0) {
      where.condition = conditions;
    }
    
    if (minHumidity !== undefined || maxHumidity !== undefined) {
      where.humidity = {};
      if (minHumidity !== undefined) {
        where.humidity['$gte'] = minHumidity;
      }
      if (maxHumidity !== undefined) {
        where.humidity['$lte'] = maxHumidity;
      }
    }
    
    if (minWindSpeed !== undefined || maxWindSpeed !== undefined) {
      where.windSpeed = {};
      if (minWindSpeed !== undefined) {
        where.windSpeed['$gte'] = minWindSpeed;
      }
      if (maxWindSpeed !== undefined) {
        where.windSpeed['$lte'] = maxWindSpeed;
      }
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date['$gte'] = startDate;
      }
      if (endDate) {
        where.date['$lte'] = endDate;
      }
    }
    
    return WeatherData.findAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });
  }

  /**
   * 根据ID查找天气数据
   * @param id 天气数据ID
   * @returns 天气数据对象或null
   */
  async findById(id: number): Promise<WeatherData | null> {
    return WeatherData.findByPk(id);
  }

  /**
   * 根据城市和日期查找天气数据
   * @param city 城市
   * @param date 日期
   * @returns 天气数据对象或null
   */
  async findByCityAndDate(city: string, date: Date): Promise<WeatherData | null> {
    // 设置日期为当天的开始
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    // 设置日期为当天的结束
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return WeatherData.findOne({
      where: {
        city,
        date: {
          '$between': [startDate, endDate]
        }
      }
    });
  }

  /**
   * 获取城市天气预报
   * @param city 城市
   * @param days 预报天数
   * @returns 天气预报数据列表
   */
  async getForecast(city: string, days: number = 7): Promise<WeatherData[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);
    
    return this.findAll({
      cities: [city],
      startDate: today,
      endDate,
      sortBy: 'date',
      sortOrder: 'ASC'
    });
  }

  /**
   * 创建天气数据
   * @param data 天气数据
   * @returns 创建的天气数据对象
   */
  async create(data: Omit<Partial<WeatherData>, 'id'>): Promise<WeatherData> {
    return WeatherData.create(data as any);
  }

  /**
   * 批量创建天气数据
   * @param weatherDataList 天气数据数组
   * @returns 创建的天气数据对象数组
   */
  async createBatch(weatherDataList: Omit<Partial<WeatherData>, 'id'>[]): Promise<WeatherData[]> {
    return WeatherData.bulkCreate(weatherDataList as any[]);
  }

  /**
   * 更新天气数据
   * @param id 天气数据ID
   * @param data 更新数据
   * @returns 更新后的天气数据对象或null
   */
  async update(id: number, data: Partial<WeatherData>): Promise<WeatherData | null> {
    const weatherData = await this.findById(id);
    if (!weatherData) {
      return null;
    }
    
    return weatherData.update(data);
  }

  /**
   * 删除天气数据
   * @param id 天气数据ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const result = await WeatherData.destroy({ where: { id } });
    return result > 0;
  }

  /**
   * 删除指定日期之前的天气数据
   * @param beforeDate 截止日期
   * @returns 删除的数量
   */
  async deleteBeforeDate(beforeDate: Date): Promise<number> {
    return WeatherData.destroy({
      where: {
        date: {
          '$lt': beforeDate
        }
      }
    });
  }

  /**
   * 获取天气适合度评分
   * @param city 城市
   * @param date 日期
   * @returns 天气适合度评分
   */
  async getWeatherSuitabilityScore(city: string, date: Date): Promise<WeatherSuitabilityScore | null> {
    const weatherData = await this.findByCityAndDate(city, date);
    if (!weatherData) {
      return null;
    }
    
    // 这里简化实现，假设我们直接返回天气数据中的评分
    // 实际应该有计算逻辑
    return {
      overall: 80,
      temperature: 85,
      humidity: 75,
      windSpeed: 90,
      condition: 80,
      recommendedClothingTypes: ['轻薄外套', '长袖衬衫'],
      explanation: '天气宜人，适合外出活动'
    };
  }

  /**
   * 获取推荐的衣物类型
   * @param city 城市
   * @param date 日期
   * @returns 推荐的衣物类型列表
   */
  async getRecommendedClothingTypes(city: string, date: Date): Promise<string[]> {
    const weatherData = await this.findByCityAndDate(city, date);
    if (!weatherData) {
      return [];
    }
    
    // 这里简化实现，实际应该根据天气数据计算推荐衣物
    return ['轻薄外套', '长袖衬衫'];
  }

  /**
   * 获取城市天气统计
   * @param city 城市
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 天气统计信息
   */
  async getCityWeatherStats(
    city: string,
    startDate: Date,
    endDate: Date
  ): Promise<WeatherStats> {
    const weatherData = await this.findAll({
      cities: [city],
      startDate,
      endDate
    });
    
    if (weatherData.length === 0) {
      return {
        averageTemperature: 0,
        maxTemperature: 0,
        minTemperature: 0,
        averageHumidity: 0,
        averageWindSpeed: 0,
        conditionDistribution: {}
      };
    }
    
    // 计算统计数据
    const totalTemperature = weatherData.reduce((sum, data) => sum + (data.temperature || 0), 0);
    const maxTemperature = Math.max(...weatherData.map(data => data.temperature || 0));
    const minTemperature = Math.min(...weatherData.map(data => data.temperature || 0));
    const totalHumidity = weatherData.reduce((sum, data) => sum + (data.humidity || 0), 0);
    const totalWindSpeed = weatherData.reduce((sum, data) => sum + (data.windSpeed || 0), 0);
    
    // 统计天气状况分布
    const conditionDistribution: Record<string, number> = {};
    weatherData.forEach(data => {
      if (data.condition) {
        conditionDistribution[data.condition] = 
          (conditionDistribution[data.condition] || 0) + 1;
      }
    });
    
    return {
      averageTemperature: totalTemperature / weatherData.length,
      maxTemperature,
      minTemperature,
      averageHumidity: totalHumidity / weatherData.length,
      averageWindSpeed: totalWindSpeed / weatherData.length,
      conditionDistribution
    };
  }

  /**
   * 获取多个城市的天气数据
   * @param cities 城市列表
   * @param date 日期
   * @returns 天气数据列表
   */
  async getWeatherForCities(cities: string[], date: Date): Promise<WeatherData[]> {
    // 设置日期为当天的开始
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    // 设置日期为当天的结束
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return WeatherData.findAll({
      where: {
        city: cities,
        date: {
          '$between': [startDate, endDate]
        }
      }
    });
  }

  /**
   * 获取温度趋势数据
   * @param city 城市
   * @param days 天数
   * @returns 按日期的温度数据
   */
  async getTemperatureTrend(city: string, days: number = 30): Promise<{
    date: Date;
    temperature: number;
  }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const weatherData = await this.findAll({
      cities: [city],
      startDate,
      endDate,
      sortBy: 'date',
      sortOrder: 'ASC'
    });
    
    return weatherData.map(data => ({
      date: data.date,
      temperature: data.temperature || 0
    }));
  }

  /**
   * 检查是否需要更新特定城市的天气数据
   * @param city 城市
   * @param date 日期
   * @returns 是否需要更新
   */
  async shouldUpdateWeatherData(city: string, date: Date): Promise<boolean> {
    const existing = await this.findByCityAndDate(city, date);
    
    // 如果数据不存在或超过24小时，则需要更新
    if (!existing) {
      return true;
    }
    
    const hoursSinceLastUpdate = 
      (new Date().getTime() - existing.updatedAt.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceLastUpdate > 24;
  }
}