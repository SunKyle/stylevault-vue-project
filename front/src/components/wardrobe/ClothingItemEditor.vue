<template>
  <!-- 衣物编辑/详情模态框 -->
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click="closeOnBackdrop"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- 头部 -->
        <div
          :class="[
            readOnly ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400',
            'p-6 text-white relative overflow-hidden z-10 flex-shrink-0'
          ]"
        >
          <!-- 装饰元素 -->
          <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>

          <!-- 头部内容 -->
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4 shadow-sm">
                  <font-awesome-icon :icon="readOnly ? ['fas', 'info'] : ['fas', 'edit']" class="text-white text-lg" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold tracking-wide mb-1">{{ readOnly ? '衣物详情' : '编辑衣物' }}</h2>
                  <p class="text-white/80 text-sm max-w-xs">完善您的衣物信息，打造个性衣橱</p>
                </div>
              </div>

              <button
                @click="emit('close')"
                class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-sm ml-2"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-white text-sm" />
              </button>
            </div>
          </div>

          <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        <!-- 表单内容 -->
        <div class="flex-1 overflow-y-auto p-6 bg-white">
          <!-- 加载状态（新增） -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>

          <template v-else>
            <!-- 图片上传区域 -->
            <div class="mb-6">
              <ImageUpload 
                v-model:image="form.mainImageUrl" 
                :read-only="props.readOnly"
              />
            </div>

            <!-- 基本信息 -->
            <div class="mb-6">
              <BasicInfoForm 
                v-model="form" 
                :read-only="props.readOnly"
                :categories="categories"
                @update:category="updateCategoryName"
              />
            </div>

            <!-- 季节选择 -->
            <div class="mb-6">
              <SeasonSelector 
                v-model:seasons="form.seasons" 
                :read-only="props.readOnly"
                @update:seasons="updateSeasons"
              />
            </div>

            <!-- 收藏 -->
            <div class="mb-8">
              <FavoriteToggle 
                v-model:favorite="form.isFavorite" 
                :read-only="props.readOnly"
                @update:favorite="updateFavorite"
              />
            </div>

            <!-- 错误提示（优化文案和样式） -->
            <div v-if="formError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
              <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2 flex-shrink-0" />
              {{ formError }}
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-4 mt-8 pt-5 border-t border-gray-200 bg-white/80 backdrop-blur-sm rounded-b-xl -mx-6 -mb-6 px-6 pb-6">
              <button
                @click="emit('close')"
                class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="mr-2" />
                {{ readOnly ? '关闭' : '取消' }}
              </button>
              <button
                v-if="!readOnly"
                @click="saveItem"
                :disabled="!isFormValid || loading"
                class="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center disabled:hover:shadow-none"
              >
                <font-awesome-icon v-if="loading" :icon="['fas', 'spinner']" class="mr-2 animate-spin" />
                <font-awesome-icon v-else :icon="['fas', 'save']" class="mr-2" />
                保存
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
/**
 * 衣物编辑/详情模态框组件
 * @component
 * @props {Boolean} isOpen - 控制模态框显示/隐藏
 * @props {Object} item - 衣物数据对象，用于编辑时初始化表单
 * @props {Boolean} readOnly - 是否为只读模式，只读时显示详情
 * @emits {void} close - 关闭模态框时触发
 * @emits {void} saved - 保存衣物信息成功时触发
 */
import { ref, computed, watch, onMounted, onUnmounted, shallowRef } from 'vue';
import { useClothingStore } from '@/stores';
import { useEnumsStore } from '@/stores';
import { showToast } from '../../utils/toast';
import ImageUpload from './ClothingItemEditor/ImageUpload.vue';
import SeasonSelector from './ClothingItemEditor/SeasonSelector.vue';
import BasicInfoForm from './ClothingItemEditor/BasicInfoForm.vue';
import FavoriteToggle from './ClothingItemEditor/FavoriteToggle.vue';

// 1. 类型定义（新增，提升代码规范）
/**
 * @typedef {Object} ClothingForm
 * @property {string} id - 衣物ID
 * @property {string} name - 衣物名称
 * @property {string} brand - 品牌
 * @property {number|null} price - 价格
 * @property {string|null} purchaseDate - 购买日期
 * @property {string} size - 尺寸
 * @property {string} condition - 新旧程度
 * @property {string} pattern - 图案
 * @property {string|number} category - 分类ID
 * @property {string} categoryName - 分类名称
 * @property {string} color - 颜色
 * @property {string} style - 风格
 * @property {string[]} seasons - 适用季节
 * @property {string} material - 材质
 * @property {boolean} favorite - 是否收藏
 * @property {string} image - 图片URL
 * @property {string} notes - 备注
 */

// 2. Props & Emits 定义（精简）
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    default: null,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'saved']);

// 3. Store 实例（使用shallowRef优化性能）
const clothingStore = shallowRef(useClothingStore());
const enumsStore = shallowRef(useEnumsStore());

// 4. 响应式数据（精简冗余）
const categories = computed(() => enumsStore.value.categoryLabels || []);
const loading = ref(false); // 新增：保存加载状态
const formError = ref(''); // 新增：精细化错误提示
const formSubmitted = ref(false);

// 5. 表单初始化（提取默认值，避免重复）
const DEFAULT_FORM = {
  id: '',
  name: '',
  brand: '',
  price: null,
  purchaseDate: null,
  size: '',
  condition: '',
  pattern: '',
  category: '',
  categoryName: '',
  color: '',
  style: '',
  seasons: [],
  material: '',
  favorite: false,
  image: '',
  notes: '',
};

const form = ref({ ...DEFAULT_FORM });

// 6. 表单验证（精简逻辑）
const isFormValid = computed(() => {
  const { name, category } = form.value;
  return !!name.trim() && !!category;
});

