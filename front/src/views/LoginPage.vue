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
        <!-- 左侧：品牌介绍 -->
        <div class="hidden md:flex flex-col space-y-8 text-center md:text-left">
          <!-- 品牌标志 -->
          <div
            class="inline-block self-center md:self-start bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-2xl"
          >
            <font-awesome-icon :icon="['fas', 'tshirt']" class="text-5xl text-gradient" />
          </div>

          <!-- 品牌名称和标语 -->
          <div class="space-y-4">
            <h1 class="text-[clamp(2.2rem,5vw,3.8rem)] font-bold text-neutral-900 leading-tight">
              智能衣橱
              <br />
              <span class="text-gradient">轻松管理</span>
            </h1>
            <p class="text-neutral-600 text-lg max-w-md mx-auto md:mx-0">
              记录每一件衣物，智能搭配推荐，合理规划衣橱空间，让每日穿搭变得更简单。
            </p>
            <div class="pt-2 flex items-center justify-center md:justify-start space-x-2">
              <div class="flex -space-x-1">
                <img
                  src="https://picsum.photos/id/64/100/100"
                  alt="用户头像"
                  class="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://picsum.photos/id/65/100/100"
                  alt="用户头像"
                  class="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://picsum.photos/id/66/100/100"
                  alt="用户头像"
                  class="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <p class="text-sm text-neutral-600">
                <span class="font-semibold text-primary">10,000+</span>
                用户的选择
              </p>
            </div>
          </div>

          <!-- 装饰衣物图片 -->
          <div
            class="clothes-container flex justify-center md:justify-start space-x-2 md:space-x-4 pt-4 relative"
          >
            <div
              class="clothes-item absolute md:static w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-white transform rotate-6 translate-x-6 z-10"
            >
              <img
                src="/src/assets/images/clothing/shirt.jpg"
                alt="时尚上衣展示"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="clothes-item w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-white transform -rotate-3 z-20"
            >
              <img
                src="/src/assets/images/clothing/pants.jpg"
                alt="时尚裤子展示"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="clothes-item absolute md:static w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-white transform rotate-2 -translate-x-6 z-10"
            >
              <img
                src="/src/assets/images/clothing/accessories.jpg"
                alt="时尚配饰展示"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- 品牌特色标签 -->
          <div class="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
            <span
              class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center"
            >
              <font-awesome-icon :icon="['fas', 'magic']" class="mr-1" />
              智能搭配
            </span>
            <span
              class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center"
            >
              <font-awesome-icon :icon="['fas', 'tag']" class="mr-1" />
              分类管理
            </span>
            <span
              class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center"
            >
              <font-awesome-icon :icon="['fas', 'calendar']" class="mr-1" />
              穿搭记录
            </span>
          </div>
        </div>

        <!-- 右侧：登录表单 -->
        <div class="w-full">
          <div
            class="bg-white rounded-2xl p-8 md:p-10 shadow-soft hover:shadow-medium transition-all duration-500 overflow-hidden"
          >
            <!-- 移动端品牌展示 -->
            <div class="md:hidden text-center mb-8">
              <div
                class="inline-block bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-2xl"
              >
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
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
                  >
                    <font-awesome-icon :icon="['fas', 'envelope']" class="text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all peer"
                    :class="{
                      'border-red-500': errors.email,
                      'border-green-500': form.email && !errors.email,
                    }"
                    placeholder=" "
                    required
                    @blur="validateEmail"
                    @input="validateEmail"
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
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
                  >
                    <font-awesome-icon :icon="['fas', 'lock']" class="text-neutral-400" />
                  </div>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="form.password"
                    class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all peer"
                    :class="{
                      'border-red-500': errors.password,
                      'border-green-500': form.password && !errors.password,
                    }"
                    placeholder=" "
                    required
                    @blur="validatePassword"
                    @input="validatePassword"
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
                    <font-awesome-icon
                      :icon="showPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']"
                    />
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

              <!-- 记住我和登录按钮 -->
              <div class="space-y-6 pt-4">
                <!-- 记住我和忘记密码 -->
                <div class="flex items-center justify-between">
                  <!-- 记住我开关 -->
                  <label for="remember" class="relative inline-flex items-center cursor-pointer">
                    <input
                      id="remember"
                      type="checkbox"
                      v-model="form.remember"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary flex-shrink-0"
                    ></div>
                    <span class="ml-3 text-sm font-medium text-neutral-700 self-center">
                      记住我
                    </span>
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
                  <span
                    class="text-xs text-gray-600 mt-1 group-hover:text-green-600 transition-colors"
                  >
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
                  <span
                    class="text-xs text-gray-600 mt-1 group-hover:text-blue-600 transition-colors"
                  >
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
                  <span
                    class="text-xs text-gray-600 mt-1 group-hover:text-gray-800 transition-colors"
                  >
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

  const router = useRouter();
  const isLoading = ref(false);
  const showPassword = ref(false);
  const showSuccess = ref(false);
  const showError = ref(false);

  // 密码强度相关
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
  const form = reactive({
    email: '',
    password: '',
    remember: false,
  });

  // 表单错误
  const errors = reactive({
    email: '',
    password: '',
    general: '',
  });

  // 切换密码可见性
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  // 验证电子邮件
  const validateEmail = () => {
    const email = form.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      errors.email = '请输入有效的电子邮件地址';
      return false;
    } else {
      errors.email = '';
      return true;
    }
  };

  // 计算密码强度
  const calculatePasswordStrength = password => {
    if (!password) return 0;

    let strength = 0;

    // 长度检查
    if (password.length >= 8) strength += 1;

    // 复杂性检查
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar].filter(
      Boolean
    ).length;
    if (varietyCount >= 3) strength += 1;

    // 确保强度值在0-2范围内
    return Math.min(strength, 2);
  };

  // 验证密码
  const validatePassword = () => {
    const password = form.password;

    if (password && password.length < 6) {
      errors.password = '密码长度至少为6位';
      return false;
    } else {
      errors.password = '';
      // 计算密码强度
      passwordStrength.value = calculatePasswordStrength(password);
      return true;
    }
  };

  // 处理登录
  const handleLogin = async () => {
    // 清除全局错误
    errors.general = '';

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
        errors.general = '用户名或密码错误，请重试';
        // 重置密码字段
        form.password = '';

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
      errors.general = '登录失败，请检查网络连接后重试';
      // 重置密码字段
      form.password = '';

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

  // 重置表单
  const resetForm = () => {
    form.email = '';
    form.password = '';
    form.remember = false;
    errors.email = '';
    errors.password = '';
    errors.general = '';
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

  /* 文本渐变 */
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
  }

  /* 装饰衣物动画 */
  .clothes-item {
    transition: all 0.5s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .clothes-container:hover .clothes-item:nth-child(1) {
    transform: rotate(8deg) scale(1.05);
    z-index: 30;
  }
  .clothes-container:hover .clothes-item:nth-child(2) {
    transform: rotate(-6deg) scale(1.05) translate(5px, -5px);
    z-index: 20;
  }
  .clothes-container:hover .clothes-item:nth-child(3) {
    transform: rotate(3deg) scale(1.05) translate(-5px, 5px);
    z-index: 10;
  }

  /* 输入框动画 */
  .form-group:focus-within label {
    color: #7c3aed;
    transform: translateY(-1.5rem) scale(0.85);
  }
  .form-float-label {
    transition: all 0.2s ease;
    pointer-events: none;
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
</style>
