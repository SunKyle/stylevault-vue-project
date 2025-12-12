<template>
  <!-- 基本信息表单组件 -->
  <!-- 用于填写衣物的基本信息，包括名称、品牌、颜色、风格等 -->
  <div class="space-y-8">
    <!-- 基本信息区域 -->
    <div class="mb-6 bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2 text-primary" />
        基本信息
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 衣物名称 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'tag']" class="text-primary mr-2" />
            衣物名称
            <span class="text-red-500 ml-1">*</span>
          </label>
          <div class="relative">
            <input
              v-model="form.name"
              type="text"
              :disabled="readOnly"
              :class="[
                readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
              placeholder="请输入衣物名称"
              required
            />
          </div>
        </div>

        <!-- 分类 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'folder']" class="text-primary mr-2" />
            分类
            <span class="text-red-500 ml-1">*</span>
          </label>
          <div class="relative">
            <select
              v-model="form.category"
              :disabled="readOnly"
              :class="[
                readOnly
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white appearance-none',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
              required
              @change="updateCategoryName"
            >
              <option value="">请选择分类</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-gray-400 text-sm"
              />
            </div>
          </div>
          <p
            v-if="form.category && !categories.find(c => c.id === form.category)"
            class="text-xs text-yellow-600 mt-1 flex items-center"
          >
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="mr-1" />
            当前衣物分类已不存在，请重新选择
          </p>
        </div>

        <!-- 风格 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'hat-wizard']" class="text-primary mr-2" />
            风格
          </label>
          <div class="relative">
            <select
              v-model="form.style"
              :disabled="readOnly"
              :class="[
                readOnly
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white appearance-none',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
            >
              <option value="">请选择风格</option>
              <option v-for="style in styleOptions" :key="style.value" :value="style.value">
                {{ style.label }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 品牌 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'industry']" class="text-primary mr-2" />
            品牌
          </label>
          <div class="relative">
            <input
              v-model="form.brand"
              type="text"
              :disabled="readOnly"
              :class="[
                readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
              placeholder="请输入品牌名称"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 属性信息区域 -->
    <div class="mb-6 bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'palette']" class="mr-2 text-primary" />
        属性信息
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 颜色 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'palette']" class="text-primary mr-2" />
            颜色
          </label>
          <div class="relative">
            <select
              v-model="form.color"
              :disabled="readOnly"
              :class="[
                readOnly
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white appearance-none',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
            >
              <option value="">请选择颜色</option>
              <option v-for="color in colorOptions" :key="color.value" :value="color.value">
                {{ color.label }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 材质 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'tshirt']" class="text-primary mr-2" />
            材质
          </label>
          <div class="relative">
            <select
              v-model="form.material"
              :disabled="readOnly"
              :class="[
                readOnly
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white appearance-none',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
            >
              <option value="">请选择材质</option>
              <option v-for="material in materialOptions" :key="material.value" :value="material.value">
                {{ material.label }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 尺寸 -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'ruler-combined']" class="text-primary mr-2" />
            尺寸
          </label>
          <div class="relative">
            <select
              v-model="form.size"
              :disabled="readOnly"
              :class="[
                readOnly
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white appearance-none',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
            >
              <option value="">请选择尺寸</option>
              <option v-for="size in sizeOptions" :key="size.value" :value="size.value">
                {{ size.label }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 状况 -->
        <div>
          <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'star']" class="text-primary mr-2" />
            状况
          </label>
          <div class="relative">
            <select
              v-model="form.condition"
              :disabled="readOnly"
              :class="[
                readOnly
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white appearance-none',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
            >
              <option value="">请选择状况</option>
              <option v-for="condition in conditionOptions" :key="condition.value" :value="condition.value">
                {{ condition.label }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 图案 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'pattern']" class="text-primary mr-2" />
            图案
          </label>
          <div class="relative">
            <input
              v-model="form.pattern"
              type="text"
              :disabled="readOnly"
              :class="[
                readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
              placeholder="例如：条纹、格子"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 购买信息区域 -->
    <div class="mb-6 bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'shopping-bag']" class="mr-2 text-primary" />
        购买信息
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 价格 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'dollar-sign']" class="text-primary mr-2" />
            价格
          </label>
          <div class="relative">
            <input
              v-model="form.price"
              type="number"
              :disabled="readOnly"
              :class="[
                readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
              placeholder="请输入价格"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <!-- 购买日期 -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
            <font-awesome-icon :icon="['fas', 'calendar']" class="text-primary mr-2" />
            购买日期
          </label>
          <div class="relative">
            <input
              v-model="form.purchaseDate"
              type="date"
              :disabled="readOnly"
              :class="[
                readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 备注信息区域 -->
    <div class="mb-6 bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <h4 class="text-lg font-medium text-neutral-700 mb-4 flex items-center">
        <font-awesome-icon :icon="['fas', 'sticky-note']" class="mr-2 text-primary" />
        备注信息
      </h4>
      <div class="grid grid-cols-1 gap-4">
        <!-- 备注 -->
        <div>
          <div class="relative">
            <textarea
              v-model="form.notes"
              rows="4"
              :disabled="readOnly"
              :class="[
                readOnly
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-white resize-none',
                'w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all',
              ]"
              :placeholder="readOnly ? '' : '记录这件衣物的特殊信息，如：购买渠道、搭配建议、注意事项等...'"
            ></textarea>
            <div class="absolute bottom-3 right-3 text-gray-400 text-xs">
              {{ (form.notes || '').length }}/200
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 基本信息表单组件
 * 
 * 用于填写衣物的基本信息，包括名称、品牌、颜色、风格、分类、材质和备注
 * 支持双向数据绑定和表单验证
 * 
 * @component
 * @example
 * <BasicInfoForm
 *   :form-data="formData"
 *   :categories="categories"
 *   :is-category-exist="isCategoryExist"
 *   @update:form-data="updateForm"
 * />
 */
