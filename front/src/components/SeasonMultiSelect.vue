<template>
  <div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        @click="toggleSeason(option.value)"
        :class="[
          'px-3 py-1 rounded-md text-sm border transition-colors',
          isSelected(option.value)
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
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
  const current = [...props.modelValue]
  const index = current.indexOf(value)
  
  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(value)
  }
  
  emit('update:modelValue', current)
}

const isSelected = (value) => {
  return props.modelValue.includes(value)
}
</script>