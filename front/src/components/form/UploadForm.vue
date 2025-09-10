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
            class="max-h-full max-w-full object-contain"
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
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              衣物类别
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="clothingItem.categoryId"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="">请选择类别</option>
              <option 
                v-for="category in categoryOptions" 
                :key="category.value" 
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">风格</label>
            <select
              v-model="clothingItem.style"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="">请选择风格</option>
              <option 
                v-for="style in styleOptions" 
                :key="style.value" 
                :value="style.value"
              >
                {{ style.label }}
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
              <option value="">请选择颜色</option>
              <option 
                v-for="color in colorOptions" 
                :key="color.value" 
                :value="color.value"
              >
                {{ color.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">材质</label>
            <select
              v-model="clothingItem.material"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="">请选择材质</option>
              <option 
                v-for="material in materialOptions" 
                :key="material.value" 
                :value="material.value"
              >
                {{ material.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">尺寸</label>
            <select
              v-model="clothingItem.size"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
            >
              <option value="">请选择尺寸</option>
              <option value="XS">XS - 特小号</option>
              <option value="S">S - 小号</option>
              <option value="M">M - 中号</option>
              <option value="L">L - 大号</option>
              <option value="XL">XL - 特大号</option>
              <option value="XXL">XXL - 超大号</option>
              <option value="均码">均码</option>
            </select>
          </div>

          <!-- 季节选择区域 -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              适用季节
              <span class="text-red-500">*</span>
            </label>
            <SeasonMultiSelect 
              v-model="selectedSeasons" 
              :options="seasonOptions" 
            />
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
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">购买日期</label>
            <input
              type="date"
              v-model="clothingItem.purchaseDate"
              :max="new Date().toISOString().split('T')[0]"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
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
        <!-- <p class="text-sm text-neutral-500 mt-2">支持添加关于衣物的额外描述、搭配心得或特殊说明</p> -->
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
        保存衣物
      </button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref, computed, nextTick, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useClothingStore } from '@/stores';
  import { useEnumsStore } from '@/stores/enums';
  import { showToast } from '../../utils/toast';
  import SeasonMultiSelect from '@/components/SeasonMultiSelect.vue';

  const router = useRouter();
  const clothingStore = useClothingStore();
  const enumsStore = useEnumsStore();

  // 加载枚举值
  onMounted(async () => {
    await enumsStore.fetchAllEnums();
  });

  // 计算属性 - 从store获取枚举值
  const categoryOptions = computed(() => enumsStore.categoryOptions);
  const styleOptions = computed(() => enumsStore.styleOptions);
  const seasonOptions = computed(() => enumsStore.seasonOptions);
  const materialOptions = computed(() => enumsStore.materialOptions);
  const colorOptions = computed(() => enumsStore.colorOptions);

  // 表单数据 - 使用独立ref管理季节数组以避免响应式问题
  const clothingItem = reactive({
    name: '',
    categoryId: '',
    style: '',
    color: '',
    material: '',
    size: '',
    brand: '',
    price: null,
    purchaseDate: '',
    notes: '',
    image: '',
  });

  // 独立管理季节数组，避免reactive对象的数组问题
  const selectedSeasons = ref([]);

  // 判断是否有图片
  const hasImage = computed(() => {
    return clothingItem.image && clothingItem.image.trim() !== '';
  });

  // 文件输入引用
  const fileInput = ref(null);
  const isDragging = ref(false);

  // 保存状态
  const isSaving = ref(false);

  // 触发文件选择
  const triggerFileInput = () => {
    fileInput.value.click();
  };

  // 处理文件选择
  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      processImageFile(file);
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

  // 处理图片文件
  const processImageFile = file => {
    // 验证文件类型
    if (!file.type.match('image.*')) {
      showToast('请上传图片文件', 'error');
      return;
    }

    // 验证文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过5MB', 'error');
      return;
    }

    // 创建图片URL
    const reader = new FileReader();
    reader.onload = e => {
      clothingItem.image = e.target.result;
      showToast('图片上传成功', 'success');
    };
    reader.readAsDataURL(file);
  };

  // 取消按钮处理函数
  const handleCancel = () => {
    window.location.href = '/';
  };

  const saveClothes = async () => {
    if (isSaving.value) {
      return;
    }

    isSaving.value = true;
    
    // 验证必填字段
    if (!clothingItem.name || !clothingItem.categoryId) {
      showToast('请填写衣物名称和类别', 'error');
      isSaving.value = false;
      return;
    }

    // 验证季节选择
    if (!selectedSeasons.value || selectedSeasons.value.length === 0) {
      showToast('请选择至少一个适用季节', 'error');
      isSaving.value = false;
      return;
    }

    try {
        const today = new Date().toISOString().split('T')[0];
        
        // 验证并处理mainImageUrl
        let validatedMainImageUrl = clothingItem.image || null;
        
        // 如果是DataURL格式或无效URL，使用占位符
        if (validatedMainImageUrl && (
            validatedMainImageUrl.startsWith('data:') ||
            validatedMainImageUrl.length > 200 ||
            !/^https?:\/\/.+|^\/.+/.test(validatedMainImageUrl)
        )) {
          validatedMainImageUrl = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
          showToast('图片已转换为占位符', 'info');
        }

        const itemToSubmit = {
          name: clothingItem.name,
          categoryId: clothingItem.categoryId,
          colorId: clothingItem.color || null,
          styleId: clothingItem.style || null,
          brand: clothingItem.brand,
          notes: clothingItem.notes,
          imageUrls: validatedMainImageUrl ? [validatedMainImageUrl] : [],
          mainImageUrl: validatedMainImageUrl,
          purchaseDate: clothingItem.purchaseDate || today,
          favorite: false,
          metadata: {
            seasons: [...selectedSeasons.value] || [], // 使用独立季节数组
            material: clothingItem.material || null,
            size: clothingItem.size || null,
            price: clothingItem.price ? parseFloat(clothingItem.price) : null,
          }
        };

      await clothingStore.addClothingItem(itemToSubmit);
      showToast('衣物添加成功', 'success');

      await clothingStore.fetchClothingItems();
      await nextTick();

      // 清空表单
      Object.assign(clothingItem, {
        name: '',
        categoryId: '',
        style: '',
        color: '',
        material: '',
        size: '',
        brand: '',
        price: null,
        purchaseDate: '',
        notes: '',
        image: '',
      });
      selectedSeasons.value = []; // 清空季节选择
      
    } catch (error) {
      showToast('添加失败，请重试', 'error');
      console.error('添加衣物失败:', error);
    } finally {
      isSaving.value = false;
    }
  };
</script>
