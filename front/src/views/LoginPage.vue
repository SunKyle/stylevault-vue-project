<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 md:p-8 page-load transition-all duration-500 ease-in-out"
  >
    <!-- 背景装饰元素 -->
    <div class="fixed top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full floating"></div>
    <div
      class="fixed bottom-1/3 right-1/3 w-40 h-40 bg-secondary/5 rounded-full floating floating-delay-1"
    ></div>
    <div
      class="fixed top-2/3 left-1/3 w-24 h-24 bg-primary/5 rounded-full floating floating-delay-2"
    ></div>

    <div class="w-full max-w-6xl relative z-10">
      <div class="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <!-- 左侧：品牌介绍组件 -->
        <BrandSection />

        <!-- 右侧：登录/注册表单组件 -->
        <div class="w-full relative overflow-hidden">
          <!-- 登录/注册表单 -->
          <transition name="slide-fade" mode="out-in">
            <LoginForm
              v-if="!showRegister"
              :isLoading="isLoading"
              :errors="loginErrors"
              @submit="handleLogin"
              @show-register="showRegister = true"
              key="login"
            />
            <RegisterForm
              v-else
              :isLoading="isLoading"
              :errors="registerErrors"
              @submit="handleRegister"
              @show-login="showRegister = false"
              key="register"
            />
          </transition>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="mt-12 text-center text-neutral-400 text-sm">
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#" class="hover:text-primary transition-colors">关于我们</a>
          <a href="#" class="hover:text-primary transition-colors">隐私政策</a>
          <a href="#" class="hover:text-primary transition-colors">用户协议</a>
          <a href="#" class="hover:text-primary transition-colors">帮助中心</a>
        </div>
        <p class="mt-4">© 2023 衣管家 智能衣橱管理系统 版权所有</p>
      </footer>
    </div>
  </div>

  <!-- 全屏加载遮罩 -->
  <div
    v-if="isLoading"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
  >
    <div
      class="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl transform transition-transform duration-300 scale-100"
    >
      <div class="flex flex-col items-center justify-center">
        <div
          class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
        ></div>
        <h3 class="text-xl font-semibold text-neutral-900 mb-2">
          {{ showRegister ? '正在注册' : '正在登录' }}
        </h3>
        <p class="text-neutral-600 text-center">
          {{ showRegister ? '请稍候，我们正在创建您的账号...' : '请稍候，我们正在验证您的信息...' }}
        </p>
      </div>
    </div>
  </div>

  <!-- 通用提示框 -->
  <div
    v-if="showSuccess || showError"
    :class="[
      'toast-base animate-fade-in-up',
      showSuccess ? 'toast-success' : 'toast-error',
      { 'opacity-100 scale-100': showSuccess || showError },
      { 'animate-shake': showError },
    ]"
  >
    <div class="flex items-center">
      <div
        :class="[
          'flex-shrink-0 rounded-full p-2 md:p-2.5 shadow-md',
          showSuccess ? 'bg-green-500' : 'bg-red-500',
        ]"
      >
        <font-awesome-icon
          :icon="['fas', showSuccess ? 'check-circle' : 'exclamation-circle']"
          class="text-white text-xl"
        />
      </div>
      <div class="ml-3 flex-1">
        <h3
          class="text-base font-semibold leading-6"
          :class="showSuccess ? 'text-green-800' : 'text-red-800'"
        >
          {{
            showRegister
              ? showSuccess
                ? '注册成功'
                : '注册失败'
              : showSuccess
                ? '登录成功'
                : '登录失败'
          }}
        </h3>
        <div
          class="mt-1.5 text-sm leading-5 whitespace-pre-line"
          :class="showSuccess ? 'text-green-700' : 'text-red-700'"
        >
          <template v-if="showSuccess">
            {{ showRegister ? '即将返回登录页面...' : '正在跳转到衣橱管理页面...' }}
          </template>
          <template v-else>
            {{ showRegister ? registerErrors.general : loginErrors.general }}
          </template>
        </div>
        <button
          class="mt-2 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-opacity-50"
          :class="
            showSuccess
              ? 'text-green-600 hover:text-green-800 focus:ring-green-400'
              : 'text-red-600 hover:text-red-800 focus:ring-red-400'
          "
          @click="closeToast"
        >
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/authStore.js';
  import BrandSection from '@/components/features/login/BrandSection.vue';
  import LoginForm from '@/components/features/login/LoginForm.vue';
  import RegisterForm from '@/components/features/login/RegisterForm.vue';

  // 1. 基础响应式数据
  const router = useRouter();
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const showRegister = ref(false);
  const showSuccess = ref(false);
  const showError = ref(false);

  // 2. 定时器管理（防止内存泄漏）
  const timers = [];
  const addTimer = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  };
  const clearAllTimers = () => {
    timers.forEach(timer => clearTimeout(timer));
    timers.length = 0;
  };

  // 3. 标准化错误信息管理
  const createErrorStore = fields => {
    const errors = reactive({
      general: '',
      reset() {
        this.general = '';
        fields.forEach(field => {
          this[field] = '';
        });
      },
    });
    // 动态添加字段
    fields.forEach(field => {
      errors[field] = '';
    });
    return errors;
  };

  // 初始化错误存储
  const loginErrors = createErrorStore(['email', 'password']);
  const registerErrors = createErrorStore(['username', 'email', 'password', 'confirmPassword']);

  // 4. 通用提示控制
  const showToast = (type, duration = 3000) => {
    // 先关闭现有提示
    closeToast();

    // 显示对应提示
    if (type === 'success') {
      showSuccess.value = true;
      addTimer(closeToast, duration);
    } else if (type === 'error') {
      showError.value = true;
      addTimer(closeToast, duration);
    }
  };

  const closeToast = () => {
    showSuccess.value = false;
    showError.value = false;
  };

  // 5. 通用错误解析函数（修复 hasOwnProperty 调用方式）
  const parseApiError = (error, errorStore) => {
    errorStore.reset();

    // 网络错误判断
    if (!navigator.onLine) {
      errorStore.general = '网络连接失败，请检查您的网络';
      return errorStore.general;
    }

    const errorData = error.response?.data;
    // 解析接口错误
    if (errorData?.error?.details) {
      const details = errorData.error.details;

      if (Array.isArray(details)) {
        let hasFieldErrors = false;
        details.forEach(detail => {
          // 修复：使用 Object.prototype.hasOwnProperty.call 替代直接调用
          if (detail.field && Object.prototype.hasOwnProperty.call(errorStore, detail.field)) {
            errorStore[detail.field] = detail.message;
            hasFieldErrors = true;
          }
        });

        if (!hasFieldErrors && details.length > 0) {
          errorStore.general = details[0].message || errorData.message || '操作失败';
        }
      } else if (typeof details === 'string') {
        errorStore.general = details;
      }
    } else if (errorData?.message) {
      errorStore.general = errorData.message;
    } else {
      errorStore.general = error instanceof Error ? error.message : '操作失败，请重试';
    }

    return errorStore.general;
  };

  // 6. 登录处理
  const handleLogin = async formData => {
    // 参数校验
    if (!formData?.email || !formData?.password) {
      loginErrors.general = '请输入邮箱和密码';
      showToast('error', 3000);
      return;
    }

    loginErrors.reset();
    isLoading.value = true;

    try {
      await authStore.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // 显示成功提示并延迟跳转
      showToast('success', 2000);

      // 延迟跳转，确保提示可见
      addTimer(() => {
        router.push('/wardrobe');
      }, 800);
    } catch (error) {
      console.error('登录失败:', error);
      parseApiError(error, loginErrors);
      showToast('error', 5000);
    } finally {
      isLoading.value = false;
    }
  };

  // 7. 注册处理
  const handleRegister = async formData => {
    // 参数校验
    if (!formData?.username || !formData?.email || !formData?.password) {
      registerErrors.general = '请填写完整的注册信息';
      showToast('error', 3000);
      return;
    }

    // 检查用户协议
    if (!formData.agreement) {
      registerErrors.general = '请阅读并同意用户协议和隐私政策';
      showToast('error', 3000);
      return;
    }

    registerErrors.reset();
    isLoading.value = true;

    try {
      await authStore.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // 显示成功提示
      showToast('success', 2000);

      // 延迟切换到登录表单
      addTimer(() => {
        showRegister.value = false;
        registerErrors.reset();
      }, 2000);
    } catch (error) {
      console.error('注册失败:', error);
      parseApiError(error, registerErrors);
      showToast('error', 5000);
    } finally {
      isLoading.value = false;
    }
  };

  // 8. 组件卸载清理
  onUnmounted(() => {
    clearAllTimers();
  });
