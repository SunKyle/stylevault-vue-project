<template>
  <div class="mb-6">
    <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
      <font-awesome-icon :icon="['fas', 'calendar-alt']" class="text-primary mr-2" />
      适用季节
      <span class="text-red-500 ml-1" v-if="!readOnly">*</span>
    </h4>
    <div
      class="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div class="grid grid-cols-2 gap-3">
        <label
          v-for="season in seasonsOptions"
          :key="season.value"
          class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          :class="{ 'cursor-not-allowed': readOnly }"
        >
          <input
            type="checkbox"
            v-model="seasonsComputed"
            :value="season.value"
            :disabled="readOnly"
            :class="[
              readOnly ? 'cursor-not-allowed' : '',
              'rounded text-primary focus:ring-primary/30 border-neutral-300',
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
      <div class="mt-3 pt-3 border-t border-neutral-100">
        <label
          class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          :class="{ 'cursor-not-allowed': readOnly }"
        >
          <input
            type="checkbox"
            v-model="allSeasons"
            :disabled="readOnly"
            :class="[
              readOnly ? 'cursor-not-allowed' : '',
              'rounded text-primary focus:ring-primary/30 border-neutral-300',
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
  seasons: {
    type: Array,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:seasons']);

// 硬编码季节选项，与后端季节ID对应
const seasonsOptions = [
  { value: 1, label: '春季', icon: ['fas', 'seedling'], colorClass: 'text-green-500' },
  { value: 2, label: '夏季', icon: ['fas', 'sun'], colorClass: 'text-yellow-500' },
  { value: 3, label: '秋季', icon: ['fas', 'leaf'], colorClass: 'text-orange-500' },
  { value: 4, label: '冬季', icon: ['fas', 'snowflake'], colorClass: 'text-blue-500' },
];

// 使用本地ref存储季节数据
const localSeasons = ref(Array.isArray(props.seasons) ? [...props.seasons] : []);

// 监听props.seasons变化，同步到本地ref
watch(
  () => props.seasons,
  (newSeasons) => {
    if (Array.isArray(newSeasons)) {
      localSeasons.value = [...newSeasons];
    } else {
      localSeasons.value = [];
    }
  },
  { deep: true }
);

// 使用计算属性处理双向绑定
const seasonsComputed = computed({
  get() {
    return localSeasons.value;
  },
  set(value) {
    localSeasons.value = value;
    emit('update:seasons', value);
  },
});

// 全选季节
const allSeasons = computed({
  get() {
    if (!localSeasons.value || !Array.isArray(localSeasons.value)) return false;
    return (
      localSeasons.value.length === 4 &&
      localSeasons.value.includes(1) &&
      localSeasons.value.includes(2) &&
      localSeasons.value.includes(3) &&
      localSeasons.value.includes(4)
    );
  },
  set(value) {
    if (value) {
      seasonsComputed.value = [1, 2, 3, 4];
    } else {
      seasonsComputed.value = [];
    }
  },
});
</script>
