<template>
  <div class="w-full">
    <div
      class="bg-white rounded-2xl p-8 md:p-10 shadow-soft hover:shadow-medium transition-all duration-500 overflow-hidden"
    >
      <!-- 移动端品牌展示 -->
      <div class="md:hidden text-center mb-8">
        <div class="inline-block bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-2xl">
          <font-awesome-icon :icon="['fas', 'tshirt']" class="text-4xl text-gradient" />
        </div>
        <h2 class="text-2xl font-bold text-neutral-900 mt-4">智能衣橱管理</h2>
        <p class="text-neutral-600 mt-2">让穿搭变得更简单</p>
      </div>

      <!-- 注册标题 -->
      <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">创建新账号</h2>
      <p class="text-neutral-600 mb-8">请填写以下信息完成注册</p>

      <!-- 全局错误提示 -->
      <div
        v-if="errors.general"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
      >
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-500 mr-2" />
        <span class="text-red-700">{{ errors.general }}</span>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- 用户名 -->
        <div class="form-group relative mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <font-awesome-icon :icon="['fas', 'user']" class="text-neutral-400" />
            </div>
            <input
              type="text"
              id="username"
              v-model="form.username"
              @blur="validateUsername"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all peer"
              :class="{
                'border-red-500': errors.username,
                'border-green-500': form.username && !errors.username,
              }"
              placeholder=" "
              required
            />
            <label
              for="username"
              class="form-float-label absolute left-10 top-3 text-gray-500 transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary peer-valid:text-green-600 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 bg-white px-1"
            >
              用户名
            </label>
            <div
              v-if="form.username && !errors.username"
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500" />
            </div>
          </div>
          <p v-if="errors.username" class="text-red-500 text-sm mt-1 flex items-center">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-1" />
            {{ errors.username }}
          </p>
        </div>

        <!-- 电子邮件 -->
        <div class="form-group relative mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <font-awesome-icon :icon="['fas', 'envelope']" class="text-neutral-400" />
            </div>
            <input
              type="email"
              id="email"
              v-model="form.email"
              @blur="validateEmail"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all peer"
              :class="{
                'border-red-500': errors.email,
                'border-green-500': form.email && !errors.email,
              }"
              placeholder=" "
              required
            />
            <label
              for="email"
              class="form-float-label absolute left-10 top-3 text-gray-500 transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary peer-valid:text-green-600 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 bg-white px-1"
            >
              电子邮件
            </label>
            <div
              v-if="form.email && !errors.email"
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500" />
            </div>
          </div>
          <p v-if="errors.email" class="text-red-500 text-sm mt-1 flex items-center">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-1" />
            {{ errors.email }}
          </p>
        </div>

        <!-- 密码 -->
        <div class="form-group relative mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <font-awesome-icon :icon="['fas', 'lock']" class="text-neutral-400" />
            </div>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              @blur="validatePassword"
              @input="updatePasswordStrength"
              class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all peer"
              :class="{
                'border-red-500': errors.password,
                'border-green-500': form.password && !errors.password,
              }"
              placeholder=" "
              required
            />
            <label
              for="password"
              class="form-float-label absolute left-10 top-3 text-gray-500 transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary peer-valid:text-green-600 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 bg-white px-1"
            >
              密码
            </label>
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-primary transition-colors z-10"
            >
              <font-awesome-icon :icon="showPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']" />
            </button>
            <div
              v-if="form.password && !errors.password"
              class="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none"
            >
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500" />
            </div>
          </div>

          <!-- 密码强度指示器 -->
          <div v-if="form.password" class="mt-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500">密码强度</span>
              <span class="text-xs" :class="passwordStrengthClass">
                {{ passwordStrengthText }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div
                class="h-1.5 rounded-full transition-all duration-300"
                :class="passwordStrengthBarClass"
                :style="{ width: passwordStrengthPercentage + '%' }"
              ></div>
            </div>
          </div>

          <p v-if="errors.password" class="text-red-500 text-sm mt-1 flex items-center">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-1" />
            {{ errors.password }}
          </p>
        </div>

        <!-- 确认密码 -->
        <div class="form-group relative mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <font-awesome-icon :icon="['fas', 'lock']" class="text-neutral-400" />
            </div>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="form.confirmPassword"
              @blur="validateConfirmPassword"
              class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all peer"
              :class="{
                'border-red-500': errors.confirmPassword,
                'border-green-500': form.confirmPassword && !errors.confirmPassword,
              }"
              placeholder=" "
              required
            />
            <label
              for="confirmPassword"
              class="form-float-label absolute left-10 top-3 text-gray-500 transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary peer-valid:text-green-600 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75 bg-white px-1"
            >
              确认密码
            </label>
            <button
              type="button"
              @click="toggleConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-primary transition-colors z-10"
            >
              <font-awesome-icon
                :icon="showConfirmPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']"
              />
            </button>
            <div
              v-if="form.confirmPassword && !errors.confirmPassword"
              class="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none"
            >
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-500" />
            </div>
          </div>

          <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1 flex items-center">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-1" />
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- 用户协议 -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="agreement"
              type="checkbox"
              v-model="form.agreement"
              class="w-4 h-4 border-gray-300 rounded focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="agreement" class="font-medium text-neutral-700">
              我已阅读并同意
              <a href="#" class="text-primary hover:text-primary/80 transition-colors">用户协议</a>
              和
              <a href="#" class="text-primary hover:text-primary/80 transition-colors">隐私政策</a>
            </label>
          </div>
        </div>

        <!-- 注册按钮 -->
        <div class="pt-4">
          <BaseButton
            type="submit"
            variant="primary"
            size="md"
            :loading="isLoading"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center"
          >
            <span class="text-lg font-medium">创建账号</span>
            <font-awesome-icon :icon="['fas', 'user-plus']" class="ml-2" />
          </BaseButton>
        </div>
      </form>

      <!-- 分隔线 -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-3 bg-white text-neutral-600">或使用以下方式快速注册</span>
        </div>
      </div>

      <!-- 社交注册 -->
      <div class="mb-6">
        <div class="grid grid-cols-3 gap-4">
          <button
            class="flex flex-col items-center justify-center py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-5 transition-opacity"
            ></div>
            <font-awesome-icon
              :icon="['fab', 'weixin']"
              class="text-green-500 text-xl group-hover:scale-110 transition-transform mb-1"
            />
            <span class="text-xs text-gray-600 mt-1 group-hover:text-green-600 transition-colors">
              微信注册
            </span>
          </button>
          <button
            class="flex flex-col items-center justify-center py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity"
            ></div>
            <font-awesome-icon
              :icon="['fab', 'qq']"
              class="text-blue-500 text-xl group-hover:scale-110 transition-transform mb-1"
            />
            <span class="text-xs text-gray-600 mt-1 group-hover:text-blue-600 transition-colors">
              QQ注册
            </span>
          </button>
          <button
            class="flex flex-col items-center justify-center py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-5 transition-opacity"
            ></div>
            <font-awesome-icon
              :icon="['fab', 'apple']"
              class="text-gray-800 text-xl group-hover:scale-110 transition-transform mb-1"
            />
            <span class="text-xs text-gray-600 mt-1 group-hover:text-gray-800 transition-colors">
              Apple注册
            </span>
          </button>
        </div>
      </div>

      <!-- 登录链接 -->
      <p class="text-center text-neutral-600 mt-8">
        已有账号?
        <a
          href="#"
          @click.prevent="$emit('show-login')"
          class="font-medium text-primary hover:text-primary/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
        >
          立即登录
        </a>
      </p>

      <!-- 安全提示 -->
      <p class="text-center text-neutral-400 text-xs mt-6">
        <font-awesome-icon :icon="['fas', 'shield-alt']" class="mr-1" />
        我们采用银行级加密保护您的信息安全
      </p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import BaseButton from '@/components/ui/BaseButton.vue';

  // 定义props，以便父组件传递数据和方法
  defineProps({
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  // 定义事件
  const emit = defineEmits([
    'validate-username',
    'validate-email',
    'validate-password',
    'validate-confirm-password',
    'submit',
    'show-login',
  ]);

  // 密码强度相关
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const passwordStrength = ref(0);
  const passwordStrengthText = computed(() => {
    if (passwordStrength.value === 0) return '弱';
    if (passwordStrength.value === 1) return '中等';
    return '强';
  });

  const passwordStrengthClass = computed(() => {
    if (passwordStrength.value === 0) return 'text-red-500';
    if (passwordStrength.value === 1) return 'text-yellow-500';
    return 'text-green-500';
  });

  const passwordStrengthBarClass = computed(() => {
    if (passwordStrength.value === 0) return 'bg-red-500';
    if (passwordStrength.value === 1) return 'bg-yellow-500';
    return 'bg-green-500';
  });

  const passwordStrengthPercentage = computed(() => {
    if (passwordStrength.value === 0) return 33;
    if (passwordStrength.value === 1) return 66;
    return 100;
  });

  // 表单数据
  const form = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false,
  });

  // 表单错误
  const errors = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  // 验证用户名
  const validateUsername = () => {
    const username = form.value.username.trim();

    if (username.length < 2) {
      errors.value.username = '用户名长度至少为2位';
      return false;
    } else if (username.length > 20) {
      errors.value.username = '用户名长度不能超过20位';
      return false;
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      errors.value.username = '用户名只能包含中文、英文、数字和下划线';
      return false;
    } else {
      errors.value.username = '';
      return true;
    }
  };

  // 验证电子邮件
  const validateEmail = () => {
    const email = form.value.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errors.value.email = '请输入有效的电子邮件地址';
      return false;
    } else {
      errors.value.email = '';
      return true;
    }
  };

  // 计算密码强度
  const calculatePasswordStrength = password => {
    if (!password) return 0;

    let strength = 0;

    // 长度检查
    if (password.length >= 12) {
      strength += 2; // 长密码加分
    } else if (password.length >= 8) {
      strength += 1;
    }

    // 复杂性检查
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar].filter(
      Boolean
    ).length;

    // 根据字符种类增加强度
    strength += Math.min(varietyCount - 1, 2);

    // 确保强度值在0-2范围内
    return Math.min(Math.max(strength, 0), 2);
  };

  // 验证密码
  const validatePassword = () => {
    const password = form.value.password;

    if (password.length < 6) {
      errors.value.password = '密码长度至少为6位';
      return false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.value.password = '密码必须包含大小写字母和数字';
      return false;
    } else {
      errors.value.password = '';
      // 计算密码强度
      passwordStrength.value = calculatePasswordStrength(password);
      return true;
    }
  };

  // 实时更新密码强度
  const updatePasswordStrength = () => {
    const password = form.value.password;
    if (password) {
      passwordStrength.value = calculatePasswordStrength(password);
    } else {
      passwordStrength.value = 0;
    }
  };

  // 验证确认密码
  const validateConfirmPassword = () => {
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;

    if (password !== confirmPassword) {
      errors.value.confirmPassword = '两次输入的密码不一致';
      return false;
    } else {
      errors.value.confirmPassword = '';
      return true;
    }
  };

  // 处理注册
  const handleRegister = () => {
    // 验证所有字段
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    // 在提交时，将表单数据传递给父组件
    emit('submit', form.value);
  };
</script>

<style scoped>
  /* 输入框动画 */
  .form-group:focus-within label {
    color: #7c3aed;
    transform: translateY(-1.5rem) scale(0.85);
  }
  .form-float-label {
    transition: all 0.2s ease;
    pointer-events: none;
  }
</style>