</script>

<style scoped>
  /* CSS 变量统一管理 */
  :root {
    --toast-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --success-color: #22c55e;
    --error-color: #ef4444;
    --success-bg: linear-gradient(to right, #f0fdf4, #dcfce7);
    --error-bg: linear-gradient(to right, #fef2f2, #fee2e2);
    --success-border: #bbf7d0;
    --error-border: #fecaca;
  }

  /* 页面加载动画 */
  .page-load {
    animation: pageLoad 0.6s ease-out;
  }

  @keyframes pageLoad {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 通用提示框样式（复用） */
  .toast-base {
    position: fixed;
    top: 4px;
    right: 4px;
    border-radius: 0.75rem;
    padding: 1rem;
    @apply md:top-6 md:right-6 md:p-5 shadow-lg z-50 max-w-xs w-[90%] sm:w-auto;
    transition: all 0.6s ease-out;
    opacity: 0;
    transform: scale(0.95);
  }

  /* 成功提示 */
  .toast-success {
    background: var(--success-bg);
    border: 2px solid var(--success-border);
  }

  .toast-success::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent);
    animation: pulseSuccess 2s ease-in-out infinite;
    pointer-events: none;
  }

  /* 错误提示 */
  .toast-error {
    background: var(--error-bg);
    border: 2px solid var(--error-border);
  }

  .toast-error::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
    animation: pulseError 2s ease-in-out infinite;
    pointer-events: none;
  }

  /* 提示框动画 */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* 错误提示震动 */
  .animate-shake {
    animation: shake 0.5s ease-in-out 0.2s;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-2px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(2px);
    }
  }

  /* 提示框交互效果 */
  .toast-base:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--toast-shadow);
    transition: all 0.3s ease;
  }

  /* 关闭按钮样式 */
  .toast-base button:hover {
    text-decoration: underline;
    transform: translateX(1px);
    transition: all 0.2s ease;
  }

  /* 脉动动画 */
  @keyframes pulseSuccess {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes pulseError {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  /* 背景装饰元素动画 */
  .floating {
    animation: floating 6s ease-in-out infinite;
  }

  @keyframes floating {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(5deg);
    }
    100% {
      transform: translateY(0px) rotate(0deg);
    }
  }

  .floating-delay-1 {
    animation-delay: 1s;
  }

  .floating-delay-2 {
    animation-delay: 2s;
  }

  /* 登录/注册表单切换动画 */
  .slide-fade-enter-active {
    transition: all 0.4s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }
</style>
