import { defineStore } from 'pinia';
import { weatherService } from '../services/weatherService';
import { useClothingStore } from './clothingStore';
import { useOutfitStore } from './outfitStore';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentWeather: null,
    weatherForecast: [],
    recommendedOutfits: [],
    location: null,
    loading: false,
    error: null,
    lastUpdated: null,
  }),

  getters: {
    hasWeatherData: state => !!state.currentWeather,
    isRaining: state => state.currentWeather?.weather?.includes('雨') || false,
    temperature: state => state.currentWeather?.temperature || 0,
    weatherCondition: state => state.currentWeather?.weather || '未知',
    locationName: state => state.location?.name || '未知位置',
  },

  actions: {
    async fetchCurrentWeather(location) {
      this.loading = true;
      this.error = null;
      try {
        const weatherData = await weatherService.getCurrentWeather(location);
        this.currentWeather = weatherData;
        this.location = location;
        this.lastUpdated = new Date();

        // 获取天气推荐搭配
        await this.fetchWeatherRecommendedOutfits();

        return weatherData;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchWeatherForecast(location) {
      this.loading = true;
      this.error = null;
      try {
        const forecast = await weatherService.getWeatherForecast(location);
        this.weatherForecast = forecast;
        return forecast;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchWeatherRecommendedOutfits() {
      if (!this.currentWeather) return;

      const clothingStore = useClothingStore();
      const outfitStore = useOutfitStore();

      try {
        // 根据天气条件筛选合适的衣物
        const suitableClothes = clothingStore.clothingItems.filter(item => {
          const isWeatherAppropriate = this.isWeatherAppropriate(item);
          return isWeatherAppropriate && item.isClean;
        });

        // 生成推荐搭配
        const recommended = await weatherService.getOutfitRecommendations({
          weather: this.currentWeather,
          clothes: suitableClothes,
        });

        this.recommendedOutfits = recommended;
      } catch (error) {
        console.error('获取天气推荐搭配失败:', error);
      }
    },

    isWeatherAppropriate(item) {
      const temp = this.temperature;

      // 根据温度判断衣物是否合适
      if (item.type === '外套') {
        return temp < 20;
      } else if (item.type === '毛衣') {
        return temp < 15;
      } else if (item.type === 'T恤') {
        return temp > 15;
      } else if (item.type === '短裤') {
        return temp > 25;
      }

      return true;
    },

    async updateLocation(newLocation) {
      this.location = newLocation;
      await this.fetchCurrentWeather(newLocation);
    },

    clearWeatherData() {
      this.currentWeather = null;
      this.weatherForecast = [];
      this.recommendedOutfits = [];
      this.error = null;
    },

    async initializeWeatherData() {
      // 初始化时尝试获取默认位置的天气
      const defaultLocation = { name: '北京', lat: 39.9042, lng: 116.4074 };
      await this.fetchCurrentWeather(defaultLocation);
    },
  },
});
