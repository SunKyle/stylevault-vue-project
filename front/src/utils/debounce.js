/**
 * 统一防抖工具
 * 提供简化的防抖能力，支持 Promise
 */

/**
 * 创建防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} delay 延迟时间(毫秒)
 * @param {Object} options 配置选项
 * @param {boolean} options.leading 是否在延迟开始时执行
 * @param {boolean} options.trailing 是否在延迟结束时执行
 * @param {boolean} options.cancelOnError 出错时是否取消
 * @returns {Function} 防抖函数
 */
export function debounce(func, delay, options = {}) {
  const { leading = false, trailing = true, cancelOnError = false } = options;
  let timeoutId = null;
  let lastResult = null;
  let lastError = null;

  const clearTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const wrappedFunc = function (...args) {
    return new Promise((resolve, reject) => {
      // 清除之前的定时器
      clearTimeout();

      const execute = async () => {
        try {
          lastResult = await func.apply(this, args);
          lastError = null;
          resolve(lastResult);
        } catch (error) {
          lastError = error;
          if (cancelOnError) {
            clearTimeout();
            reject(error);
            return;
          }
          reject(error);
        }
      };

      if (leading && !timeoutId) {
        // 立即执行
        execute();
      }

      if (!leading || timeoutId) {
        // 延迟执行
        timeoutId = setTimeout(() => {
          if (trailing) {
            execute();
          }
          timeoutId = null;
        }, delay);
      }
    });
  };

  wrappedFunc.cancel = () => {
    clearTimeout();
    timeoutId = null;
  };

  wrappedFunc.flush = async () => {
    clearTimeout();
    if (lastError) throw lastError;
    return lastResult;
  };

  wrappedFunc.pending = () => timeoutId !== null;

  return wrappedFunc;
}

/**
 * 创建节流函数
 * @param {Function} func 要节流的函数
 * @param {number} delay 延迟时间(毫秒)
 * @param {Object} options 配置选项
 * @param {boolean} options.leading 是否在延迟开始时执行
 * @param {boolean} options.trailing 是否在延迟结束时执行
 * @returns {Function} 节流函数
 */
export function throttle(func, delay, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastExecTime = 0;
  let timeoutId = null;
  let lastResult = null;

  const shouldExecute = () => {
    const now = Date.now();
    return now - lastExecTime >= delay;
  };

  const clearTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const wrappedFunc = function (...args) {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        try {
          lastExecTime = Date.now();
          lastResult = await func.apply(this, args);
          resolve(lastResult);
        } catch (error) {
          reject(error);
        }
      };

      if (shouldExecute()) {
        clearTimeout();
        execute();
      } else if (trailing) {
        clearTimeout();
        timeoutId = setTimeout(() => {
          execute();
          timeoutId = null;
        }, delay);
      }
    });
  };

  wrappedFunc.cancel = () => {
    clearTimeout();
    lastExecTime = 0;
  };

  wrappedFunc.flush = async () => {
    clearTimeout();
    return lastResult;
  };

  wrappedFunc.pending = () => timeoutId !== null;

  return wrappedFunc;
}

/**
 * 延迟函数
 * @param {number} delay 延迟时间(毫秒)
 * @returns {Promise}
 */
export const delay = (delay = 0) => new Promise(resolve => setTimeout(resolve, delay));

export default { debounce, throttle, delay };
