// 天气相关API服务
// import apiClient from '../core/axiosConfig'; // 暂时注释，使用模拟数据

// 模拟天气数据
const mockWeatherData = {
  currentWeather: {
    weather: '晴天',
    temperature: 25,
    humidity: 50,
    windSpeed: 10,
    location: '北京',
  },
  forecast: [
    { date: '2024-05-20', weather: '晴天', temperature: 26 },
    { date: '2024-05-21', weather: '多云', temperature: 24 },
    { date: '2024-05-22', weather: '小雨', temperature: 20 },
  ],
};

// 模拟生成天气推荐搭配的函数
const generateMockOutfitRecommendations = (weather, clothes) => {
  // 简单的模拟逻辑：根据天气温度和衣物类型生成推荐
  const { temperature, weather: condition } = weather;
  const recommendations = [];

  // 为每种天气状况生成2套推荐
  for (let i = 0; i < 2; i++) {
    const outfit = {
      id: `mock-outfit-${Date.now()}-${i}`,
      name: `${temperature}°C ${condition} 推荐搭配 ${i + 1}`,
      items: [],
      weather: condition,
      temperature: temperature,
      rating: Math.floor(Math.random() * 5) + 1,
    };

    // 根据温度添加合适的衣物
    if (temperature < 15) {
      // 寒冷天气
      const coat = clothes.find(c => c.type === '外套');
      const sweater = clothes.find(c => c.type === '毛衣');
      const pants = clothes.find(c => c.type === '裤子');
      const shoes = clothes.find(c => c.type === '鞋子');

      if (coat) outfit.items.push(coat);
      if (sweater) outfit.items.push(sweater);
      if (pants) outfit.items.push(pants);
      if (shoes) outfit.items.push(shoes);
    } else if (temperature < 25) {
      // 温暖天气
      const shirt = clothes.find(c => c.type === '衬衫');
      const pants = clothes.find(c => c.type === '裤子');
      const shoes = clothes.find(c => c.type === '鞋子');

      if (shirt) outfit.items.push(shirt);
      if (pants) outfit.items.push(pants);
      if (shoes) outfit.items.push(shoes);
    } else {
      // 炎热天气
      const tshirt = clothes.find(c => c.type === 'T恤');
      const shorts = clothes.find(c => c.type === '短裤');
      const sandals = clothes.find(c => c.type === '鞋子' && c.name.includes('凉鞋'));

      if (tshirt) outfit.items.push(tshirt);
      if (shorts) outfit.items.push(shorts);
      if (sandals) outfit.items.push(sandals);
      else {
        const shoes = clothes.find(c => c.type === '鞋子');
        if (shoes) outfit.items.push(shoes);
      }
    }

    if (outfit.items.length >= 2) {
      recommendations.push(outfit);
    }
  }

  return recommendations;
};

const weatherApi = {
  // 获取当前天气
  async getCurrentWeather(location) {
    try {
      // 在实际项目中，这里应该调用真实的天气API
      // const response = await apiClient.get(`/weather/current?lat=${location.lat}&lon=${location.lng}`);
      // return response.data;

      // 使用模拟数据
      return {
        ...mockWeatherData.currentWeather,
        location: location.name,
      };
    } catch (error) {
      console.error('获取当前天气失败:', error);
      throw new Error('获取天气信息失败');
    }
  },

  // 获取天气预报
  async getWeatherForecast() {
    try {
      // 在实际项目中，这里应该调用真实的天气API
      // const response = await apiClient.get(`/weather/forecast?lat=${location.lat}&lon=${location.lng}`);
      // return response.data;

      // 使用模拟数据
      return mockWeatherData.forecast;
    } catch (error) {
      console.error('获取天气预报失败:', error);
      throw new Error('获取天气预报失败');
    }
  },

  // 获取天气推荐搭配
  async getOutfitRecommendations({ weather, clothes }) {
    try {
      // 在实际项目中，这里应该调用真实的推荐API
      // const response = await apiClient.post('/outfit-recommendations/weather', { weather, clothes });
      // return response.data;

      // 使用模拟数据生成推荐
      return generateMockOutfitRecommendations(weather, clothes);
    } catch (error) {
      console.error('获取天气推荐搭配失败:', error);
      throw new Error('获取天气推荐搭配失败');
    }
  },
};

export default weatherApi;
