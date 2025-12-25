<template>
  <div class="bg-white rounded-2xl shadow-medium p-6 md:p-8 max-w-4xl mx-auto">
    <div class="mb-8 text-center">
      <h3 class="text-2xl font-bold mb-2 text-neutral-800">添加新衣物</h3>
      <p class="text-neutral-500 max-w-md mx-auto">
        上传衣物照片并填写详细信息，帮助系统更好地为你推荐搭配
      </p>
    </div>

    <!-- 图片上传区域 -->
    <div class="mb-10">
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-neutral-700">
          衣物照片
          <span class="text-red-500">*</span>
        </label>
        <span class="text-xs text-neutral-500">支持 JPG、PNG 格式，最大 5MB</span>
      </div>

      <!-- 上传/预览区域 -->
      <div
        class="border-2 rounded-xl overflow-hidden transition-colors cursor-pointer bg-neutral-50 relative"
        :class="{
          'border-solid border-neutral-300': hasImage && !isDragging,
          'border-dashed border-neutral-200 hover:border-primary': !hasImage && !isDragging,
          'border-primary bg-primary/5': isDragging,
        }"
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- 图片预览 -->
        <div v-if="hasImage" class="relative h-64 flex items-center justify-center bg-neutral-100">
          <img
            :src="clothingItem.image"
            alt="衣物预览"
            class="max-h-full max-w-full object-contain cursor-zoom-in"
            @click="openImagePreview(clothingItem.image)"
          />
          <div
            class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div class="text-center p-4 bg-white/90 backdrop-blur rounded-lg shadow-lg">
              <font-awesome-icon
                :icon="['fas', 'cloud-upload-alt']"
                class="text-primary text-2xl mb-2"
              />
              <p class="font-medium text-neutral-700 mb-2">重新上传图片</p>
              <p class="text-sm text-neutral-500">点击或拖放新图片到此处</p>
            </div>
          </div>
        </div>

        <!-- 上传区域 -->
        <div v-else class="p-8 text-center">
          <div
            class="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4"
          >
            <font-awesome-icon :icon="['fas', 'cloud-upload']" class="text-primary text-2xl" />
          </div>
          <h4 class="font-medium mb-1 text-neutral-700">点击上传或拖放图片</h4>
          <p class="text-sm text-neutral-500 mb-4">建议尺寸 500×500</p>
          <button
            class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            选择文件
          </button>
        </div>

        <!-- 隐藏的文件输入 -->
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept="image/jpeg,image/jpg,image/png"
          @change="handleFileChange"
        />
      </div>
    </div>

    <!-- 表单字段 -->
    <div class="space-y-8">
      <!-- 基本信息区域 -->
      <div class="bg-neutral-50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2 text-primary" />
          基本信息
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              衣物名称
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="clothingItem.name"
              placeholder="例如：黑色修身牛仔裤"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              @blur="validateField('name')"
            />
            <p v-if="validationErrors.name" class="mt-1 text-xs text-red-500">{{ validationErrors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              衣物类别
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="clothingItem.category"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
              @blur="validateField('category')"
            >
              <option value="" disabled v-if="enumsStore.loading">加载中...</option>
              <option value="" v-else>请选择类别</option>
              <option
                v-for="category in categoryOptions"
                :key="category.value"
                :value="category.value"
              >
                {{ category.label }}
              </option>
              <option value="" disabled v-if="!enumsStore.loading && categoryOptions.length === 0">
                暂无类别数据
              </option>
            </select>
            <p v-if="validationErrors.category" class="mt-1 text-xs text-red-500">{{ validationErrors.category }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">风格</label>
            <select
              v-model="clothingItem.style"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="" disabled v-if="enumsStore.loading">加载中...</option>
              <option value="" v-else>请选择风格</option>
              <option
                v-for="style in styleOptions"
                :key="style.value"
                :value="style.value"
              >
                {{ style.label }}
              </option>
              <option value="" disabled v-if="!enumsStore.loading && styleOptions.length === 0">
                暂无风格数据
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">品牌（可选）</label>
            <input
              type="text"
              v-model="clothingItem.brand"
              placeholder="例如：优衣库"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <!-- 属性信息区域 -->
      <div class="bg-neutral-50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <font-awesome-icon :icon="['fas', 'palette']" class="mr-2 text-primary" />
          属性信息
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">颜色</label>
            <select
              v-model="clothingItem.color"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="" disabled v-if="enumsStore.loading">加载中...</option>
              <option value="" v-else>请选择颜色</option>
              <option
                v-for="color in colorOptions"
                :key="color.value"
                :value="color.value"
              >
                {{ color.label }}
              </option>
              <option value="" disabled v-if="!enumsStore.loading && colorOptions.length === 0">
                暂无颜色数据
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">材质</label>
            <select
              v-model="clothingItem.material"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="" disabled v-if="enumsStore.loading">加载中...</option>
              <option value="" v-else>请选择材质</option>
              <option
                v-for="material in materialOptions"
                :key="material.value"
                :value="material.value"
              >
                {{ material.label }}
              </option>
              <option value="" disabled v-if="!enumsStore.loading && materialOptions.length === 0">
                暂无材质数据
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">尺寸</label>
            <select
              v-model="clothingItem.size"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="" disabled v-if="enumsStore.loading">加载中...</option>
              <option value="" v-else>请选择尺寸</option>
              <option
                v-for="size in sizeOptions"
                :key="size.value"
                :value="size.value"
              >
                {{ size.label }}
              </option>
              <option value="" disabled v-if="!enumsStore.loading && sizeOptions.length === 0">
                暂无尺寸数据
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">新旧程度</label>
            <select
              v-model="clothingItem.condition"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="" disabled v-if="enumsStore.loading">加载中...</option>
              <option value="" v-else>请选择新旧程度</option>
              <option
                v-for="condition in conditionOptions"
                :key="condition.value"
                :value="condition.value"
              >
                {{ condition.label }}
              </option>
              <option value="" disabled v-if="!enumsStore.loading && conditionOptions.length === 0">
                暂无新旧程度数据
              </option>
            </select>
          </div>

          <!-- 季节选择区域 -->
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              适用季节
              <span class="text-red-500">*</span>
            </label>
            <SeasonMultiSelect v-model="selectedSeasons" :options="seasonOptions" />
            <p v-if="validationErrors.seasons" class="mt-1 text-xs text-red-500">{{ validationErrors.seasons }}</p>
          </div>
        </div>
      </div>

      <!-- 购买信息区域 -->
      <div class="bg-neutral-50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <font-awesome-icon :icon="['fas', 'shopping-bag']" class="mr-2 text-primary" />
          购买信息
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">价格（元）</label>
            <input
              type="number"
              v-model="clothingItem.price"
              placeholder="例如：299"
              min="0"
              step="0.01"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              @blur="validateField('price')"
            />
            <p v-if="validationErrors.price" class="mt-1 text-xs text-red-500">{{ validationErrors.price }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">购买日期</label>
            <input
              type="date"
              v-model="clothingItem.purchaseDate"
              :max="new Date().toISOString().split('T')[0]"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              @blur="validateField('purchaseDate')"
            />
            <p v-if="validationErrors.purchaseDate" class="mt-1 text-xs text-red-500">{{ validationErrors.purchaseDate }}</p>
          </div>
        </div>
      </div>

      <!-- 备注信息区域 -->
      <div class="bg-neutral-50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <font-awesome-icon :icon="['fas', 'sticky-note']" class="mr-2 text-primary" />
          备注信息
        </h4>
        <textarea
          v-model="clothingItem.notes"
          rows="4"
          placeholder="记录这件衣物的特殊信息，如：购买渠道、搭配建议、注意事项等..."
          class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none bg-white"
        ></textarea>
      </div>
    </div>

    <div class="flex justify-end space-x-4 pt-4 border-t border-neutral-100">
      <button
        @click="handleCancel"
        class="px-6 py-3 border border-neutral-200 rounded-xl text-neutral-700 font-medium hover:bg-neutral-50 transition-colors min-w-[120px]"
      >
        取消
      </button>
      <button
        @click="saveClothes"
        :disabled="isSaving"
        class="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-soft min-w-[120px] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />
        {{ isSaving ? '保存中...' : '保存衣物' }}
      </button>
    </div>
  </div>

  <!-- 图片预览弹窗 -->
  <teleport to="body">
    <div v-if="showImagePreview" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click="showImagePreview = false">
      <img :src="previewImageUrl" alt="大图预览" class="max-h-[90vh] max-w-[90vw] object-contain" />
    </div>
  </teleport>
</template>

<script setup>
import { reactive, ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { useClothingStore } from '@/stores';
import { useEnumsStore } from '@/stores/modules/enumsStore';
import  clothingApi  from '@/services/api/clothingApi';
import { showToast } from '../../utils/toast';
import SeasonMultiSelect from './SeasonMultiSelect.vue';

// 1. 常量定义（统一管理硬编码）
const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPT_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  PLACEHOLDER_URL: 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image'
};
const ROUTES = {
  HOME: '/'
};

// 2. Store 初始化
const clothingStore = useClothingStore();
const enumsStore = useEnumsStore();

// 3. 枚举数据加载 + 状态判断
onMounted(async () => {
  await enumsStore.fetchAllEnums();
});

// 4. 封装通用枚举获取函数（减少冗余）
const getEnumOptions = (type) => {
  return computed(() => enumsStore.getOptions(type));
};
const categoryOptions = getEnumOptions('categories');
const styleOptions = getEnumOptions('styles');
const seasonOptions = getEnumOptions('seasons');
const materialOptions = getEnumOptions('materials');
const colorOptions = getEnumOptions('colors');
const sizeOptions = getEnumOptions('sizes');
const conditionOptions = getEnumOptions('conditions');

// 5. 表单数据 + 响应式优化
const clothingItem = reactive({
  name: '',
  category: '',
  style: '',
  color: '',
  material: '',
  size: '',
  condition: '',
  brand: '',
  price: null,
  purchaseDate: '',
  notes: '',
  image: '',
});
const selectedSeasons = ref([]);
const hasImage = computed(() => {
  const image = clothingItem.image;
  return image && typeof image === 'string' && image.trim() !== '';
});

// 6. 图片处理相关响应式
const fileInput = ref(null);
const isDragging = ref(false);
const imageObjectURLs = ref([]); // 存储生成的ObjectURL，用于卸载时释放
const showImagePreview = ref(false);
const previewImageUrl = ref('');
const selectedFile = ref(null); // 存储用户选择的原始图片文件

// 7. 状态管理
const isSaving = ref(false);

// 8. 工具方法
// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理文件选择
const handleFileChange = event => {
  const file = event.target.files[0];
  if (file) {
    processImageFile(file);
    // 清空input值，避免重复选择同一文件不触发change事件
    event.target.value = '';
  }
};

// 处理拖拽悬停
const handleDragOver = () => {
  isDragging.value = true;
};

// 处理拖拽离开
const handleDragLeave = () => {
  isDragging.value = false;
};

// 处理文件拖放
const handleDrop = event => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    processImageFile(file);
  } else {
    showToast('请上传图片文件', 'error');
  }
};

// 处理图片文件（优化：使用ObjectURL替代FileReader，支持内存释放）
const processImageFile = file => {
  // 验证文件类型
  if (!IMAGE_CONFIG.ACCEPT_TYPES.includes(file.type)) {
    showToast(`请上传${IMAGE_CONFIG.ACCEPT_TYPES.map(type => type.split('/')[1]).join('/')}格式的图片`, 'error');
    return;
  }

  // 验证文件大小
  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    showToast(`图片大小不能超过${IMAGE_CONFIG.MAX_SIZE / 1024 / 1024}MB`, 'error');
    return;
  }

  try {
    // 释放旧的URL
    if (clothingItem.image && imageObjectURLs.value.includes(clothingItem.image)) {
      URL.revokeObjectURL(clothingItem.image);
    }
    // 保存原始文件
    selectedFile.value = file;
    // 生成新的ObjectURL用于预览
    const imageUrl = URL.createObjectURL(file);
    clothingItem.image = imageUrl;
    imageObjectURLs.value.push(imageUrl);
    showToast('图片已选择', 'success');
  } catch (error) {
    showToast('图片处理失败，请重试', 'error');
    console.error('图片处理错误:', error);
  }
};

// 图片预览放大
const openImagePreview = (url) => {
  previewImageUrl.value = url;
  showImagePreview.value = true;
};

// 表单重置（含内存释放）
const resetForm = () => {
  // 释放图片URL
  if (clothingItem.image && imageObjectURLs.value.includes(clothingItem.image)) {
    URL.revokeObjectURL(clothingItem.image);
  }
  // 清空表单数据
  Object.assign(clothingItem, {
    name: '',
    category: '',
    style: '',
    color: '',
    material: '',
    size: '',
    condition: '',
    brand: '',
    price: null,
    purchaseDate: '',
    notes: '',
    image: '',
  });
  selectedSeasons.value = [];
  imageObjectURLs.value = [];
};

// 验证错误信息缓存
const validationErrors = ref({
  name: '',
  category: '',
  seasons: '',
  price: '',
  purchaseDate: ''
});

// 单个字段校验（实时提示）
const validateField = (field) => {
  let error = '';
  switch (field) {
    case 'name':
      error = clothingItem.name.trim() ? '' : '衣物名称不能为空';
      break;
    case 'category':
      error = clothingItem.category ? '' : '衣物类别不能为空';
      break;
    case 'seasons':
      error = selectedSeasons.value.length > 0 ? '' : '请选择至少一个适用季节';
      break;
    case 'price':
      error = clothingItem.price === null || !isNaN(Number(clothingItem.price)) ? '' : '价格必须是有效数字';
      break;
    case 'purchaseDate':
      error = !clothingItem.purchaseDate || new Date(clothingItem.purchaseDate) <= new Date() ? '' : '购买日期不能晚于今天';
      break;
    default:
      error = '';
  }
  validationErrors.value[field] = error;
  return error;
};

// 监听表单字段变化，自动更新验证
watch(
  [() => clothingItem.name, () => clothingItem.category, () => clothingItem.price, () => clothingItem.purchaseDate],
  ([name, category, price, purchaseDate]) => {
    validateField('name');
    validateField('category');
    validateField('price');
    validateField('purchaseDate');
  },
  { deep: true }
);

// 监听季节变化，自动更新验证
watch(
  () => selectedSeasons.value,
  () => {
    validateField('seasons');
  },
  { deep: true }
);

// 统一表单校验
const validateForm = () => {
  const errors = [];
  if (!clothingItem.name.trim()) errors.push('衣物名称不能为空');
  if (!clothingItem.category) errors.push('衣物类别不能为空');
  if (selectedSeasons.value.length === 0) errors.push('请选择至少一个适用季节');
  if (clothingItem.price !== null && isNaN(Number(clothingItem.price))) {
    errors.push('价格必须是有效数字');
  }
  if (clothingItem.purchaseDate && new Date(clothingItem.purchaseDate) > new Date()) {
    errors.push('购买日期不能晚于今天');
  }
  return errors;
};

// 取消按钮处理（含确认提示）
const handleCancel = () => {
  // 判断表单是否有未保存内容
  const hasFormData = Object.values(clothingItem).some(val => 
    val !== '' && val !== null && val !== undefined
  ) || selectedSeasons.value.length > 0;

  if (hasFormData) {
    if (confirm('你输入的内容尚未保存，确定要取消吗？')) {
      resetForm();
      window.location.href = ROUTES.HOME;
    }
  } else {
    resetForm();
    window.location.href = ROUTES.HOME;
  }
};

// 保存衣物（含重试逻辑）
const saveClothes = async () => {
  if (isSaving.value) return;
  isSaving.value = true;

  // 统一表单校验
  const errors = validateForm();
  if (errors.length > 0) {
    showToast(errors.join('；'), 'error');
    isSaving.value = false;
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    let validatedMainImageUrl = null;

    // 上传图片到服务器
    if (selectedFile.value) {
      showToast('正在上传图片...', 'info');
      const formData = new FormData();
      formData.append('image', selectedFile.value);
      
      try {
          const uploadResponse = await clothingApi.uploadImage(formData);
          if (uploadResponse && uploadResponse.data && uploadResponse.data.imageUrl) {
            validatedMainImageUrl = uploadResponse.data.imageUrl;
            // showToast('图片上传成功', 'success');
          } else {
            throw new Error('图片上传失败，未获取到图片URL');
          }
      } catch (uploadError) {
        console.error('图片上传失败:', uploadError);
        showToast('图片上传失败，将使用占位符图片', 'warning');
        validatedMainImageUrl = IMAGE_CONFIG.PLACEHOLDER_URL;
      }
    } else {
      validatedMainImageUrl = IMAGE_CONFIG.PLACEHOLDER_URL;
    }

    const seasonIds = [...selectedSeasons.value] || [];
    const itemToSubmit = {
      name: clothingItem.name,
      category: clothingItem.category,
      color: clothingItem.color || null,
      style: clothingItem.style || null,
      condition: clothingItem.condition || null,
      brand: clothingItem.brand,
      notes: clothingItem.notes,
      imageUrls: validatedMainImageUrl ? [validatedMainImageUrl] : [],
      mainImageUrl: validatedMainImageUrl,
      purchaseDate: clothingItem.purchaseDate || today,
      favorite: false,
      season: seasonIds,
      seasons: seasonIds,
      material: clothingItem.material || null,
      size: clothingItem.size || null,
      price: clothingItem.price ? parseFloat(clothingItem.price) : null,
    };

    // 重试逻辑（最多2次）
    let retryCount = 0;
    const maxRetries = 2;
    let submitSuccess = false;

    while (retryCount <= maxRetries && !submitSuccess) {
      try {
        await clothingStore.addClothingItem(itemToSubmit);
        submitSuccess = true;
      } catch (error) {
        retryCount++;
        if (retryCount > maxRetries) {
          throw error;
        }
        showToast(`提交失败，正在重试（${retryCount}/${maxRetries}）`, 'warning');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    showToast('衣物添加成功', 'success');
    await nextTick();
    
    // 重置表单
    // resetForm();
  } catch (error) {
    showToast('添加失败，请稍后重试', 'error');
    console.error('添加衣物失败:', error);
  } finally {
    isSaving.value = false;
  }
};

// 组件卸载时清理资源
onUnmounted(() => {
  // 释放所有生成的ObjectURL
  imageObjectURLs.value.forEach(url => {
    URL.revokeObjectURL(url);
  });
  imageObjectURLs.value = [];
});
</script>