// 性能监控和优化工具

// 性能监控器
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = {
      api: 1000, // API调用阈值 1秒
      render: 16, // 渲染阈值 16ms (60fps)
      store: 500, // 状态更新阈值 500ms
    };
  }

  // 开始计时
  startTimer(name) {
    this.metrics.set(name, {
      start: performance.now(),
      end: null,
      duration: null,
    });
  }

  // 结束计时
  endTimer(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.end = performance.now();
      metric.duration = metric.end - metric.start;

      // 检查是否超过阈值
      if (metric.duration > (this.thresholds[name] || 1000)) {
        console.warn(`⚠️ ${name} 耗时过长: ${metric.duration.toFixed(2)}ms`);
      }

      return metric.duration;
    }
    return null;
  }

  // 获取性能数据
  getMetrics() {
    const result = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // 清理旧数据
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.metrics.entries()) {
      if (value.end && now - value.end > 300000) {
        // 5分钟前的数据
        this.metrics.delete(key);
      }
    }
  }
}

// 创建全局实例
export const performanceMonitor = new PerformanceMonitor();

// 防抖函数
export const debounce = (func, delay, immediate = false) => {
  let timeoutId;
  return function (...args) {
    const context = this;
    const later = () => {
      timeoutId = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeoutId;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, delay);
    if (callNow) func.apply(context, args);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 内存使用监控
export const memoryMonitor = {
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        usagePercent:
          (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  },

  checkMemoryLeak() {
    const usage = this.getMemoryUsage();
    if (usage && usage.usagePercent > 80) {
      console.warn('⚠️ 内存使用率过高:', usage.usagePercent.toFixed(2) + '%');
      return true;
    }
    return false;
  },
};

// 缓存管理器
export class CacheManager {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.accessOrder = [];
  }

  set(key, value) {
    // 清理过期数据
    this.cleanup();

    // 如果已存在，更新访问顺序
    if (this.cache.has(key)) {
      this.accessOrder = this.accessOrder.filter(k => k !== key);
    }

    // 如果超过最大容量，移除最久未使用的
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
    this.accessOrder.push(key);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      return null;
    }

    // 更新访问顺序
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
        this.accessOrder = this.accessOrder.filter(k => k !== key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usagePercent: (this.cache.size / this.maxSize) * 100,
    };
  }
}

// 虚拟滚动优化
export const virtualScroll = {
  calculateVisibleRange(totalItems, itemHeight, containerHeight, scrollTop) {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // 多渲染2个作为缓冲
    const endIndex = Math.min(startIndex + visibleCount, totalItems);

    return {
      startIndex: Math.max(0, startIndex - 1), // 多渲染1个作为缓冲
      endIndex,
      offsetY: startIndex * itemHeight,
    };
  },

  createBuffer(items, startIndex, endIndex) {
    return items.slice(startIndex, endIndex);
  },
};

// 图片懒加载
export const lazyLoad = {
  observer: null,

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.add('loaded');
              this.observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
        }
      );
    }
  },

  observe(element) {
    if (this.observer) {
      this.observer.observe(element);
    }
  },

  unobserve(element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  },
};

// 错误边界处理
export const errorBoundary = {
  handlers: new Set(),

  register(handler) {
    this.handlers.add(handler);
  },

  unregister(handler) {
    this.handlers.delete(handler);
  },

  handle(error, context = {}) {
    console.error('应用错误:', error, context);

    this.handlers.forEach(handler => {
      try {
        handler(error, context);
      } catch (handlerError) {
        console.error('错误处理程序失败:', handlerError);
      }
    });
  },
};

// 网络状态监控
export const networkMonitor = {
  isOnline: navigator.onLine,
  handlers: new Set(),

  init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handlers.forEach(handler => handler(true));
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handlers.forEach(handler => handler(false));
    });
  },

  addHandler(handler) {
    this.handlers.add(handler);
  },

  removeHandler(handler) {
    this.handlers.delete(handler);
  },
};

// 使用示例：
/*
// 性能监控
performanceMonitor.startTimer('apiCall');
await fetchData();
const duration = performanceMonitor.endTimer('apiCall');

// 缓存管理
const cache = new CacheManager(100, 300000); // 100项，5分钟TTL
cache.set('userData', data);
const cachedData = cache.get('userData');

// 防抖搜索
const debouncedSearch = debounce(async (query) => {
  return await searchAPI(query);
}, 300);
*/
