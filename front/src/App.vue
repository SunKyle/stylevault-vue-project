<template>
  <div class="font-sans bg-neutral-50 text-neutral-800 min-h-screen flex flex-col">
    <!-- 登录页面不显示导航栏 -->
    <Header
      v-if="route.name !== 'login'"
      :currentSection="currentSection"
      @changeSection="changeSection"
    />
    <main
      :class="[route.name === 'login' ? 'min-h-screen' : 'flex-grow pt-20 pb-20 overflow-hidden']"
    >
      <transition name="page" mode="out-in">
        <router-view />
      </transition>
    </main>
    <!-- 登录页面不显示页脚 -->
    <Footer
      v-if="route.name !== 'login'"
      :currentSection="currentSection"
      @changeSection="changeSection"
      @showUpload="showUploadModal = true"
    />

    <!-- 登录页面不显示全局快捷操作按钮 -->
    <FloatingActionButton
      v-if="route.name !== 'login'"
      @addClothing="handleAddClothing"
      @addOutfit="handleAddOutfit"
      @upload="handleUpload"
      @viewAllClothing="handleViewAllClothing"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Header from './components/layout/Header.vue';
  import Footer from './components/layout/Footer.vue';
  import FloatingActionButton from './components/ui/FloatingActionButton.vue';

  const route = useRoute();
  const router = useRouter();
  const currentSection = ref('wardrobe');
  const showUploadModal = ref(false);

  // 监听路由变化，更新当前部分
  watch(
    () => route.name,
    newRouteName => {
      if (newRouteName === 'login') {
        currentSection.value = 'login';
      } else if (newRouteName === 'wardrobe') {
        currentSection.value = 'wardrobe';
      } else if (newRouteName === 'weather') {
        currentSection.value = 'weather';
      } else if (newRouteName === 'custom') {
        currentSection.value = 'custom';
      } else if (newRouteName === 'stats') {
        currentSection.value = 'stats';
      } else if (newRouteName === 'upload') {
        currentSection.value = 'upload';
      }
    },
    { immediate: true }
  );

  function changeSection(section) {
    if (section === 'login') {
      router.push('/');
    } else {
      router.push(`/${section}`);
    }
  }

  // 监听 showUploadModal 变化，切换到上传页面
  watch(showUploadModal, newValue => {
    if (newValue) {
      router.push('/upload');
      showUploadModal.value = false;
    }
  });

  // 处理全局快捷操作按钮的事件
  function handleAddClothing() {
    router.push('/upload');
  }

  function handleAddOutfit() {
    router.push('/custom');
  }

  function handleUpload() {
    router.push('/upload');
  }

  function handleViewAllClothing() {
    router.push('/wardrobe');
  }
</script>

<style>
  /* 页面切换动画 */
  .page-enter-active,
  .page-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .page-enter-from {
    opacity: 0;
    transform: translateX(-20px);
  }

  .page-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
</style>
