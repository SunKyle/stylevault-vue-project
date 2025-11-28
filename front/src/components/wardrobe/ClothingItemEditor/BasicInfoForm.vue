<template>
  <!-- 基本信息表单组件 -->
  <!-- 用于填写衣物的基本信息，包括名称、品牌、颜色、风格等 -->
  <div class="space-y-6">
    <!-- 基本信息 - 第一行 -->
    <div class="grid grid-cols-1 gap-5">
      <!-- 衣物名称 -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
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
              readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm',
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300',
            ]"
            placeholder="请输入衣物名称"
            required
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'pen']" class="text-gray-400 text-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- 基本信息 - 第二行 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- 品牌 -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <font-awesome-icon :icon="['fas', 'industry']" class="text-primary mr-2" />
          品牌
        </label>
        <div class="relative">
          <input
            v-model="form.brand"
            type="text"
            :disabled="readOnly"
            :class="[
              readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm',
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300',
            ]"
            placeholder="请输入品牌名称"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'pen']" class="text-gray-400 text-sm" />
          </div>
        </div>
      </div>

      <!-- 颜色 -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <font-awesome-icon :icon="['fas', 'palette']" class="text-primary mr-2" />
          颜色
        </label>
        <div class="relative">
          <input
            v-model="form.color"
            type="text"
            :disabled="readOnly"
            :class="[
              readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm',
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300',
            ]"
            placeholder="例如：蓝色、黑色"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'pen']" class="text-gray-400 text-sm" />
          </div>
        </div>
      </div>

      <!-- 风格 -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <font-awesome-icon :icon="['fas', 'hat-wizard']" class="text-primary mr-2" />
          风格
        </label>
        <div class="relative">
          <input
            v-model="form.style"
            type="text"
            :disabled="readOnly"
            :class="[
              readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm',
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300',
            ]"
            placeholder="例如：休闲、正式"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'pen']" class="text-gray-400 text-sm" />
          </div>
        </div>
      </div>
    </div>

    <!-- 基本信息 - 第三行 -->
    <div class="grid grid-cols-1 gap-5">
      <!-- 分类 -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
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
                : 'bg-white/80 backdrop-blur-sm appearance-none',
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300',
            ]"
            required
            @change="updateCategoryName"
          >
            <option value="">请选择分类</option>
            <option
              v-for="category in categories"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
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
    </div>

    <!-- 基本信息 - 第四行 -->
    <div class="grid grid-cols-1 gap-5">
      <!-- 材质 -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <font-awesome-icon :icon="['fas', 'tshirt']" class="text-primary mr-2" />
          材质
        </label>
        <div class="relative">
          <input
            v-model="form.material"
            type="text"
            :disabled="readOnly"
            :class="[
              readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm',
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300',
            ]"
            placeholder="例如：棉质、丝绸"
          />
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          >
            <font-awesome-icon :icon="['fas', 'pen']" class="text-gray-400 text-sm" />
          </div>
        </div>
      </div>

      <!-- 备注 -->
      <div>
        <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <font-awesome-icon :icon="['fas', 'sticky-note']" class="text-primary mr-2" />
          备注
        </label>
        <div class="relative">
          <textarea
            v-model="form.notes"
            rows="3"
            :disabled="readOnly"
            :class="[
              readOnly
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-white/80 backdrop-blur-sm resize-none',
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300',
            ]"
            :placeholder="readOnly ? '' : '添加备注信息（可选）'"
          ></textarea>
          <div class="absolute bottom-3 right-3 text-gray-400 text-xs">
            {{ (form.notes || '').length }}/200
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
import { ref, watch } from 'vue';

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

const form = ref({ ...props.modelValue });

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  form.value = { ...newValue };
}, { deep: true });

// 监听内部值变化并向外部触发事件
watch(form, (newValue) => {
  emit('update:modelValue', { ...newValue });
}, { deep: true });

// 更新分类名称
const updateCategoryName = () => {
  if (form.value.category) {
    const selectedCategory = props.categories.find(c => c.value === form.value.category);
    if (selectedCategory) {
      form.value.categoryName = selectedCategory.label;
    }
  } else {
    form.value.categoryName = '';
  }
};
</script>
