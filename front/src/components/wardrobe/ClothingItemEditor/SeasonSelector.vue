<template>
  <div>
    <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
      <font-awesome-icon :icon="['fas', 'calendar-alt']" class="text-primary mr-2" />
      适用季节
    </label>
    <div
      class="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-4 shadow-sm"
    >
      <div class="grid grid-cols-2 gap-3">
        <label
          v-for="season in seasonsOptions"
          :key="season.value"
          class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            v-model="localSeasons"
            :value="season.value"
            :disabled="readOnly"
            :class="[
              readOnly ? 'cursor-not-allowed' : '',
              'rounded text-primary focus:ring-primary/30 border-gray-300',
            ]"
          />
          <span class="text-sm flex items-center">
            <font-awesome-icon
              :icon="season.icon"
              :class="season.colorClass + ' mr-1.5 text-xs'"
            />
            {{ season.label }}
          </span>
        </label>
      </div>
      <div class="mt-3 pt-3 border-t border-gray-200">
        <label
          class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            v-model="allSeasons"
            :disabled="readOnly"
            :class="[
              readOnly ? 'cursor-not-allowed' : '',
              'rounded text-primary focus:ring-primary/30 border-gray-300',
            ]"
          />
          <span class="text-sm flex items-center font-medium">
            <font-awesome-icon
              :icon="['fas', 'globe-asia']"
              class="text-purple-500 mr-1.5 text-xs"
            />
            四季通用
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 季节选择组件
 * 
 * 用于选择衣物适合的季节，支持多选和一键全选（四季通用）
 * 提供直观的季节选择界面，支持双向数据绑定和只读模式
 * 
 * @component
 * @example
 * <SeasonSelector
 *   v-model="form.seasons"
 *   :read-only="false"
 * />
 */
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const seasonsOptions = [
  { value: '春季', label: '春季', icon: ['fas', 'seedling'], colorClass: 'text-green-500' },
  { value: '夏季', label: '夏季', icon: ['fas', 'sun'], colorClass: 'text-yellow-500' },
  { value: '秋季', label: '秋季', icon: ['fas', 'leaf'], colorClass: 'text-orange-500' },
  { value: '冬季', label: '冬季', icon: ['fas', 'snowflake'], colorClass: 'text-blue-500' },
];

const localSeasons = ref([...props.modelValue]);

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localSeasons.value = [...newValue];
}, { deep: true });

// 监听内部值变化并向外部触发事件
watch(localSeasons, (newValue) => {
  emit('update:modelValue', [...newValue]);
}, { deep: true });

// 全选季节
const allSeasons = computed({
  get() {
    if (!localSeasons.value || !Array.isArray(localSeasons.value)) return false;
    return (
      localSeasons.value.length === 4 &&
      localSeasons.value.includes('春季') &&
      localSeasons.value.includes('夏季') &&
      localSeasons.value.includes('秋季') &&
      localSeasons.value.includes('冬季')
    );
  },
  set(value) {
    if (value) {
      localSeasons.value = ['春季', '夏季', '秋季', '冬季'];
    } else {
      localSeasons.value = [];
    }
  },
});
</script>
