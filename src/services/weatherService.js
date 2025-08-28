import BaseService from './baseService';

class WeatherService extends BaseService {
  constructor() {
    super();
    this.baseURL = '/api/weather';
  }

  async getCurrentWeather(location) {
    try {
      // 模拟API调用，实际项目中替换为真实API
      const response = await this.request({
        method: 'GET',
        url: `${this.baseURL}/current`,
        params: {
          lat: location.lat,
          lng: location.lng,
        },
      });

      return response.data || this.getMockCurrentWeather();
    } catch (error) {
      console.warn('使用模拟天气数据:', error.message);
      return this.getMockCurrentWeather();
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

      return response.data || this.getMockForecast();
    } catch (error) {
      console.warn('使用模拟天气预报数据:', error.message);
      return this.getMockForecast();
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

      return response.data || this.generateMockRecommendations(weather, clothes);
    } catch (error) {
      return this.generateMockRecommendations(weather, clothes);
    }
  }

  getMockCurrentWeather() {
    return {
      temperature: 22,
      condition: '晴朗',
      humidity: 65,
      windSpeed: 12,
      icon: '☀️',
    };
  }

  getMockForecast() {
    return [
      { date: '今天', temperature: 22, condition: '晴朗', icon: '☀️' },
      { date: '明天', temperature: 24, condition: '多云', icon: '⛅' },
      { date: '后天', temperature: 20, condition: '小雨', icon: '🌧️' },
      { date: '周四', temperature: 19, condition: '阴天', icon: '☁️' },
      { date: '周五', temperature: 23, condition: '晴朗', icon: '☀️' },
      { date: '周六', temperature: 25, condition: '晴朗', icon: '☀️' },
      { date: '周日', temperature: 21, condition: '多云', icon: '⛅' },
    ];
  }

  generateMockRecommendations(weather, clothes) {
    // 根据天气生成简单的推荐搭配
    const temp = weather.temperature;
    const suitableClothes = clothes.filter(item => {
      if (temp < 10) return item.type === '外套' || item.type === '毛衣';
      if (temp < 20) return item.type === '外套' || item.type === '长袖';
      if (temp < 30) return item.type === 'T恤' || item.type === '衬衫';
      return item.type === 'T恤' || item.type === '短裤';
    });

    return [
      {
        id: Date.now(),
        name: `${temp}°C 推荐搭配`,
        items: suitableClothes.slice(0, 3),
        weather: weather,
      },
    ];
  }
}

export const weatherService = new WeatherService();
