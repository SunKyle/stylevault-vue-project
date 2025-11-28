<template>
  <div
    class="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100"
  >
    <input v-model="localFavorite" type="checkbox" id="favorite" class="sr-only" />
    <div
      class="mr-2 w-5 h-5 flex items-center justify-center rounded border-2 border-gray-300 transition-colors duration-200"
      :class="{
        'bg-pink-500 border-pink-500': localFavorite,
        'border-gray-300': !localFavorite,
      }"
    >
      <font-awesome-icon
        v-if="localFavorite"
        :icon="['fas', 'heart']"
        class="text-white text-xs"
      />
    </div>
    <label
      for="favorite"
      class="block text-sm text-gray-700 flex items-center cursor-pointer"
    >
      <font-awesome-icon :icon="['fas', 'heart']" class="text-pink-500 mr-2" />
      添加到收藏
    </label>
  </div>
</template>

<script setup>
/**
 * 收藏切换组件
 * 用于标记或取消标记衣物为收藏状态
 * @component FavoriteToggle
 * @example
 * <FavoriteToggle v-model="isFavorite" :read-only="false" />
 */
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const localFavorite = ref(props.modelValue);

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localFavorite.value = newValue;
});

// 监听内部值变化并向外部触发事件
watch(localFavorite, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
