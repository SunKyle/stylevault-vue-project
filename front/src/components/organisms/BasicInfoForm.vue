<template>
  <!-- 基本信息表单组件 -->
  <!-- 用于填写衣物的基本信息，包括名称、品牌、颜色、风格等 -->
  <div class="space-y-8">
    <!-- 基本信息区域 -->
    <div class="mb-4 sm:mb-6 bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2 text-primary" />
        基本信息
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 衣物名称 -->
        <div class="form-group">
          <label class="form-label">
            衣物名称
            <span class="form-label-required">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            :disabled="readOnly"
            :class="['form-control', errors.name ? 'error-border' : '']"
            placeholder="请输入衣物名称"
            required
          />
          <div v-if="errors.name" class="error-message">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="error-icon" />
            {{ errors.name }}
          </div>
        </div>

        <!-- 分类 -->
        <div class="form-group">
          <label class="form-label">
            分类
            <span class="form-label-required">*</span>
          </label>
          <div class="select-container">
            <select
              v-model="form.category"
              :disabled="readOnly"
              class="form-control"
            >
              <option value="">请选择分类</option>
              <option
                v-for="category in categoryOptions"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
            <div class="select-arrow">
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="select-arrow-icon"
              />
            </div>
          </div>
        </div>

        <!-- 风格 -->
        <div class="form-group">
          <label class="form-label">
            风格
          </label>
          <div class="select-container">
            <select
              v-model="form.style"
              :disabled="readOnly"
              class="form-control"
            >
              <option value="">请选择风格</option>
              <option v-for="style in styleOptions" :key="style.value" :value="style.value">
                {{ style.label }}
              </option>
            </select>
            <div class="select-arrow">
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="select-arrow-icon"
              />
            </div>
          </div>
        </div>

        <!-- 品牌 -->
        <div class="form-group">
          <label class="form-label">
            品牌
          </label>
          <input
            v-model="form.brand"
            type="text"
            :disabled="readOnly"
            class="form-control"
            placeholder="请输入品牌名称"
          />
        </div>
      </div>
    </div>

    <!-- 属性信息区域 -->
    <div class="mb-4 sm:mb-6 bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'palette']" class="mr-2 text-primary" />
        属性信息
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 颜色 -->
        <div class="form-group">
          <label class="form-label">
            颜色
          </label>
          <div class="select-container">
            <select
              v-model="form.color"
              :disabled="readOnly"
              class="form-control"
            >
              <option value="">请选择颜色</option>
              <option v-for="color in colorOptions" :key="color.value" :value="color.value">
                {{ color.label }}
              </option>
            </select>
            <div class="select-arrow">
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="select-arrow-icon"
              />
            </div>
          </div>
        </div>

        <!-- 材质 -->
        <div class="form-group">
          <label class="form-label">
            材质
          </label>
          <div class="select-container">
            <select
              v-model="form.material"
              :disabled="readOnly"
              class="form-control"
            >
              <option value="">请选择材质</option>
              <option v-for="material in materialOptions" :key="material.value" :value="material.value">
                {{ material.label }}
              </option>
            </select>
            <div class="select-arrow">
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="select-arrow-icon"
              />
            </div>
          </div>
        </div>

        <!-- 尺寸 -->
        <div class="form-group">
          <label class="form-label">
            尺寸
          </label>
          <div class="select-container">
            <select
              v-model="form.size"
              :disabled="readOnly"
              class="form-control"
            >
              <option value="">请选择尺寸</option>
              <option v-for="size in sizeOptions" :key="size.value" :value="size.value">
                {{ size.label }}
              </option>
            </select>
            <div class="select-arrow">
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="select-arrow-icon"
              />
            </div>
          </div>
        </div>

        <!-- 状况 -->
        <div class="form-group">
          <label class="form-label">
            状况
          </label>
          <div class="select-container">
            <select
              v-model="form.condition"
              :disabled="readOnly"
              class="form-control"
            >
              <option value="">请选择状况</option>
              <option v-for="condition in conditionOptions" :key="condition.value" :value="condition.value">
                {{ condition.label }}
              </option>
            </select>
            <div class="select-arrow">
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="select-arrow-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 购买信息区域 -->
    <div class="mb-4 sm:mb-6 bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'shopping-bag']" class="mr-2 text-primary" />
        购买信息
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 价格 -->
        <div class="form-group">
          <label class="form-label">
            价格
          </label>
          <input
            v-model="form.price"
            type="number"
            :disabled="readOnly"
            :class="['form-control', errors.price ? 'error-border' : '']"
            placeholder="请输入价格"
            min="0"
            step="0.01"
          />
          <div v-if="errors.price" class="error-message">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="error-icon" />
            {{ errors.price }}
          </div>
        </div>

        <!-- 购买日期 -->
        <div class="form-group">
          <label class="form-label">
            购买日期
          </label>
          <input
            v-model="form.purchaseDate"
            type="date"
            :disabled="readOnly"
            class="form-control"
          />
        </div>
      </div>
    </div>

    <!-- 备注信息区域 -->
    <div class="mb-4 sm:mb-6 bg-neutral-50 rounded-xl p-4 sm:p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'sticky-note']" class="mr-2 text-primary" />
        备注信息
      </h4>
      <div class="grid grid-cols-1 gap-4">
        <!-- 备注 -->
        <div class="form-group">
          <div class="relative">
            <textarea
              v-model="form.notes"
              rows="4"
              :disabled="readOnly"
              :class="[
                'form-control',
                readOnly ? '' : 'resize-none',
                errors.notes ? 'error-border' : ''
              ]"
              :placeholder="readOnly ? '' : '记录这件衣物的特殊信息，如：购买渠道、搭配建议、注意事项等...'"
            ></textarea>
            <div class="absolute bottom-3 right-3 text-gray-400 text-xs">
              {{ (form.notes || '').length }}/200
            </div>
          </div>
          <div v-if="errors.notes" class="error-message">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="error-icon" />
            {{ errors.notes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * BasicInfoForm 组件
 * 衣物基本信息表单组件，用于填写衣物的基本信息、属性、购买信息和备注
 * 
 * @component
 * @props {
 *   modelValue: {
 *     type: Object,
 *     description: '表单数据对象，双向绑定',
 *     required: true
 *   },
 *   categories: {
 *     type: Array,
 *     description: '分类选项列表',
 *     required: true
 *   },
 *   readOnly: {
 *     type: Boolean,
 *     description: '是否为只读模式',
 *     default: false
 *   }
 * }
 * @emits {
 *   'update:modelValue': '表单数据更新时触发',
 *   'submit': '表单提交时触发'
 * }
 */
import { ref, watch, computed } from 'vue';
import { useEnumsStore } from '@/stores/modules/enumsStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 组件属性
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  readOnly: {
    type: Boolean,
    default: false
  }
});

