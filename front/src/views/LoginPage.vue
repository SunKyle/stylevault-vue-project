<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8 page-load">
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
                src="https://picsum.photos/id/91/300/300"
                alt="时尚上衣展示"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="clothes-item w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-white transform -rotate-3 z-20"
            >
              <img
                src="https://picsum.photos/id/21/300/300"
                alt="时尚裤子展示"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              class="clothes-item absolute md:static w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-white transform rotate-2 -translate-x-6 z-10"
            >
              <img
                src="https://picsum.photos/id/65/300/300"
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
            class="bg-white rounded-2xl p-8 md:p-10 shadow-soft hover:shadow-medium transition-all duration-500"
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

            <!-- 登录表单 -->
            <form @submit.prevent="handleLogin" class="space-y-6">
              <!-- 电子邮件 -->
              <div class="form-group relative">
                <label
                  for="email"
                  class="form-float-label block text-sm font-medium text-neutral-600 absolute top-3 left-10 bg-white px-1"
                >
                  电子邮件
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <font-awesome-icon :icon="['fas', 'envelope']" class="text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="your@email.com"
                    required
                    @blur="validateEmail"
                  />
                </div>
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
              </div>

              <!-- 密码 -->
              <div class="form-group relative">
                <label
                  for="password"
                  class="form-float-label block text-sm font-medium text-neutral-600 absolute top-3 left-10 bg-white px-1"
                >
                  密码
                </label>
                <div class="flex justify-between items-center mb-1">
                  <div class="relative w-full">
                    <div
                      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    >
                      <font-awesome-icon :icon="['fas', 'lock']" class="text-neutral-400" />
                    </div>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      placeholder="••••••••"
                      required
                      @blur="validatePassword"
                    />
                    <button
                      type="button"
                      @click="togglePassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-primary transition-colors"
                    >
                      <font-awesome-icon
                        :icon="showPassword ? ['fas', 'eye'] : ['fas', 'eye-slash']"
                      />
                    </button>
                  </div>
                </div>
                <div class="flex justify-end">
                  <a href="#" class="text-sm text-primary hover:text-primary/80 transition-colors">
                    忘记密码?
                  </a>
                </div>
                <p v-if="errors.password" class="text-red-500 text-sm mt-1">
                  {{ errors.password }}
                </p>
              </div>

              <!-- 记住我和登录按钮 -->
              <div class="space-y-4 pt-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      v-model="form.remember"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                    />
                    <label for="remember" class="ml-2 block text-sm text-neutral-600">
                      记住我的登录状态
                    </label>
                  </div>

                  <BaseButton
                    type="submit"
                    variant="primary"
                    size="md"
                    :loading="isLoading"
                    :disabled="isLoading"
                    class="bg-gradient-to-r from-primary to-secondary text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center"
                  >
                    <span>登录</span>
                    <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-2" />
                  </BaseButton>
                </div>
              </div>
            </form>

            <!-- 分隔线 -->
            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-3 bg-white text-neutral-600">或者使用以下方式登录</span>
              </div>
            </div>

            <!-- 社交登录 -->
            <div class="grid grid-cols-3 gap-4">
              <button
                class="flex items-center justify-center py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <font-awesome-icon
                  :icon="['fab', 'weixin']"
                  class="text-green-500 text-xl group-hover:scale-110 transition-transform"
                />
              </button>
              <button
                class="flex items-center justify-center py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <font-awesome-icon
                  :icon="['fab', 'qq']"
                  class="text-blue-500 text-xl group-hover:scale-110 transition-transform"
                />
              </button>
              <button
                class="flex items-center justify-center py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <font-awesome-icon
                  :icon="['fab', 'apple']"
                  class="text-gray-800 text-xl group-hover:scale-110 transition-transform"
                />
              </button>
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
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import BaseButton from '@/components/ui/BaseButton.vue';

  const router = useRouter();
  const isLoading = ref(false);
  const showPassword = ref(false);

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

  // 验证密码
  const validatePassword = () => {
    const password = form.password;

    if (password && password.length < 6) {
      errors.password = '密码长度至少为6位';
      return false;
    } else {
      errors.password = '';
      return true;
    }
  };

  // 处理登录
  const handleLogin = async () => {
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

      // 这里可以添加实际的登录逻辑
      console.log('登录信息:', form);

      // 登录成功，跳转到衣橱页面
      router.push('/wardrobe');
    } catch (error) {
      console.error('登录失败:', error);
      // 这里可以添加错误处理逻辑
    } finally {
      isLoading.value = false;
    }
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
