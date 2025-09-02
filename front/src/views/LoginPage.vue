<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="brand-logo">
            <font-awesome-icon icon="tshirt" class="logo-icon" />
          </div>
          <h1 class="brand-title">StyleVault</h1>
          <p class="brand-subtitle">智能衣橱管理系统</p>
        </div>
      </div>

      <!-- 表单区域 -->
      <div class="form-section">
        <div class="form-card">
          <div class="form-header">
            <h2>欢迎回来</h2>
            <p>登录您的账户继续管理您的衣橱</p>
          </div>

          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- 用户名输入 -->
            <div class="form-group">
              <label for="username" class="form-label">用户名或邮箱</label>
              <BaseInput
                id="username"
                v-model="form.username"
                type="text"
                placeholder="请输入用户名或邮箱"
                :error="errors.username"
                :disabled="isLoading"
                required
              />
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <BaseInput
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :error="errors.password"
                :disabled="isLoading"
                required
              >
                <template #suffix>
                  <button
                    type="button"
                    class="password-toggle"
                    @click="togglePassword"
                    :disabled="isLoading"
                  >
                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                  </button>
                </template>
              </BaseInput>
            </div>

            <!-- 记住我和忘记密码 -->
            <div class="form-options">
              <label class="checkbox-label">
                <input
                  v-model="form.rememberMe"
                  type="checkbox"
                  class="checkbox-input"
                  :disabled="isLoading"
                />
                <span class="checkbox-text">记住我</span>
              </label>
              <router-link to="/forgot-password" class="forgot-link">忘记密码？</router-link>
            </div>

            <!-- 提交按钮 -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="isLoading"
              :disabled="isLoading || !isFormValid"
              full-width
            >
              {{ isLoading ? '登录中...' : '登录' }}
            </BaseButton>

            <!-- 注册链接 -->
            <div class="register-link">
              <span>还没有账户？</span>
              <router-link to="/register" class="register-text">立即注册</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import BaseInput from '@/components/ui/BaseInput.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';

  const router = useRouter();

  // 表单状态
  const form = reactive({
    username: '',
    password: '',
    rememberMe: false,
  });

  // 错误状态
  const errors = reactive({
    username: '',
    password: '',
  });

  // UI状态
  const isLoading = ref(false);
  const showPassword = ref(false);

  // 计算属性
  const isFormValid = computed(() => {
    return form.username.trim() && form.password.trim() && !errors.username && !errors.password;
  });

  // 验证函数
  const validateUsername = () => {
    if (!form.username.trim()) {
      errors.username = '请输入用户名或邮箱';
      return false;
    }
    if (form.username.length < 3) {
      errors.username = '用户名至少需要3个字符';
      return false;
    }
    errors.username = '';
    return true;
  };

  const validatePassword = () => {
    if (!form.password.trim()) {
      errors.password = '请输入密码';
      return false;
    }
    if (form.password.length < 6) {
      errors.password = '密码至少需要6个字符';
      return false;
    }
    errors.password = '';
    return true;
  };

  // 事件处理
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const handleSubmit = async () => {
    // 验证表单
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();

    if (!isUsernameValid || !isPasswordValid) {
      return;
    }

    // 模拟登录过程
    isLoading.value = true;

    try {
      // 这里应该是实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟成功登录
      console.log('登录成功:', form);
      router.push('/');
    } catch (error) {
      console.error('登录失败:', error);
      // 这里应该显示错误提示
    } finally {
      isLoading.value = false;
    }
  };

  // 实时验证
  const validateField = field => {
    switch (field) {
      case 'username':
        validateUsername();
        break;
      case 'password':
        validatePassword();
        break;
    }
  };
</script>

<style scoped>
  .login-page {
    @apply min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50;
    @apply flex items-center justify-center p-4;
  }

  .login-container {
    @apply w-full max-w-6xl;
    @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
    @apply items-center min-h-screen;
  }

  /* 品牌区域 */
  .brand-section {
    @apply hidden lg:flex lg:flex-col lg:items-center lg:justify-center;
    @apply text-center;
  }

  .brand-content {
    @apply space-y-6;
  }

  .brand-logo {
    @apply w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center;
  }

  .logo-icon {
    @apply text-white text-5xl;
  }

  .brand-title {
    @apply text-4xl font-bold text-gray-900;
  }

  .brand-subtitle {
    @apply text-lg text-gray-600;
  }

  /* 表单区域 */
  .form-section {
    @apply flex items-center justify-center;
  }

  .form-card {
    @apply w-full max-w-md bg-white rounded-2xl shadow-xl;
    @apply p-8 space-y-6;
  }

  .form-header {
    @apply text-center space-y-2;
  }

  .form-header h2 {
    @apply text-2xl font-bold text-gray-900;
  }

  .form-header p {
    @apply text-gray-600;
  }

  .login-form {
    @apply space-y-6;
  }

  .form-group {
    @apply space-y-2;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }

  .form-options {
    @apply flex items-center justify-between;
  }

  .checkbox-label {
    @apply flex items-center space-x-2 cursor-pointer;
  }

  .checkbox-input {
    @apply w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500;
  }

  .checkbox-text {
    @apply text-sm text-gray-700;
  }

  .forgot-link {
    @apply text-sm text-blue-600 hover:text-blue-800 transition-colors;
  }

  .password-toggle {
    @apply text-gray-400 hover:text-gray-600 transition-colors text-sm;
  }

  .register-link {
    @apply text-center text-sm text-gray-600;
  }

  .register-text {
    @apply text-blue-600 hover:text-blue-800 font-medium transition-colors;
  }

  /* 移动端适配 */
  @media (max-width: 1024px) {
    .login-container {
      @apply grid-cols-1;
    }

    .form-card {
      @apply max-w-md mx-auto;
    }
  }

  @media (max-width: 640px) {
    .login-page {
      @apply p-0;
    }

    .form-card {
      @apply rounded-none min-h-screen flex flex-col justify-center;
      @apply max-w-full;
    }
  }

  /* 暗色模式支持 */
  @media (prefers-color-scheme: dark) {
    .login-page {
      @apply bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900;
    }

    .form-card {
      @apply bg-neutral-800 border border-neutral-700;
    }

    .brand-title {
      @apply text-neutral-100;
    }

    .brand-subtitle {
      @apply text-neutral-400;
    }
  }

  /* 动画效果 */
  .form-card {
    @apply transition-all duration-300 ease-in-out;
  }

  .form-card:hover {
    @apply shadow-2xl;
  }

  @media (prefers-reduced-motion: reduce) {
    .form-card {
      @apply transition-none;
    }
  }
</style>