// 组件事件
const emit = defineEmits(['update:modelValue']);

// 内部表单数据
const form = ref({
  name: '',
  category: '',
  style: '',
  color: '',
  material: '',
  size: '',
  condition: '',
  pattern: '',
  brand: '',
  price: null,
  purchaseDate: '',
  notes: '',
  seasons: [],
});

// 表单验证错误
const errors = ref({});

// 验证规则
const validateName = (value) => {
  if (value.length < 2) {
    return '衣物名称不能少于2个字符';
  }
  if (value.length > 50) {
    return '衣物名称不能超过50个字符';
  }
  return null;
};

const validateCategory = (value) => {
  if (value === null || value === '') {
    return '请选择衣物分类';
  }
  return null;
};

const validatePrice = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (value < 0) {
    return '价格不能为负数';
  }
  if (value > 999999) {
    return '价格不能超过999999';
  }
  return null;
};

const validateNotes = (value) => {
  if (value.length > 200) {
    return '备注不能超过200个字符';
  }
  return null;
};

// 实时验证单个字段
const validateField = (field, value) => {
  let error = null;
  
  switch (field) {
    case 'name':
      error = validateName(value);
      break;
    case 'category':
      error = validateCategory(value);
      break;
    case 'price':
      error = validatePrice(value);
      break;
    case 'notes':
      error = validateNotes(value);
      break;
  }
  
  errors.value[field] = error;
  return !error;
};





