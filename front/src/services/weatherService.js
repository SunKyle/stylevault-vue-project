import BaseService from './baseService';

class WeatherService extends BaseService {
  constructor() {
    super();
    this.baseURL = '/api/weather';
  }

  async getCurrentWeather(location) {
    try {
      const response = await this.request({
        method: 'GET',
        url: `${this.baseURL}/current`,
        params: {
          lat: location.lat,
          lng: location.lng,
        },
      });

      return response.data;
    } catch (error) {
      console.error('获取天气数据失败:', error.message);
      throw error;
    }
  }

  async getWeatherForecast(location) {
    try {
      const response = await this.request({
        method: 'GET',
        url: `${this.baseURL}/forecast`,
        params: {
          lat: location.lat,
          lng: location.lng,
          days: 7,
        },
      });

      return response.data;
    } catch (error) {
      console.error('获取天气预报失败:', error.message);
      throw error;
    }
  }

  async getOutfitRecommendations({ weather, clothes }) {
    try {
      const response = await this.request({
        method: 'POST',
        url: `${this.baseURL}/recommendations`,
        data: {
          weather,
          clothes,
        },
      });

      return response.data;
    } catch (error) {
      console.error('获取搭配推荐失败:', error.message);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();