import { ref, watch, computed } from 'vue';
import { useEnumsStore } from '@/stores/modules/enumsStore';
import SeasonMultiSelect from '@/components/form/SeasonMultiSelect.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// 内部表单数据
const form = ref({
  name: '',
  category: '',
  categoryName: '',
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

// 获取枚举数据
const enumsStore = useEnumsStore();

// 计算属性 - 从store获取枚举值
const styleOptions = computed(() => enumsStore.styleOptions);
const colorOptions = computed(() => enumsStore.colorOptions);
const materialOptions = computed(() => enumsStore.materialOptions);
const sizeOptions = computed(() => enumsStore.sizeOptions);
const conditionOptions = computed(() => enumsStore.conditionOptions);
const seasonOptions = computed(() => enumsStore.seasonOptions);

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // 深拷贝确保表单内部可以自由修改
    form.value = JSON.parse(JSON.stringify(newValue));
    // 确保所有字段都有默认值，避免显示问题
    form.value.name = form.value.name || '';
    form.value.category = form.value.category || '';
    form.value.categoryName = form.value.categoryName || '';
    form.value.style = form.value.style || '';
    form.value.color = form.value.color || '';
    form.value.material = form.value.material || '';
    form.value.size = form.value.size || '';
    form.value.condition = form.value.condition || '';
    form.value.pattern = form.value.pattern || '';
    form.value.brand = form.value.brand || '';
    form.value.price = form.value.price || null;
    form.value.purchaseDate = form.value.purchaseDate || '';
    form.value.notes = form.value.notes || '';
    form.value.seasons = form.value.seasons || [];
  }
}, { immediate: true, deep: true });

// 监听内部值变化并向外部触发事件
watch(form, (newValue) => {
  emit('update:modelValue', { ...newValue });
}, { deep: true });

// 更新分类名称
const updateCategoryName = () => {
  if (form.value.category) {
    // 尝试先按value匹配，再按id匹配
    let selectedCategory = props.categories.find(c => c.value === form.value.category);
    if (!selectedCategory) {
      selectedCategory = props.categories.find(c => c.id === form.value.category);
    }
    if (selectedCategory) {
      form.value.categoryName = selectedCategory.label || selectedCategory.name;
    }
  } else {
    form.value.categoryName = '';
  }
};

// 监听分类变化，更新分类名称
watch(() => form.value.category, () => {
  updateCategoryName();
});

// 初始化分类名称
updateCategoryName();
</script>