// 监听表单字段变化，进行实时验证
watch(() => form.value.name, (newValue) => validateField('name', newValue));
watch(() => form.value.category, (newValue) => validateField('category', newValue));
watch(() => form.value.price, (newValue) => validateField('price', newValue));
watch(() => form.value.notes, (newValue) => validateField('notes', newValue));

// 获取枚举数据
const enumsStore = useEnumsStore();

// 计算属性 - 从store获取枚举值
const styleOptions = computed(() => enumsStore.getOptions('styles'));
const colorOptions = computed(() => enumsStore.getOptions('colors'));
const materialOptions = computed(() => enumsStore.getOptions('materials'));
const sizeOptions = computed(() => enumsStore.getOptions('sizes'));
const conditionOptions = computed(() => enumsStore.getOptions('conditions'));
const categoryOptions = computed(() => enumsStore.getOptions('categories'));

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // 比较内部form和外部modelValue，只有当它们确实不同时才更新，避免循环
    const hasChanges = JSON.stringify(form.value) !== JSON.stringify(newValue);
    
    if (hasChanges) {
      // 使用JSON.parse(JSON.stringify())进行深拷贝，避免structuredClone错误
      // 只对可序列化数据有效
      const clonedValue = JSON.parse(JSON.stringify(newValue));
      
      // 确保所有字段都有默认值，避免显示问题
      const defaultValues = {
        name: '',
        category: '',
        style: '',
        color: '',
        material: '',
        size: '',
        condition: '',
        pattern: '',
        brand: '',
        price: 0, // 价格应该默认为0而非null
        purchaseDate: '',
        notes: '',
        seasons: [],
        image: '' // 图片字段的默认值
      };
      
      // 合并默认值和新值
      Object.keys(defaultValues).forEach(key => {
        // @ts-ignore - 动态键访问
        if (clonedValue[key] === undefined || clonedValue[key] === null) {
          // @ts-ignore - 动态键访问
          clonedValue[key] = defaultValues[key];
        }
      });
      
      form.value = clonedValue;
    }
  }
}, { immediate: true }); // 移除deep: true，避免性能问题和不必要的更新

// 监听内部值变化并向外部触发事件
// 使用JSON.parse(JSON.stringify())进行深拷贝，避免直接传递响应式对象
// 注意：在readOnly模式下不触发更新，避免不必要的数据流动
watch(form, (newValue) => {
  if (!props.readOnly) {
    emit('update:modelValue', JSON.parse(JSON.stringify(newValue)));
  }
}, { deep: true });


</script>

<style scoped>
  /* 确保隐藏浏览器默认的下拉箭头 */
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: none;
  }

  /* 针对特定浏览器的兼容性修复 */
  select::-ms-expand {
    display: none;
  }

  /* 表单控件共享样式 */
  .form-control {
    @apply w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all;
  }

  .form-control:disabled {
    @apply bg-gray-100 cursor-not-allowed;
  }

  .form-control:not(:disabled) {
    @apply bg-white;
  }

  select.form-control {
    @apply appearance-none;
  }

  /* 标签样式 */
  .form-label {
    @apply block text-sm font-medium text-neutral-700 mb-2 flex items-center;
  }

  .form-label-required {
    @apply text-red-500 ml-1;
  }

  /* 表单组样式 */
  .form-group {
    @apply space-y-2;
  }

  /* 选择器容器 */
  .select-container {
    @apply relative w-full;
  }
  
  /* 确保input和select对齐 */
  .form-group input.form-control,
  .form-group .select-container select.form-control {
    @apply mt-2;
  }

  /* 选择器箭头 */
  .select-arrow {
    @apply absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none;
  }

  .select-arrow-icon {
    @apply text-gray-400 text-sm;
  }

  /* 错误提示样式 */
  .error-message {
    @apply text-xs text-red-500 mt-1 flex items-center;
  }

  .error-icon {
    @apply mr-1 text-red-500;
  }

  .error-border {
    @apply border-red-500 focus:border-red-500 focus:ring-red-200;
  }

  .success-border {
    @apply border-green-500 focus:border-green-500 focus:ring-green-200;
  }
</style>
