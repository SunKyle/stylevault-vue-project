<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header
    id="header"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
    :class="headerClass"
  >
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo和品牌名称 -->
      <div
        class="flex items-center space-x-3 group cursor-pointer"
        @click="$emit('changeSection', 'wardrobe')"
      >
        <div class="relative">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
          >
            <font-awesome-icon :icon="['fas', 'shirt']" class="text-white text-xl" />
          </div>
          <div
            class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-md"
          >
            <font-awesome-icon :icon="['fas', 'moon']" class="text-white text-xs" />
          </div>
        </div>
        <div>
          <h1
            class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            StyleVault
          </h1>
          <p class="text-xs text-gray-500 -mt-1">智能穿搭助手</p>
        </div>
      </div>

      <!-- 桌面端导航 -->
      <nav class="hidden lg:flex items-center space-x-1">
        <button
          v-for="(item, index) in navItems"
          :key="item.key"
          :class="[
            'relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 group overflow-hidden',
            currentSection === item.key ? 'text-white' : 'text-gray-600 hover:text-gray-900',
          ]"
          @click="$emit('changeSection', item.key)"
          :style="currentSection === item.key ? { background: navItemGradients[index] } : ''"
        >
          <span class="relative z-10 flex items-center">
            <font-awesome-icon :icon="item.icon" class="mr-2 text-sm" />
            {{ item.label }}
          </span>
          <div
            v-if="currentSection === item.key"
            class="absolute inset-0 bg-gradient-to-r opacity-100"
          ></div>
          <div
            v-else
            class="absolute inset-0 bg-gray-100 rounded-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          ></div>
        </button>
      </nav>

      <!-- 右侧功能区 -->
      <div class="flex items-center space-x-3">
        <!-- 搜索按钮 -->
        <button
          class="p-2.5 text-gray-500 hover:text-indigo-600 transition-all duration-300 rounded-xl hover:bg-indigo-50 group"
        >
          <font-awesome-icon
            :icon="['fas', 'search']"
            class="text-lg group-hover:scale-110 transition-transform"
          />
        </button>

        <!-- 通知按钮 -->
        <div class="relative">
          <button
            class="relative p-2.5 text-gray-500 hover:text-indigo-600 transition-all duration-300 rounded-xl hover:bg-indigo-50 group"
          >
            <font-awesome-icon
              :icon="['far', 'bell']"
              class="text-lg group-hover:animate-bounce transition-transform"
            />
            <span
              class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"
            ></span>
            <span
              class="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full opacity-30 animate-ping"
            ></span>
          </button>

          <!-- 通知下拉菜单 -->
          <div
            class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <div class="px-4 py-3 border-b border-gray-100">
              <h3 class="font-semibold text-gray-800">通知</h3>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div
                class="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
              >
                <div class="flex">
                  <div class="flex-shrink-0 mr-3">
                    <div
                      class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"
                    >
                      <font-awesome-icon :icon="['fas', 'shirt']" class="text-indigo-600" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">新的穿搭推荐</p>
                    <p class="text-sm text-gray-500 truncate">根据今日天气为您推荐了3套穿搭</p>
                    <p class="text-xs text-gray-400 mt-1">10分钟前</p>
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div class="flex">
                  <div class="flex-shrink-0 mr-3">
                    <div
                      class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"
                    >
                      <font-awesome-icon :icon="['fas', 'check']" class="text-green-600" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">搭配已保存</p>
                    <p class="text-sm text-gray-500 truncate">您的"商务休闲"搭配已成功保存</p>
                    <p class="text-xs text-gray-400 mt-1">1小时前</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-2 text-center border-t border-gray-100">
              <a href="#" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                查看全部通知
              </a>
            </div>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <button
          class="lg:hidden p-2.5 text-gray-500 hover:text-indigo-600 transition-colors rounded-xl hover:bg-indigo-50"
          @click="toggleMobileMenu"
        >
          <font-awesome-icon
            :icon="mobileMenuOpen ? ['fas', 'xmark'] : ['fas', 'bars']"
            class="text-xl transition-transform duration-300"
            :class="mobileMenuOpen ? 'rotate-90' : ''"
          />
        </button>

        <!-- 用户头像和下拉菜单 -->
        <div class="relative group hidden lg:block">
          <div
            class="w-11 h-11 rounded-full overflow-hidden cursor-pointer border-2 border-white shadow-lg ring-2 ring-transparent group-hover:ring-indigo-300 transition-all duration-300"
          >
            <img
              src="https://picsum.photos/seed/user/100/100"
              alt="用户头像"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <div class="px-5 py-4 border-b border-gray-100">
              <p class="font-semibold text-gray-800">王小月</p>
              <p class="text-sm text-gray-500">user@example.com</p>
              <div
                class="mt-2 flex items-center text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full inline-block"
              >
                <font-awesome-icon :icon="['fas', 'crown']" class="mr-1" />
                高级会员
              </div>
            </div>
            <a
              href="#"
              class="flex items-center px-5 py-3 text-sm hover:bg-gray-50 transition-colors"
            >
              <font-awesome-icon :icon="['far', 'user']" class="mr-3 text-gray-400 w-4" />
              个人资料
            </a>
            <a
              href="#"
              class="flex items-center px-5 py-3 text-sm hover:bg-gray-50 transition-colors"
            >
              <font-awesome-icon :icon="['fas', 'gear']" class="mr-3 text-gray-400 w-4" />
              设置
            </a>
            <a
              href="#"
              class="flex items-center px-5 py-3 text-sm hover:bg-gray-50 transition-colors"
            >
              <font-awesome-icon :icon="['fas', 'crown']" class="mr-3 text-amber-500 w-4" />
              会员中心
            </a>
            <div class="border-t border-gray-100 my-1"></div>
            <a
              href="#"
              class="flex items-center px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              @click.prevent="handleLogout"
            >
              <font-awesome-icon :icon="['fas', 'right-from-bracket']" class="mr-3 w-4" />
              退出登录
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden bg-white shadow-xl border-t border-gray-100">
        <div class="container mx-auto px-4 py-4">
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="(item, index) in navItems"
              :key="item.key"
              :class="[
                'flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300',
                currentSection === item.key ? 'text-white' : 'text-gray-600 hover:bg-gray-50',
              ]"
              :style="currentSection === item.key ? { background: navItemGradients[index] } : ''"
              @click="navigateToSection(item.key)"
            >
              <font-awesome-icon :icon="item.icon" class="text-xl mb-2" />
              <span class="text-sm font-medium">{{ item.label }}</span>
            </button>
          </div>

          <!-- 移动端用户信息 -->
          <div class="mt-6 pt-4 border-t border-gray-100 flex items-center">
            <div class="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-white shadow">
              <img
                src="https://picsum.photos/seed/user/100/100"
                alt="用户头像"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center">
                <p class="font-medium">王小月</p>
                <span class="ml-2 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                  <font-awesome-icon :icon="['fas', 'crown']" class="mr-1 text-xs" />
                  会员
                </span>
              </div>
              <p class="text-sm text-gray-500">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore.js';

  const router = useRouter();
  const authStore = useAuthStore();

  defineProps({
    currentSection: String,
  });
  const emit = defineEmits(['changeSection']);

  const navItems = [
    { key: 'wardrobe', label: '我的衣橱', icon: ['fas', 'shirt'] },
    { key: 'weather', label: '天气穿搭', icon: ['fas', 'cloud-sun'] },
    { key: 'custom', label: '搭配灵感', icon: ['fas', 'lightbulb'] },
    { key: 'stats', label: '穿搭分析', icon: ['fas', 'chart-line'] },
  ];

  const navItemGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];

  const headerClass = ref('');
  const mobileMenuOpen = ref(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      headerClass.value = 'bg-white/95 backdrop-blur-md shadow-lg py-2';
    } else {
      headerClass.value = '';
    }
  };

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const navigateToSection = key => {
    emit('changeSection', key);
    mobileMenuOpen.value = false;
  };

  // 处理退出登录
  const handleLogout = () => {
    // 清除认证状态（包括用户数据和token）
    authStore.logout();

    // 跳转到登录页面
    router.push('/');

    // 关闭移动端菜单（如果打开）
    mobileMenuOpen.value = false;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped>
  /* 动画效果 */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes ping {
    75%,
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .animate-ping {
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
</style>
