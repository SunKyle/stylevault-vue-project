/**
 * Store 工具函数集合
 * 提供统一的 Setter 方法和通用工具函数
 */

// 防抖刷新函数
let refreshTimer = null;
const DEBOUNCE_DELAY = 300;

export const debounceRefresh = (callback, delay = DEBOUNCE_DELAY) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  refreshTimer = setTimeout(() => {
    callback();
    refreshTimer = null;
  }, delay);
};

// 错误处理包装器
export const handleStoreError = (error, context = 'Store Operation') => {
  console.error(`[${context}] Error:`, error);
  // 可以扩展为统一错误上报或 toast 提示
  return {
    success: false,
    error: error.message || 'Unknown error',
    context,
  };
};

// 性能监控函数
export const measureStoreAction = (actionName, actionFn) => {
  const startTime = performance.now();
  try {
    const result = actionFn();
    const duration = performance.now() - startTime;
    if (duration > 100) {
      console.warn(`[Store Performance] ${actionName} took ${duration.toFixed(2)}ms`);
    }
    return result;
  } catch (error) {
    console.error(`[Store Performance] ${actionName} failed:`, error);
    throw error;
  }
};

// Local Storage 包装器
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`[Storage] Failed to get ${key}:`, error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[Storage] Failed to set ${key}:`, error);
      return false;
    }
  },
  remove: key => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[Storage] Failed to remove ${key}:`, error);
      return false;
    }
  },
};

// 统一 Setter 方法 - 设置认证信息
export const setAuthData = (store, data) => {
  store.user = data.user || null;
  store.token = data.token || null;
  store.isAuthenticated = !!data.token && !!data.user;
  storage.set('token', data.token); // 修改：将 'auth_token' 改为 'token'
  storage.set('user_info', data.user);
};

// 统一 Setter 方法 - 清除认证信息
export const clearAuthData = store => {
  store.user = null;
  store.token = null;
  store.isAuthenticated = false;
  storage.remove('token'); // 修改：将 'auth_token' 改为 'token'
  storage.remove('user_info');
};

// 统一 Setter 方法 - 设置用户偏好
export const setUserPreferences = (store, preferences) => {
  const validKeys = ['temperatureUnit', 'colorScheme', 'defaultView', 'notifications'];
  const sanitizedPrefs = {};
  for (const key of validKeys) {
    if (preferences[key] !== undefined) {
      sanitizedPrefs[key] = preferences[key];
    }
  }
  store.preferences = { ...store.preferences, ...sanitizedPrefs };
  storage.set('user_preferences', store.preferences);
};

// 统一 Setter 方法 - 加载本地存储的认证信息
export const loadStoredAuth = store => {
  const token = storage.get('token'); // 修改：将 'auth_token' 改为 'token'
  const user = storage.get('user_info');
  const preferences = storage.get('user_preferences', {
    temperatureUnit: 'celsius',
    colorScheme: 'light',
    defaultView: 'grid',
    notifications: true,
  });

  if (token && user) {
    store.user = user;
    store.token = token;
    store.isAuthenticated = true;
    store.preferences = preferences;
    return true;
  }
  return false;
};
