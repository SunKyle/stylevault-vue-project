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
  <Footer :currentSection="currentSection" @changeSection="changeSection" @showUpload="showUploadModal = true" />
</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Header from './components/common/layout/Header.vue'
import Footer from './components/common/layout/Footer.vue'

// 导入视图组件
import WardrobeView from './views/WardrobeView.vue'
import WeatherView from './views/WeatherView.vue'
import CustomView from './views/InspirationView.vue'
import StatsView from './views/AnalysisView.vue'
import UploadView from './views/UploadView.vue'

const currentSection = ref('wardrobe')
const showUploadModal = ref(false)

const components = {
  wardrobe: WardrobeView,
  weather: WeatherView,
  custom: CustomView,
  stats: StatsView,
  upload: UploadView
}

const currentComponent = computed(() => components[currentSection.value])

function changeSection(section) {
  currentSection.value = section
}

// 监听 showUploadModal 变化，切换到上传页面
watch(showUploadModal, (newValue) => {
  if (newValue) {
    currentSection.value = 'upload'
    showUploadModal.value = false
  }
})
</script>
