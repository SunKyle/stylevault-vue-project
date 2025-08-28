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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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
          <option value="1">上装</option>
          <option value="2">下装</option>
          <option value="3">外套</option>
          <option value="4">鞋履</option>
          <option value="5">配饰</option>
          <option value="6">包包</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">风格</label>
        <select
          v-model="clothingItem.style"
          class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all appearance-none bg-white"
        >
          <option value="">请选择风格</option>
          <option value="休闲">休闲</option>
          <option value="正式">正式</option>
          <option value="运动">运动</option>
          <option value="复古">复古</option>
          <option value="潮流">潮流</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-neutral-700 mb-2">
          适用季节
          <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label
            v-for="seasonOption in seasonOptions"
            :key="seasonOption.value"
            class="flex flex-col items-center justify-center p-3 border border-neutral-200 rounded-lg hover:border-primary transition-colors cursor-pointer group"
            :class="{
              'border-primary bg-primary/5': clothingItem.seasons.includes(seasonOption.value),
            }"
          >
            <input
              type="checkbox"
              :value="seasonOption.value"
              v-model="clothingItem.seasons"
              class="sr-only rounded text-primary focus:ring-primary"
            />
            <div
              class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors"
            >
              <font-awesome-icon :icon="getSeasonIcon(seasonOption.value)" class="text-primary" />
            </div>
            <span class="text-sm font-medium">{{ seasonOption.label }}</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">颜色</label>
        <input
          type="text"
          v-model="clothingItem.color"
          placeholder="例如：深蓝色"
          class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
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

    <div class="mb-10 md:col-span-2">
      <label class="block text-sm font-medium text-neutral-700 mb-2">备注（可选）</label>
      <textarea
        v-model="clothingItem.notes"
        rows="3"
        placeholder="添加关于这件衣物的更多信息..."
        class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
      ></textarea>
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
  import { reactive, ref, computed, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { useWardrobeStore } from '../../stores/wardrobeStore';
  import { showToast } from '../../utils/toast';

  const router = useRouter();
  const wardrobeStore = useWardrobeStore();

  // 季节选项
  const seasonOptions = [
    { value: '春季', label: '春季' },
    { value: '夏季', label: '夏季' },
    { value: '秋季', label: '秋季' },
    { value: '冬季', label: '冬季' },
  ];

  // 表单数据
  const clothingItem = reactive({
    name: '',
    categoryId: '',
    style: '',
    seasons: [], // 使用数组而不是字符串
    color: '',
    brand: '',
    notes: '',
    image: '', // 图片URL
  });

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
      // 在实际应用中，这里应该上传图片到服务器并获取URL
      // 现在我们使用读取的URL作为图片URL
      clothingItem.image = e.target.result;
      showToast('图片上传成功', 'success');
    };
    reader.readAsDataURL(file);
  };

  // 获取季节图标
  const getSeasonIcon = season => {
    switch (season) {
      case '春季':
        return ['fas', 'seedling'];
      case '夏季':
        return ['fas', 'sun'];
      case '秋季':
        return ['fas', 'leaf'];
      case '冬季':
        return ['fas', 'snowflake'];
      default:
        return ['fas', 'calendar'];
    }
  };

  // 取消按钮处理函数
  const handleCancel = () => {
    console.log('取消按钮被点击');
    // 使用window.location进行页面跳转
    window.location.href = '/';
    console.log('使用window.location跳转已执行');
  };

  const saveClothes = async () => {
    // 防止重复提交
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
    if (!clothingItem.seasons || clothingItem.seasons.length === 0) {
      showToast('请选择至少一个适用季节', 'error');
      isSaving.value = false;
      return;
    }

    try {
      // 根据categoryId设置category名称
      const categoryMap = {
        1: '上装',
        2: '下装',
        3: '外套',
        4: '鞋履',
        5: '配饰',
        6: '包包',
      };

      // 创建要提交的数据对象，包含所有必要字段
      const today = new Date().toISOString().split('T')[0];
      const itemToSubmit = {
        ...clothingItem,
        category: categoryMap[clothingItem.categoryId] || '其他',
        purchaseDate: today, // 设置购买日期为今天
        createdAt: today, // 同时设置createdAt属性，确保能正确显示在最近添加列表中
        favorite: false, // 默认不收藏
      };

      // 调用 store 方法保存衣物
      await wardrobeStore.addClothingItem(itemToSubmit);
      showToast('衣物添加成功', 'success');

      // 刷新衣橱数据，确保新添加的衣物能立即显示
      await wardrobeStore.fetchClothingItems();

      // 使用nextTick确保DOM更新后再清空表单
      await nextTick();

      // 清空表单
      clothingItem.name = '';
      clothingItem.categoryId = '';
      clothingItem.style = '';
      clothingItem.seasons = []; // 重置为空数组
      clothingItem.color = '';
      clothingItem.brand = '';
      clothingItem.notes = '';
      // 重置图片
      clothingItem.image = '';
    } catch (error) {
      showToast('添加失败，请重试', 'error');
      console.error('添加衣物失败:', error);
    } finally {
      // 重置保存状态
      isSaving.value = false;
    }
  };
</script>
