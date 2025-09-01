// Stores 入口文件 - 统一导出所有 store
export { useAnalyticsStore } from './modules/analyticsStore';
export { useClothingStore } from './modules/clothingStore';
export { useInspirationStore } from './modules/inspirationStore';
export { useOutfitStore } from './modules/outfitStore';
export { useUserStore } from './modules/userStore';
export { useUiStore } from './modules/uiStore';
export { useWeatherStore } from './modules/weatherStore';
// 注意：wardrobeStore已被clothingStore替代，保留兼容导出

// 创建 store 初始化函数
export const initializeStores = async () => {
  try {
    // 按需初始化核心 store
    const { useUserStore } = await import('./modules/userStore');
    const { useUiStore } = await import('./modules/uiStore');

    const userStore = useUserStore();
    const uiStore = useUiStore();

    // 初始化用户偏好设置
    await userStore.initializeUser();

    // 设置 UI 主题
    uiStore.setTheme(userStore.preferences.colorScheme);

    console.log('✅ 所有 store 初始化完成');
  } catch (error) {
    console.error('❌ Store 初始化失败:', error);
  }
};

// 创建批量刷新函数
export const refreshAllStores = async () => {
  const promises = [];

  try {
    const { useClothingStore } = await import('./modules/clothingStore');
    const { useAnalyticsStore } = await import('./modules/analyticsStore');
    const { useWeatherStore } = await import('./modules/weatherStore');

    const clothingStore = useClothingStore();
    const analyticsStore = useAnalyticsStore();
    const weatherStore = useWeatherStore();

    // 并行刷新数据
    promises.push(
      clothingStore.refreshData?.(),
      analyticsStore.refreshAllData?.(),
      weatherStore.refreshWeatherData?.()
    );

    await Promise.all(promises);
    console.log('🔄 所有数据刷新完成');
  } catch (error) {
    console.error('❌ 数据刷新失败:', error);
  }
};

// 创建 store 清理函数
export const cleanupStores = () => {
  // 清理缓存数据
  localStorage.removeItem('wardrobe-cache');
  sessionStorage.removeItem('ui-state');
  console.log('🧹 Store 清理完成');
};

// 导出 store 工具函数
export const storeUtils = {
  // 防抖刷新
  debounceRefresh: (delay = 1000) => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(refreshAllStores, delay);
    };
  },

  // 错误处理
  handleStoreError: (error, storeName) => {
    console.error(`${storeName} 错误:`, error);
    // 可以集成错误上报服务
    if (window.errorReporter) {
      window.errorReporter.report(error, { store: storeName });
    }
  },

  // 性能监控
  measureStoreAction: async (actionName, actionFn) => {
    const start = performance.now();
    try {
      const result = await actionFn();
      const duration = performance.now() - start;
      console.log(`${actionName} 耗时: ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${actionName} 失败 (${duration.toFixed(2)}ms):`, error);
      throw error;
    }
  },
};
