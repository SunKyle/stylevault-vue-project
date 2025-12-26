/**
 * 统一缓存管理工具
 * 提供跨 Store 的缓存能力，简化各模块的缓存逻辑
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.namespace = 'app';
    this.defaultDuration = 5 * 60 * 1000; // 默认5分钟
    this.cleanupTimer = null;
  }

  /**
   * 初始化缓存管理器
   * @param {Object} options 配置选项
   * @param {string} options.namespace 命名空间
   * @param {number} options.defaultDuration 默认缓存时长(毫秒)
   * @param {number} options.cleanupInterval 清理过期缓存的间隔(毫秒)
   */
  init({ namespace = 'app', defaultDuration = 5 * 60 * 1000, cleanupInterval = 30 * 60 * 1000 } = {}) {
    this.namespace = namespace;
    this.defaultDuration = defaultDuration;
    this.startCleanupTimer(cleanupInterval);
  }

  /**
   * 启动定时清理任务
   */
  startCleanupTimer(interval) {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cleanupTimer = setInterval(() => this.cleanupExpired(), interval);
  }

  /**
   * 停止清理任务
   */
  stopCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * 获取带命名空间的关键字
   */
  getNamespacedKey(key) {
    return `${this.namespace}:${key}`;
  }

  /**
   * 检查缓存是否有效
   */
  isCacheValid(key) {
    const nsKey = this.getNamespacedKey(key);
    const cached = this.cache.get(nsKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.duration;
  }

  /**
   * 获取缓存时长
   */
  get duration() {
    return this._duration || this.defaultDuration;
  }

  /**
   * 设置缓存时长
   */
  set duration(value) {
    this._duration = value;
  }

  /**
   * 获取缓存数据
   */
  get(key) {
    const nsKey = this.getNamespacedKey(key);
    const cached = this.cache.get(nsKey);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp >= this.duration) {
      this.cache.delete(nsKey);
      return null;
    }
    
    return cached.data;
  }

  /**
   * 设置缓存数据
   * @param {string} key 缓存键
   * @param {any} data 缓存数据
   * @param {number} [duration] 缓存时长(可选)
   */
  set(key, data, duration) {
    const nsKey = this.getNamespacedKey(key);
    const cacheDuration = duration || this.duration;
    this.cache.set(nsKey, { data, timestamp: Date.now(), duration: cacheDuration });
    return data;
  }

  /**
   * 删除缓存
   */
  delete(key) {
    const nsKey = this.getNamespacedKey(key);
    return this.cache.delete(nsKey);
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 清理过期缓存
   */
  cleanupExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp >= (cached.duration || this.defaultDuration)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 销毁缓存管理器
   */
  destroy() {
    this.stopCleanupTimer();
    this.clear();
  }

  /**
   * 获取缓存信息
   */
  getInfo() {
    const info = {};
    for (const [key, cached] of this.cache.entries()) {
      const nsKey = this.getNamespacedKey(key);
      info[nsKey] = {
        timestamp: cached.timestamp,
        remaining: Math.max(0, (cached.timestamp + (cached.duration || this.defaultDuration)) - Date.now()),
        size: JSON.stringify(cached.data).length
      };
    }
    return info;
  }
}

// 单例实例
export const cacheManager = new CacheManager();

// 便捷方法
export const createCache = (options) => {
  const cache = new CacheManager();
  cache.init(options);
  return cache;
};

// 默认初始化
cacheManager.init();

export default cacheManager;
