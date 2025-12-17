<template>
  <div class="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
    <div class="grid grid-cols-4 gap-3">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        :class="{ 'cursor-not-allowed': disabled }"
      >
        <input
          type="checkbox"
          v-model="localSeasons"
          :value="option.value"
          :disabled="disabled"
          :class="[
            disabled ? 'cursor-not-allowed' : '',
            'rounded text-primary focus:ring-primary/30 border-neutral-300',
          ]"
        />
        <span class="text-sm flex items-center">
          <font-awesome-icon
            :icon="getSeasonIcon(option.value)"
            :class="getSeasonColorClass(option.value) + ' mr-1.5 text-xs'"
          />
          {{ option.label }}
        </span>
      </label>
    </div>
    <div class="mt-3 pt-3 border-t border-neutral-100">
      <label
        class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        :class="{ 'cursor-not-allowed': disabled }"
      >
        <input
          type="checkbox"
          v-model="allSeasons"
          :disabled="disabled"
          :class="[
            disabled ? 'cursor-not-allowed' : '',
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
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const localSeasons = ref([...props.modelValue]);

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localSeasons.value = [...newValue];
}, { deep: true });

// 监听内部值变化并向外部触发事件
watch(localSeasons, (newValue) => {
  emit('update:modelValue', [...newValue]);
}, { deep: true });

// 为不同季节获取对应的图标
const getSeasonIcon = (seasonValue) => {
  // 根据季节的value或label获取对应的图标
  const seasonOptions = props.options;
  const season = seasonOptions.find(opt => opt.value === seasonValue);
  const seasonLabel = season?.label || '';
  
  const seasonIcons = {
    '春季': ['fas', 'seedling'],
    '夏季': ['fas', 'sun'],
    '秋季': ['fas', 'leaf'],
    '冬季': ['fas', 'snowflake'],
    // 其他季节可以根据需要添加
  };
  
  return seasonIcons[seasonLabel] || ['fas', 'calendar-alt'];
};

// 为不同季节获取对应的颜色类
const getSeasonColorClass = (seasonValue) => {
  // 根据季节的value或label获取对应的颜色
  const seasonOptions = props.options;
  const season = seasonOptions.find(opt => opt.value === seasonValue);
  const seasonLabel = season?.label || '';
  
  const seasonColors = {
    '春季': 'text-green-500',
    '夏季': 'text-yellow-500',
    '秋季': 'text-orange-500',
    '冬季': 'text-blue-500',
    // 其他季节可以根据需要添加
  };
  
  return seasonColors[seasonLabel] || 'text-gray-500';
};

// 全选季节
const allSeasons = computed({
  get() {
    if (!localSeasons.value || !Array.isArray(localSeasons.value) || !props.options || !props.options.length) return false;
    
    // 获取所有季节的value
    const allSeasonValues = props.options.map(opt => opt.value);
    
    // 检查是否所有季节都被选中
    return allSeasonValues.every(value => localSeasons.value.includes(value));
  },
  set(value) {
    if (value) {
      // 全选：选中所有季节的value
      localSeasons.value = props.options.map(opt => opt.value);
    } else {
      // 取消全选：清空选中列表
      localSeasons.value = [];
    }
  },
});
</script>
