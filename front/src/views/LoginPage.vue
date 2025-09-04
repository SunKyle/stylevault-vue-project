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
          <transition
            name="slide-fade"
            mode="out-in"
          >
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
        <h3 class="text-xl font-semibold text-neutral-900 mb-2">正在登录</h3>
        <p class="text-neutral-600 text-center">请稍候，我们正在验证您的信息...</p>
      </div>
    </div>
  </div>

  <!-- 登录成功提示 -->
  <div
    v-if="showSuccess"
    class="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 transition-all duration-500 transform translate-x-0"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500 text-xl" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-green-800">登录成功</h3>
        <div class="mt-1 text-sm text-green-700">正在跳转到衣橱管理页面...</div>
      </div>
    </div>
  </div>

  <!-- 登录失败提示 -->
  <div
    v-if="showError"
    class="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 transition-all duration-500 transform translate-x-0"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-500 text-xl" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">{{ showRegister ? '注册失败' : '登录失败' }}</h3>
        <div class="mt-1 text-sm text-red-700">{{ showRegister ? registerErrors.general : loginErrors.general }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth.store.js';
  import BrandSection from '@/components/login/BrandSection.vue';
  import LoginForm from '@/components/login/LoginForm.vue';
  import RegisterForm from '@/components/login/RegisterForm.vue';

  const router = useRouter();
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const showRegister = ref(false);
  const showSuccess = ref(false);
  const showError = ref(false);

  // 登录表单错误
  const loginErrors = reactive({
    email: '',
    password: '',
    general: '',
  });

  // 注册表单错误
  const registerErrors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  // 处理登录
  const handleLogin = async (formData) => {
    // 清除全局错误
    loginErrors.general = '';

    // 显示加载状态
    isLoading.value = true;

    try {
      await authStore.login({
        email: formData.email,
        password: formData.password,
      });

      // 显示成功提示
      showSuccess.value = true;

      // 2秒后跳转到衣橱页面
      setTimeout(() => {
        router.push('/wardrobe');
      }, 2000);
    } catch (error) {
      console.error('登录失败:', error);
      
      // 显示后端返回的错误信息
      loginErrors.general = error instanceof Error ? error.message : '登录失败，请检查用户名和密码';
      
      // 显示错误提示
      showError.value = true;

      // 5秒后自动隐藏错误提示
      setTimeout(() => {
        showError.value = false;
      }, 5000);
    } finally {
      isLoading.value = false;
    }
  };

  // 处理注册
  const handleRegister = async (formData) => {
    // 清除全局错误
    registerErrors.general = '';

    // 检查用户协议
    if (!formData.agreement) {
      registerErrors.general = '请阅读并同意用户协议和隐私政策';
      return;
    }

    // 显示加载状态
    isLoading.value = true;

    try {
      await authStore.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // 注册成功，显示成功提示
      showSuccess.value = true;

      // 2秒后自动跳转到登录页面
      setTimeout(() => {
        showSuccess.value = false;
        showRegister.value = false;
        
        // 清空注册表单
        resetRegisterForm();
      }, 2000);
    } catch (error) {
      console.error('注册失败:', error);
      
      // 清除之前的字段错误
      registerErrors.username = '';
      registerErrors.email = '';
      registerErrors.password = '';
      registerErrors.confirmPassword = '';
      registerErrors.general = '';

      // 检查是否有后端返回的详细错误信息
      const errorData = error.response?.data;
      if (errorData?.error?.details) {
        const details = errorData.error.details;
        
        // 处理字段级错误（数组格式）
        if (Array.isArray(details)) {
          let hasFieldErrors = false;
          
          details.forEach(detail => {
            if (detail.field && Object.prototype.hasOwnProperty.call(registerErrors, detail.field)) {
              registerErrors[detail.field] = detail.message;
              hasFieldErrors = true;
            }
          });
          
          // 如果没有字段级错误，显示通用错误
          if (!hasFieldErrors && details.length > 0) {
            registerErrors.general = details[0].message || errorData.message || '注册失败';
          }
        } else if (typeof details === 'string') {
          registerErrors.general = details;
        } else if (errorData.message) {
          registerErrors.general = errorData.message;
        } else {
          registerErrors.general = '注册失败，请重试';
        }
      } else if (errorData?.message) {
        // 显示后端返回的通用错误信息
        registerErrors.general = errorData.message;
      } else {
        registerErrors.general = error instanceof Error ? error.message : '注册失败，请重试';
      }
      
      // 重置密码字段错误（仅在非字段错误时）
      if (!registerErrors.password) {
        registerErrors.password = '';
        registerErrors.confirmPassword = '';
      }

      // 显示错误提示（仅在通用错误时）
      if (registerErrors.general) {
        showError.value = true;
        setTimeout(() => {
          showError.value = false;
        }, 5000);
      }
    } finally {
      isLoading.value = false;
    }
  };

  // 重置注册表单错误
  const resetRegisterForm = () => {
    registerErrors.username = '';
    registerErrors.email = '';
    registerErrors.password = '';
    registerErrors.confirmPassword = '';
    registerErrors.general = '';
  };
</script>

<style scoped>
  /* 全局样式 */
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

  /* 背景装饰元素 */
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
    transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
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
