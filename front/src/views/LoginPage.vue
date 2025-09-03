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
              :form="loginForm"
              :errors="loginErrors"
              @toggle-password="togglePassword"
              @validate-email="validateEmail"
              @validate-password="validatePassword"
              @update:form="loginForm = $event"
              @submit="handleLogin"
              @show-register="showRegister = true"
              key="login"
            />
            <RegisterForm
              v-else
              :isLoading="isLoading"
              :form="registerForm"
              :errors="registerErrors"
              @toggle-password="togglePassword"
              @toggle-confirm-password="toggleConfirmPassword"
              @validate-username="validateUsername"
              @validate-email="validateEmail"
              @validate-password="validatePassword"
              @validate-confirm-password="validateConfirmPassword"
              @update:form="registerForm = $event"
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
        <h3 class="text-sm font-medium text-red-800">登录失败</h3>
        <div class="mt-1 text-sm text-red-700">{{ errors.general }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import BrandSection from '@/components/login/BrandSection.vue';
  import LoginForm from '@/components/login/LoginForm.vue';
  import RegisterForm from '@/components/login/RegisterForm.vue';

  const router = useRouter();
  const isLoading = ref(false);
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const showRegister = ref(false);
  const showSuccess = ref(false);
  const showError = ref(false);

  // 登录表单数据
  const loginForm = reactive({
    email: '',
    password: '',
    remember: false,
  });

  // 登录表单错误
  const loginErrors = reactive({
    email: '',
    password: '',
    general: '',
  });

  // 注册表单数据
  const registerForm = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  });

  // 注册表单错误
  const registerErrors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  // 切换密码可见性
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  // 切换确认密码可见性
  const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  // 验证用户名
  const validateUsername = (errorMessage = '') => {
    if (errorMessage) {
      registerErrors.username = errorMessage;
      return false;
    } else {
      registerErrors.username = '';
      return true;
    }
  };

  // 验证电子邮件
  const validateEmail = (errorMessage = '') => {
    if (errorMessage) {
      if (showRegister.value) {
        registerErrors.email = errorMessage;
      } else {
        loginErrors.email = errorMessage;
      }
      return false;
    } else {
      if (showRegister.value) {
        registerErrors.email = '';
      } else {
        loginErrors.email = '';
      }
      return true;
    }
  };

  // 验证密码
  const validatePassword = (errorMessage = '') => {
    if (errorMessage) {
      if (showRegister.value) {
        registerErrors.password = errorMessage;
      } else {
        loginErrors.password = errorMessage;
      }
      return false;
    } else {
      if (showRegister.value) {
        registerErrors.password = '';
      } else {
        loginErrors.password = '';
      }
      return true;
    }
  };

  // 验证确认密码
  const validateConfirmPassword = (errorMessage = '') => {
    if (errorMessage) {
      registerErrors.confirmPassword = errorMessage;
      return false;
    } else {
      registerErrors.confirmPassword = '';
      return true;
    }
  };

  // 处理登录
  const handleLogin = async () => {
    // 清除全局错误
    loginErrors.general = '';

    // 验证表单
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // 显示加载状态
    isLoading.value = true;

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟登录失败的情况（50%概率）
      const isSuccess = Math.random() > 0.5;

      if (isSuccess) {
        // 显示成功提示
        showSuccess.value = true;

        // 3秒后跳转到衣橱页面
        setTimeout(() => {
          router.push('/wardrobe');
        }, 2000);
      } else {
        // 登录失败，显示错误信息
        loginErrors.general = '用户名或密码错误，请重试';
        // 重置密码字段
        loginForm.password = '';

        // 显示错误提示
        showError.value = true;

        // 5秒后自动隐藏错误提示
        setTimeout(() => {
          showError.value = false;
        }, 5000);
      }
    } catch (error) {
      console.error('登录失败:', error);
      // 显示网络错误或其他错误
      loginErrors.general = '登录失败，请检查网络连接后重试';
      // 重置密码字段
      loginForm.password = '';

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
  const handleRegister = async () => {
    // 清除全局错误
    registerErrors.general = '';

    // 验证表单
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    // 显示加载状态
    isLoading.value = true;

    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟注册失败的情况（30%概率）
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        // 注册成功，显示成功提示
        showSuccess.value = true;

        // 3秒后自动跳转到登录页面
        setTimeout(() => {
          showSuccess.value = false;
          showRegister.value = false;
          
          // 清空登录表单并设置邮箱
          resetLoginForm();
          loginForm.email = registerForm.email;
          
          // 清空注册表单
          resetRegisterForm();
        }, 2000);
      } else {
        // 注册失败，显示错误信息
        registerErrors.general = '注册失败，该邮箱可能已被注册，请使用其他邮箱';
        // 重置密码字段
        registerForm.password = '';
        registerForm.confirmPassword = '';

        // 显示错误提示
        showError.value = true;

        // 5秒后自动隐藏错误提示
        setTimeout(() => {
          showError.value = false;
        }, 5000);
      }
    } catch (error) {
      console.error('注册失败:', error);
      // 显示网络错误或其他错误
      registerErrors.general = '注册失败，请检查网络连接后重试';
      // 重置密码字段
      registerForm.password = '';
      registerForm.confirmPassword = '';

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

  // 重置登录表单
  const resetLoginForm = () => {
    loginForm.email = '';
    loginForm.password = '';
    loginForm.remember = false;
    loginErrors.email = '';
    loginErrors.password = '';
    loginErrors.general = '';
  };

  // 重置注册表单
  const resetRegisterForm = () => {
    registerForm.username = '';
    registerForm.email = '';
    registerForm.password = '';
    registerForm.confirmPassword = '';
    registerForm.agreement = false;
    registerErrors.username = '';
    registerErrors.email = '';
    registerErrors.password = '';
    registerErrors.confirmPassword = '';
    registerErrors.general = '';
  };

  // 初始化浮动标签位置
  const initFloatLabels = () => {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
      const input = group.querySelector('input');
      const label = group.querySelector('.form-float-label');

      if (input && label) {
        if (input.value) {
          label.style.transform = 'translateY(-1.5rem) scale(0.85)';
          label.style.color = '#7C3AED';
        }

        input.addEventListener('input', function () {
          if (this.value) {
            label.style.transform = 'translateY(-1.5rem) scale(0.85)';
            label.style.color = '#7C3AED';
          } else {
            label.style.transform = 'translateY(0) scale(1)';
            label.style.color = '';
          }
        });
      }
    });
  };

  onMounted(() => {
    initFloatLabels();
  });
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
