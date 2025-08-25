<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 py-3 px-6 z-50">
    <div class="flex justify-around">
      <button
        v-for="item in navItems"
        :key="item.key"
        :class="['flex flex-col items-center', currentSection === item.key ? 'text-primary' : 'text-neutral-500']"
        @click="$emit('changeSection', item.key)"
      >
        <div v-if="item.key === 'upload'" class="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center -mt-7 shadow-medium">
          <font-awesome-icon :icon="['fas', 'plus']" class="text-white text-xl" />
        </div>
        <template v-else>
          <font-awesome-icon :icon="item.icon" class="text-xl" />
          <span class="text-xs mt-1">{{ item.label }}</span>
        </template>
      </button>
    </div>
  </footer>
</template>

<script setup>
const props = defineProps({
  currentSection: String
})
const emit = defineEmits(['changeSection'])

const navItems = [
  { key: 'wardrobe', label: '衣橱', icon: ['fas', 'tshirt'] },
  { key: 'weather', label: '天气', icon: ['fas', 'cloud'] },
  { key: 'upload', label: '', icon: ['fas', 'plus'] },
  { key: 'custom', label: '搭配', icon: ['fas', 'magic'] },
  { key: 'stats', label: '分析', icon: ['fas', 'chart-bar'] }
]
</script>