// 7. 事件处理（精简，职责单一）
// 图片更新由v-model自动处理，不再需要单独的updateImage方法

const updateSeasons = (newSeasons) => {
  form.value.seasons = newSeasons;
};

const updateFavorite = (newFavorite) => {
  form.value.favorite = newFavorite;
};

// 更新分类名称（提取为独立函数，避免重复）
const updateCategoryName = () => {
  const { category } = form.value;
  if (!category) {
    form.value.categoryName = '';
    return;
  }
  
  const matchedCategory = categories.value.find(c => c.id === category);
  form.value.categoryName = matchedCategory?.name || '';
};

// 8. 表单重置（精简）
const resetForm = () => {
  form.value = { ...DEFAULT_FORM };
  formError.value = '';
  formSubmitted.value = false;
};

// 9. 数据适配（提取为独立函数，精简watch逻辑）
const adaptItemToForm = (item) => {
  if (!item) return { ...DEFAULT_FORM };

  // 浅拷贝（避免深拷贝性能损耗）
  const adapted = { ...DEFAULT_FORM, ...item };

  // 1. 分类字段兼容（精简逻辑）
  if (!adapted.category && adapted.categoryId) {
    adapted.category = adapted.categoryId;
    delete adapted.categoryId;
  }
  
  // 2. 分类名称自动匹配
  if (adapted.category && !adapted.categoryName) {
    const matched = categories.value.find(c => c.id === adapted.category);
    adapted.categoryName = matched?.name || '';
  } else if (!adapted.category && adapted.categoryName) {
    const matched = categories.value.find(c => c.name === adapted.categoryName);
    adapted.category = matched?.id || '';
  }

  // 3. 季节字段兼容（精简）
  // if (item.season && typeof item.season === 'number' && !adapted.seasons?.length) {
  //   const seasonName = enumsStore.value.getSeasonLabel(item.season);
  //   adapted.seasons = seasonName ? [seasonName] : [];
  // }
  
  // 4. 确保季节是数组
  adapted.seasons = Array.isArray(adapted.seasons) ? adapted.seasons : [];

  return adapted;
};

// 10. 监听item变化（精简，减少深层监听）
watch(
  () => props.item,
  (newItem) => {
    form.value = adaptItemToForm(newItem);
  },
  { immediate: true }
);

// 11. 更新衣物信息逻辑
const saveItem = async () => {
  console.log('form.value!!!:', form.value);
  formSubmitted.value = true;
  formError.value = '';

  // 1. 基础验证
  if (!isFormValid.value) {
    formError.value = '请填写必填项：衣物名称和分类';
    showToast(formError.value, 'error');
    return;
  }

  // 2. 图片URL验证（修复逻辑漏洞，精简）
  const validateImageUrl = (url) => {
    if (!url || url.trim() === '' || url.startsWith('data:')) {
      return 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
    }
    
    // 长度限制（后端255，留余量）
    if (url.length > 200) {
      return 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
    }
    
    // 简单URL格式验证
    const urlRegex = /^(https?:\/\/|\/).+/;
    return urlRegex.test(url) ? url : 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
  };

  try {
    loading.value = true;
    const validImageUrl = validateImageUrl(form.value.image);

    // 3. 构造提交数据（精简，避免冗余）
    const submitData = {
      ...form.value,
      mainImageUrl: validImageUrl,
      season: form.value.seasons.length ? enumsStore.value.seasonOptions.find(s => s.label === form.value.seasons[0])?.value : undefined,
      // 数字类型转换（精简）
      size: form.value.size ? Number(form.value.size) : undefined,
      condition: form.value.condition ? Number(form.value.condition) : undefined,
      category: form.value.category ? Number(form.value.category) : undefined,
      color: form.value.color ? Number(form.value.color) : undefined,
      style: form.value.style ? Number(form.value.style) : undefined,
      material: form.value.material ? Number(form.value.material) : undefined,
    };

    // 移除无用字段
    delete submitData.metadata;
    delete submitData.categoryName;

    // 4. 提交数据
    if (form.value.id) {
      await clothingStore.value.updateClothingItem(form.value.id, submitData);
      showToast('衣物信息已更新', 'success');
    } else {
      await clothingStore.value.addClothingItem(submitData);
      showToast('新衣物已添加', 'success');
    }

    emit('saved');
    emit('close');
  } catch (error) {
    console.error('保存衣物失败:', error);
    const errorMsg = error.response?.data?.error?.details || '保存失败，请重试';
    formError.value = errorMsg;
    showToast(errorMsg, 'error');
  } finally {
    loading.value = false;
  }
};

// 12. 键盘事件（防抖，修复重复触发）
let escapeKeyTimeout = null;
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    clearTimeout(escapeKeyTimeout);
    escapeKeyTimeout = setTimeout(() => {
      emit('close');
    }, 100); // 防抖，避免快速连续触发
  }
};

// 13. 生命周期
onMounted(async () => {
  if (!props.readOnly && categories.value.length === 0) {
    try {
      await enumsStore.value.fetchAllEnums();
    } catch (error) {
      console.error('获取枚举数据失败:', error);
      formError.value = '分类数据加载失败，请刷新页面';
    }
  }
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  clearTimeout(escapeKeyTimeout); // 清理定时器
});

// 14. 辅助函数（精简）
const closeOnBackdrop = () => {
  if (!loading.value) { // 保存中不允许关闭
    emit('close');
  }
};
</script>

<style scoped>
/* 动画优化（保留核心） */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

/* 滚动条优化（保留） */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 聚焦样式（精简，避免重复） */
:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* 按钮效果（保留核心，移除冗余） */
button {
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

button:hover::before {
  left: 100%;
}

/* 加载动画（新增） */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>