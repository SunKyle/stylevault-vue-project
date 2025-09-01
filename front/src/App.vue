<template>
  <div class="font-sans bg-neutral-50 text-neutral-800 min-h-screen flex flex-col">
    <Header :currentSection="currentSection" @changeSection="changeSection" />
    <main class="flex-grow pt-20 pb-20 overflow-hidden">
      <transition name="fade-slide" mode="out-in">
        <component
          :is="currentComponent"
          :key="currentSection"
          class="transition-all duration-500"
          @showUpload="showUploadModal = true"
        />
      </transition>
    </main>
    <Footer
      :currentSection="currentSection"
      @changeSection="changeSection"
      @showUpload="showUploadModal = true"
    />

    <!-- 全局快捷操作按钮 -->
    <FloatingActionButton
      @addClothing="handleAddClothing"
      @addOutfit="handleAddOutfit"
      @upload="handleUpload"
      @viewAllClothing="handleViewAllClothing"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import Header from './components/layout/Header.vue';
  import Footer from './components/layout/Footer.vue';
  import FloatingActionButton from './components/ui/FloatingActionButton.vue';

  // 导入视图组件
  import WardrobeView from './views/WardrobeView.vue';
  import WeatherView from './views/WeatherView.vue';
  import InspirationView from './views/InspirationView.vue';
  import AnalysisView from './views/AnalysisView.vue';
  import UploadView from './views/UploadView.vue';

  const currentSection = ref('wardrobe');
  const showUploadModal = ref(false);

  const components = {
    wardrobe: WardrobeView,
    weather: WeatherView,
    custom: InspirationView,
    stats: AnalysisView,
    upload: UploadView,
  };

  const currentComponent = computed(() => components[currentSection.value]);

  function changeSection(section) {
    currentSection.value = section;
  }

  // 监听 showUploadModal 变化，切换到上传页面
  watch(showUploadModal, newValue => {
    if (newValue) {
      currentSection.value = 'upload';
      showUploadModal.value = false;
    }
  });

  // 处理全局快捷操作按钮的事件
  function handleAddClothing() {
    // 这里可以实现添加衣物的逻辑，例如跳转到相应页面或打开模态框
    currentSection.value = 'upload';
  }

  function handleAddOutfit() {
    // 这里可以实现添加搭配的逻辑
    currentSection.value = 'custom';
  }

  function handleUpload() {
    // 这里可以实现上传照片的逻辑
    currentSection.value = 'upload';
  }

  function handleViewAllClothing() {
    // 跳转到衣橱页面并确保组件已加载
    currentSection.value = 'wardrobe';
    // 这里需要确保WardrobeSection组件已加载，然后调用其查看全部方法
    // 在下一个tick中发送自定义事件给WardrobeSection组件
    nextTick(() => {
      const event = new CustomEvent('view-all-clothing', {
        bubbles: true,
        composed: true,
      });
      document.dispatchEvent(event);
    });
  }
</script>
