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

      <!-- 登录标题 -->
      <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">欢迎回来</h2>
      <p class="text-neutral-600 mb-8">请输入您的账号信息登录系统</p>

      <!-- 全局错误提示 -->
      <div
        v-if="errors.general"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
      >
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-500 mr-2" />
        <span class="text-red-700">{{ errors.general }}</span>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="space-y-6">
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
          </div>

          <p v-if="errors.password" class="text-red-500 text-sm mt-1 flex items-center">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-1" />
            {{ errors.password }}
          </p>
        </div>

        <!-- 记住我和登录按钮 -->
        <div class="space-y-6 pt-4">
          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between">
            <!-- 记住我开关 -->
            <label for="remember" class="relative inline-flex items-center cursor-pointer">
              <input id="remember" type="checkbox" v-model="form.remember" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary flex-shrink-0"
              ></div>
              <span class="ml-3 text-sm font-medium text-neutral-700 self-center">记住我</span>
            </label>

            <!-- 忘记密码链接 -->
            <a
              href="#"
              class="text-sm text-primary hover:text-primary/80 transition-colors self-center"
            >
              忘记密码?
            </a>
          </div>

          <!-- 登录按钮 -->
          <div class="pt-2">
            <BaseButton
              type="submit"
              variant="primary"
              size="md"
              :loading="isLoading"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center"
            >
              <span class="text-lg font-medium">登录</span>
              <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-2" />
            </BaseButton>
          </div>
        </div>
      </form>

      <!-- 分隔线 -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-3 bg-white text-neutral-600">或使用以下方式快速登录</span>
        </div>
      </div>

      <!-- 社交登录 -->
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
              微信登录
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
              QQ登录
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
              Apple登录
            </span>
          </button>
        </div>
      </div>

      <!-- 注册链接 -->
      <p class="text-center text-neutral-600 mt-8">
        还没有账号?
        <a
          href="#"
          @click.prevent="$emit('show-register')"
          class="font-medium text-primary hover:text-primary/80 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
        >
          立即注册
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
  import { ref } from 'vue';
  import BaseButton from '../ui/atoms/BaseButton.vue';

  // 定义props，以便父组件传递数据和方法
  defineProps({
    isLoading: {
      type: Boolean,
      default: false,
    },
  });

  // 定义事件
  const emit = defineEmits([
    'toggle-password',
    'validate-email',
    'validate-password',
    'submit',
    'show-register',
  ]);

  // 切换密码可见性
  const showPassword = ref(false);

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
    emit('toggle-password');
  };

  // 表单数据
  const form = ref({
    email: '',
    password: '',
    remember: false,
  });

  // 表单错误
  const errors = ref({
    email: '',
    password: '',
    general: '',
  });

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
      return true;
    }
  };

  // 处理登录
  const handleLogin = () => {
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
