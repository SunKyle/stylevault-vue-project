import { ref } from 'vue';

/**
 * 事件总线 - 用于跨组件通信
 * 提供发布/订阅模式，简化深层组件间的通信
 */

// 使用 Vue 的响应式系统实现事件总线
const eventBus = {
  // 事件监听器存储
  _listeners: new Map(),

  /**
   * 订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消订阅函数
   */
  on(eventName, callback) {
    if (!this._listeners.has(eventName)) {
      this._listeners.set(eventName, new Set());
    }
    this._listeners.get(eventName).add(callback);

    // 返回取消订阅函数
    return () => {
      this.off(eventName, callback);
    };
  },

  /**
   * 取消订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数（可选，不传则清除所有监听器）
   */
  off(eventName, callback) {
    if (!this._listeners.has(eventName)) {
      return;
    }

    if (callback) {
      this._listeners.get(eventName).delete(callback);
    } else {
      this._listeners.delete(eventName);
    }
  },

  /**
   * 发布事件
   * @param {string} eventName - 事件名称
   * @param {...any} args - 传递给回调的参数
   */
  emit(eventName, ...args) {
    if (!this._listeners.has(eventName)) {
      return;
    }

    this._listeners.get(eventName).forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`EventBus: Error in event handler for "${eventName}"`, error);
      }
    });
  },

  /**
   * 只订阅一次事件
   * @param {string} eventName - 事件名称
   * @param {Function} callback - 回调函数
   */
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    return this.on(eventName, wrapper);
  },

  /**
   * 清除所有事件监听器
   */
  clear() {
    this._listeners.clear();
  },

  /**
   * 获取事件监听器数量（用于调试）
   * @param {string} eventName - 事件名称（可选）
   * @returns {number} 监听器数量
   */
  listenerCount(eventName) {
    if (eventName) {
      return this._listeners.get(eventName)?.size || 0;
    }
    let total = 0;
    this._listeners.forEach(set => {
      total += set.size;
    });
    return total;
  },
};

// 定义常用事件名称常量
export const EVENTS = {
  // 灵感相关事件
  INSPIRATION_CATEGORY_CHANGE: 'inspiration:category-change',
  INSPIRATION_TAG_CHANGE: 'inspiration:tag-change',
  INSPIRATION_SEARCH_CHANGE: 'inspiration:search-change',
  INSPIRATION_RESET_FILTERS: 'inspiration:reset-filters',
  INSPIRATION_TOGGLE_CLOTH: 'inspiration:toggle-cloth',
  INSPIRATION_SAVE_OUTFIT: 'inspiration:save-outfit',
  INSPIRATION_LOAD_OUTFIT: 'inspiration:load-outfit',
  INSPIRATION_DELETE_OUTFIT: 'inspiration:delete-outfit',

  // 衣物相关事件
  CLOTHING_ADD: 'clothing:add',
  CLOTHING_EDIT: 'clothing:edit',
  CLOTHING_DELETE: 'clothing:delete',
  CLOTHING_TOGGLE_FAVORITE: 'clothing:toggle-favorite',

  // UI 相关事件
  UI_DRAWER_OPEN: 'ui:drawer-open',
  UI_DRAWER_CLOSE: 'ui:drawer-close',
  UI_TOAST_SHOW: 'ui:toast-show',
  UI_MODAL_CONFIRM: 'ui:modal-confirm',
};

// 便捷订阅方法 - 在 setup 脚本中使用
export function useEventBus() {
  return {
    on: eventBus.on.bind(eventBus),
    off: eventBus.off.bind(eventBus),
    emit: eventBus.emit.bind(eventBus),
    once: eventBus.once.bind(eventBus),
    clear: eventBus.clear.bind(eventBus),
    listenerCount: eventBus.listenerCount.bind(eventBus),
  };
}

export default eventBus;
