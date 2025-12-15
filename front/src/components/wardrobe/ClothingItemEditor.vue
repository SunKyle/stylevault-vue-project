<template>
  <!-- 衣物编辑模态框组件 -->
  <!-- 用于创建和编辑衣物信息的弹出式表单，支持查看详情模式 -->
  <!-- 包含图片上传、基本信息填写、季节选择和收藏功能 -->
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeOnBackdrop"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- 头部 -->
        <div
          :class="[
            readOnly
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
              : 'bg-gradient-to-r from-blue-400 to-cyan-400',
            'p-6 text-white relative overflow-hidden z-10 flex-shrink-0',
          ]"
        >
          <!-- 装饰元素 -->
          <div
            class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"
          ></div>
          <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>

          <!-- 头部内容 -->
          <div class="relative z-10">
            <div class="flex justify-between items-start">
              <!-- 左侧标题区域 -->
              <div class="flex items-start">
                <!-- 图标 -->
                <div
                  class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4 shadow-sm"
                >
                  <font-awesome-icon
                    :icon="readOnly ? ['fas', 'info'] : ['fas', 'edit']"
                    class="text-white text-lg"
                  />
                </div>

                <!-- 文字内容 -->
                <div>
                  <h2 class="text-2xl font-bold tracking-wide mb-1">
                    {{ readOnly ? '衣物详情' : '编辑衣物' }}
                  </h2>
                  <p class="text-white/80 text-sm max-w-xs">完善您的衣物信息，打造个性衣橱</p>
                </div>
              </div>

              <!-- 右侧关闭按钮 -->
              <button
                @click="$emit('close')"
                class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-sm ml-2"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-white text-sm" />
              </button>
            </div>
          </div>

          <!-- 底部装饰线 -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          ></div>
        </div>

        <!-- 表单内容 -->
        <div class="flex-1 overflow-y-auto p-6 bg-white">
          <!-- 图片上传区域 -->
          <div class="mb-6">
            <ImageUpload 
              v-model:image="form.image" 
              :read-only="readOnly"
              @update:image="updateImage"
            />
          </div>

          <!-- 基本信息 -->
          <div class="mb-6">
            <BasicInfoForm 
              v-model="form" 
              :read-only="readOnly"
              :categories="categories"
            />
          </div>

          <!-- 季节选择 -->
          <div class="mb-6">
            <SeasonSelector 
              v-model:seasons="form.seasons" 
              :read-only="readOnly"
              @update:seasons="updateSeasons"
            />
          </div>

          <!-- 收藏 -->
          <div class="mb-8">
            <FavoriteToggle 
              v-model:favorite="form.favorite" 
              :read-only="readOnly"
              @update:favorite="updateFavorite"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="!isFormValid && formSubmitted" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />请填写必填项：衣物名称和分类
          </div>

          <!-- 操作按钮 -->
          <div
            class="flex justify-end space-x-4 mt-8 pt-5 border-t border-gray-200 bg-white/80 backdrop-blur-sm rounded-b-xl -mx-6 -mb-6 px-6 pb-6"
          >
            <button
              @click="$emit('close')"
              class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="mr-2" />
              {{ readOnly ? '关闭' : '取消' }}
            </button>
            <button
              v-if="!readOnly"
              @click="saveItem"
              :disabled="!isFormValid"
              class="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center disabled:hover:shadow-none"
            >
              <font-awesome-icon :icon="['fas', 'save']" class="mr-2" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
  /**
   * 衣物编辑模态框组件
   * 
   * 用于创建和编辑衣物信息的弹出式表单，支持查看详情模式。
   * 包含图片上传、基本信息填写、季节选择和收藏功能。
   * 
   * @component
   * @props {Boolean} isOpen - 控制模态框显示/隐藏
   * @props {Object} item - 衣物数据对象，用于编辑时初始化表单
   * @props {Boolean} readOnly - 是否为只读模式，只读时显示详情
   * @emits {void} close - 关闭模态框时触发
   * @emits {void} saved - 保存衣物信息成功时触发
   */
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import { useClothingStore } from '@/stores';
  import { useEnumsStore } from '@/stores';
  import { showToast } from '../../utils/toast';
  import ImageUpload from './ClothingItemEditor/ImageUpload.vue';
  import SeasonSelector from './ClothingItemEditor/SeasonSelector.vue';
  import BasicInfoForm from './ClothingItemEditor/BasicInfoForm.vue';
  import FavoriteToggle from './ClothingItemEditor/FavoriteToggle.vue';

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

  const clothingStore = useClothingStore();
  const enumsStore = useEnumsStore();

  // 分类数据
  const categories = computed(() => enumsStore.categoryLabels || []);

  // 在组件挂载时获取枚举数据并添加键盘事件监听器
  onMounted(async () => {
    // 获取枚举数据
    try {
      console.log('组件挂载，开始获取枚举数据...');
      await enumsStore.fetchAllEnums();
      console.log('枚举数据加载完成，当前分类数据:', categories.value);
    } catch (error) {
      console.error('获取枚举数据失败:', error);
    }
    
    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyDown);
  });

  // 监听分类数据变化
  watch(
    categories,
    newCategories => {
      console.log('分类数据已更新:', newCategories);
    },
    { deep: true }
  );

  // 表单提交状态
  const formSubmitted = ref(false);

  // 表单数据
  const form = ref({
    id: '',
    name: '',
    brand: '',
    price: null,
    purchaseDate: '',
    size: '',
    condition: '',
    pattern: '',
    category: '', // 使用category字段（关联attributes表）
    categoryName: '',
    color: '',
    style: '',
    seasons: [], // 确保初始化为数组
    material: '',
    favorite: false,
    image: '',
    notes: '',
  });

  // 子组件事件处理函数
  const updateImage = (newImage) => {
    form.value.image = newImage;
  };

  const updateForm = (newForm) => {
    form.value = { ...form.value, ...newForm };
  };

  const updateSeasons = (newSeasons) => {
    form.value.seasons = newSeasons;
  };

  const updateFavorite = (newFavorite) => {
    form.value.favorite = newFavorite;
  };

  // 表单验证
  const isFormValid = computed(() => {
    return form.value.name.trim() !== '' && form.value.category !== '';
  });

  // 监听props.item变化，更新表单
  watch(
    () => props.item,
    newItem => {
      if (newItem) {
        // 深拷贝避免直接修改原始对象
        const itemCopy = { ...newItem };

        // 确保所有字段都有正确的默认值
    itemCopy.price = newItem.price ?? null;
    itemCopy.purchaseDate = newItem.purchaseDate ?? null;
    itemCopy.size = newItem.size ?? '';
    itemCopy.condition = newItem.condition ?? '';
    itemCopy.pattern = newItem.pattern ?? '';
    itemCopy.color = newItem.color ?? '';
    itemCopy.style = newItem.style ?? '';
    itemCopy.material = newItem.material ?? '';
    itemCopy.notes = newItem.notes ?? '';

        // 确保分类信息正确传递
        // 如果item中有categoryName但没有category，尝试匹配
        if (!itemCopy.category && itemCopy.categoryName) {
          const matchedCategory = categories.value.find(c => c.name === itemCopy.categoryName);
          if (matchedCategory) {
            itemCopy.category = matchedCategory.id;
          }
        }

        // 如果item中有category但没有categoryName，尝试设置categoryName
        if (itemCopy.category && !itemCopy.categoryName) {
          const matchedCategory = categories.value.find(c => c.id === itemCopy.category);
          if (matchedCategory) {
            itemCopy.categoryName = matchedCategory.name;
          }
        }

        // 兼容旧数据中的category字段
        if (!itemCopy.category && itemCopy.categoryId) {
          // 如果有categoryId字段但没有category，使用categoryId
          itemCopy.category = itemCopy.categoryId;
          delete itemCopy.categoryId;
          const matchedCategory = categories.value.find(c => c.id === itemCopy.category);
          if (matchedCategory) {
            itemCopy.categoryName = matchedCategory.name;
          }
        }

        // 处理季节数据 - 从ID转换为名称
        if (itemCopy.season && typeof itemCopy.season === 'number') {
          const seasonName = enumsStore.getSeasonLabel(itemCopy.season);
          if (seasonName && !itemCopy.seasons) {
            itemCopy.seasons = [seasonName];
          }
        }

        // 确保季节数据是数组
        if (!itemCopy.seasons || !Array.isArray(itemCopy.seasons)) {
          // 如果没有季节数据或不是数组，初始化为空数组
          itemCopy.seasons = [];
        }

        form.value = itemCopy;
      } else {
        // 重置表单
        resetForm();
      }
    },
    { immediate: true, deep: true }
  );

  // 重置表单
  function resetForm() {
    form.value = {
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
      seasons: [], // 确保重置时也是数组
      material: '',
      favorite: false,
      image: '',
      notes: '',
    };
  }



  // 保存衣物前验证
  async function saveItem() {
    // 设置表单提交状态为已提交
    formSubmitted.value = true;
    
    if (!isFormValid.value) {
      showToast('请填写必填项', 'error');
      return;
    }

    // 严格验证图片URL，确保100%通过后端验证
    let validImageUrl = form.value.image || '';

    // 1. 拒绝DataURL格式
    if (validImageUrl.startsWith('data:')) {
      validImageUrl = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
    }

    // 2. 拒绝空值
    if (!validImageUrl || validImageUrl.trim() === '') {
      validImageUrl = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
    }

    // 3. 拒绝超长URL（后端限制255字符）
    if (validImageUrl.length > 200) {
      // 留有余量
      validImageUrl = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
    }

    // 4. 拒绝无效URL格式（简化验证）
    const isValidUrl = /^https?:\/\/.+|^\/.+/.test(validImageUrl);
    if (!isValidUrl) {
      validImageUrl = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
    }

    try {
      // 重置表单提交状态
      formSubmitted.value = false;
      
      // 准备提交数据
      const submitData = {
        ...form.value,
        mainImageUrl: validImageUrl,
      };

      // 将季节名称转换为ID（如果需要）
      if (form.value.seasons && form.value.seasons.length > 0) {
        // 如果是多季节选择，取第一个季节作为主要季节
        const primarySeason = form.value.seasons[0];
        // 查找对应的季节ID
        const season = enumsStore.seasonOptions.find(s => s.label === primarySeason);
        if (season && season.value) {
          submitData.season = season.value;
        }
      }

      // 准备完整的提交数据
      const finalSubmitData = {
        ...submitData,
        // 确保所有字段都以独立字段形式传递
        // 移除可能存在的metadata对象
        metadata: undefined,
        // 确保下拉框字段是数字类型
        size: submitData.size ? Number(submitData.size) : undefined,
        condition: submitData.condition ? Number(submitData.condition) : undefined,
        category: submitData.category ? Number(submitData.category) : undefined,
        color: submitData.color ? Number(submitData.color) : undefined,
        style: submitData.style ? Number(submitData.style) : undefined,
        material: submitData.material ? Number(submitData.material) : undefined,
      };

      if (form.value.id) {
        // 更新现有衣物
        await clothingStore.updateClothingItem(form.value.id, finalSubmitData);
        showToast('衣物信息已更新', 'success');
      } else {
        // 添加新衣物
        await clothingStore.addClothingItem(finalSubmitData);
        showToast('新衣物已添加', 'success');
      }

      // 通知父组件保存成功
      emit('saved');
      // 关闭模态框
      emit('close');
    } catch (error) {
      console.error('保存衣物失败:', error);
      if (error.response?.data?.error?.details) {
        showToast(`保存失败: ${error.response.data.error.details}`, 'error');
      } else {
        showToast('保存失败，请重试', 'error');
      }
    }
  }

  // 点击背景关闭
  function closeOnBackdrop() {
    emit('close');
  }

  // 键盘事件处理
  function handleKeyDown(event) {
    // ESC键关闭模态框
    if (event.key === 'Escape') {
      emit('close');
    }
  }

  // 组件卸载时移除键盘事件监听器
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  // 更新分类名称
  function updateCategoryName() {
    if (form.value.category) {
      const selectedCategory = categories.value.find(c => c.id === form.value.category);
      if (selectedCategory) {
        form.value.categoryName = selectedCategory.name;
      }
    } else {
      form.value.categoryName = '';
    }
  }
</script>

<style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  /* 模态框内容动画 */
  .modal-enter-active .bg-white,
  .modal-leave-active .bg-white {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .modal-enter-from .bg-white,
  .modal-leave-to .bg-white {
    transform: scale(0.95) translateY(-10px);
    opacity: 0;
  }

  /* 自定义滚动条样式优化 */
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

  ::-webkit-scrollbar-corner {
    background: #f5f5f5;
  }

  /* 输入框聚焦效果 */
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  /* 复选框样式 */
  input[type='checkbox'] {
    position: relative;
    cursor: pointer;
  }

  input[type='checkbox']:before {
    content: '';
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    background-color: white;
    border-radius: 3px;
    border: 1px solid #d1d5db;
  }

  input[type='checkbox']:checked:before {
    content: '';
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    background-color: currentColor;
    border-radius: 3px;
  }

  input[type='checkbox']:checked:after {
    content: '';
    display: block;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    position: absolute;
    top: 2px;
    left: 6px;
    transform: rotate(45deg);
  }

  /* 按钮悬停效果 */
  button {
    position: relative;
    overflow: hidden;
  }

  button:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  button:hover:before {
    left: 100%;
  }
</style>

