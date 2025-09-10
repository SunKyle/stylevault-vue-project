<template>
  <div>
    <!-- <label class="block text-sm font-medium text-neutral-700 mb-2">季节</label> -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="toggleSeason(option.value)"
        class="py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] h-[48px]"
        :class="[
          isSelected(option.value)
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md border border-indigo-200'
            : 'bg-white text-neutral-700 hover:bg-indigo-50 border border-neutral-200 hover:border-indigo-300 shadow-sm'
        ]"
      >
        <span class="relative z-10">{{ option.label }}</span>
        <!-- 选中状态的装饰效果 -->
        <div
          v-if="isSelected(option.value)"
          class="absolute inset-0 bg-white/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const toggleSeason = (value) => {
  const currentValue = [...props.modelValue]
  const index = currentValue.indexOf(value)
  
  if (index > -1) {
    currentValue.splice(index, 1)
  } else {
    currentValue.push(value)
  }
  
  emit('update:modelValue', currentValue)
}

const isSelected = (value) => {
  return props.modelValue.includes(value)
}
</script>