<template>
  <!-- OutfitCard 组件 - 展示搭配信息、支持编辑、删除和图片预览 -->
  <div
    class="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-indigo-100/80 flex flex-col transform hover:-translate-y-1.5"
  >
    <!-- 搭配预览 - 优化后的卡片顶部 -->
    <div class="relative overflow-hidden">
      <!-- 卡片顶部渐变背景 -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-white/80 transform transition-transform duration-700 group-hover:scale-110"
      ></div>

      <!-- 装饰元素 - 增强卡片深度感 -->
      <div
        class="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl opacity-70 animate-pulse-slow"
      ></div>
      <div
        class="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-2xl opacity-70 animate-pulse-slow animation-delay-1000"
      ></div>
      <div
        class="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-indigo-400/30 animate-ping"
      ></div>
      <div
        class="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-purple-400/30 animate-ping animation-delay-700"
      ></div>

      <!-- 卡片内容 -->
      <div class="p-5 h-56 flex flex-col relative z-10">
        <!-- 顶部信息区 -->
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4
              class="font-bold text-indigo-900 text-lg truncate pr-2 group-hover:text-indigo-600 transition-colors mb-2"
            >
              {{ outfit.name }}
            </h4>

            <!-- 优化的搭配信息 -->
            <div class="flex flex-wrap gap-2 mt-1">
              <!-- 场景信息 -->
              <div
                v-if="outfit?.scene"
                class="flex items-center px-2 py-1 bg-indigo-50/80 backdrop-blur-sm rounded-lg border border-indigo-100/50 shadow-sm"
              >
                <div
                  class="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center mr-1.5"
                >
                  <font-awesome-icon
                    :icon="['fas', 'map-marker-alt']"
                    class="text-indigo-600 text-xs"
                  />
                </div>
                <span class="text-xs text-indigo-700 font-medium">场景:</span>
                <div class="flex flex-wrap gap-1 ml-1">
                  <template
                    v-for="(sceneValue, index) in outfit?.scene ? outfit.scene.split(',') : []"
                    :key="index"
                  >
                    <span
                      class="text-xs text-indigo-600 font-medium bg-white/80 px-1.5 py-0.5 rounded-full border border-indigo-100/50"
                    >
                      {{ getSceneLabel(sceneValue) || '' }}
                    </span>
                  </template>
                </div>
              </div>

              <!-- 季节信息 -->
              <div
                v-if="outfit?.season"
                class="flex items-center px-2 py-1 bg-green-50/80 backdrop-blur-sm rounded-lg border border-green-100/50 shadow-sm"
              >
                <div
                  class="w-4 h-4 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mr-1.5"
                >
                  <font-awesome-icon :icon="['fas', 'leaf']" class="text-green-600 text-xs" />
                </div>
                <span class="text-xs text-green-700 font-medium">季节:</span>
                <span
                  class="text-xs text-green-600 font-medium bg-white/80 px-1.5 py-0.5 rounded-full border border-green-100/50 ml-1"
                >
                  {{ getSeasonLabel(outfit.season) }}
                </span>
              </div>

              <!-- 风格信息 -->
              <div
                v-if="outfit?.style"
                class="flex items-center px-2 py-1 bg-purple-50/80 backdrop-blur-sm rounded-lg border border-purple-100/50 shadow-sm"
              >
                <div
                  class="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mr-1.5"
                >
                  <font-awesome-icon :icon="['fas', 'palette']" class="text-purple-600 text-xs" />
                </div>
                <span class="text-xs text-purple-700 font-medium">风格:</span>
                <span
                  class="text-xs text-purple-600 font-medium bg-white/80 px-1.5 py-0.5 rounded-full border border-purple-100/50 ml-1"
                >
                  {{ getStyleLabel(outfit.style) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 衣物预览区 - 堆叠效果 -->
        <div
          class="flex-1 flex items-center justify-center relative"
          @mouseleave="hoveredIndex = -1"
          style="height: 220px"
        >
          <div v-if="(outfit.metadata?.items?.length || 0) === 0" class="text-center text-indigo-400">
            <div
              class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100/80 to-purple-100/50 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-lg border border-indigo-100/50"
            >
              <font-awesome-icon :icon="['fas', 'tshirt']" class="text-indigo-500 text-2xl" />
            </div>
            <p class="text-sm text-indigo-500">暂无衣物</p>
          </div>
          <div v-else class="relative w-full h-full overflow-visible">
            <!-- 衣物图片堆叠效果 - 重新设计 -->
            <div class="relative w-full h-full flex items-center justify-center">
              <template v-for="(item, idx) in filteredItems" :key="idx">
                <div
                  class="absolute w-28 h-36 bg-gradient-to-br from-white to-indigo-50/50 rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-out cursor-pointer border-2 border-white/80 backdrop-blur-sm"
                  :class="{ 'ring-2 ring-indigo-400/30 ring-offset-1': hoveredIndex === idx }"
                  :style="getItemStyle(idx)"
                  @mouseenter="hoveredIndex = idx"
                  @click="openImagePreview(item)"
                >
                  <img
                    :src="item.mainImageUrl"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2"
                  >
                    <p class="text-white text-xs font-medium truncate">{{ item.name }}</p>
                    <p class="text-white/80 text-xs truncate">{{ item.type }}</p>
                  </div>
                </div>
              </template>
            </div>

            <!-- 更多衣物指示器 -->
            <div
              v-if="(outfit?.metadata?.items?.length || 0) > 4"
              class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-lg z-10"
            >
              +{{ (outfit?.metadata?.items?.length || 0) - 4 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 优化的搭配信息 -->
    <div
      class="p-5 flex-shrink-0 flex flex-col bg-gradient-to-br from-indigo-50/80 via-white/90 to-purple-50/80 backdrop-blur-sm"
    >
      <!-- 衣物数量统计 -->
      <div class="mb-4 flex items-center justify-between">
        <span
          class="text-sm font-medium text-indigo-700 flex items-center bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-indigo-100/50"
        >
          <div
            class="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-2 shadow-sm"
          >
            <font-awesome-icon :icon="['fas', 'layer-group']" class="text-indigo-600 text-xs" />
          </div>
          {{ outfit.metadata?.items?.length || 0 }}件衣物
        </span>
        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button
            @click="toggleEditMode"
            class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-indigo-100/50"
            title="编辑搭配"
          >
            <font-awesome-icon :icon="['fas', 'edit']" class="text-xs" />
          </button>
          <button
            @click="$emit('load-outfit', outfit)"
            class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-indigo-100/50"
            title="复制搭配"
          >
            <font-awesome-icon :icon="['fas', 'copy']" class="text-xs" />
          </button>
          <button
            @click="handleDelete"
            class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-indigo-100/50"
            :disabled="isLoading"
            title="删除搭配"
          >
            <font-awesome-icon v-if="!isLoading" :icon="['fas', 'trash']" class="text-xs" />
            <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin text-xs"></div>
          </button>
        </div>
      </div>

      <!-- 主要操作按钮 -->
      <button
        v-if="!isEditing"
        @click="$emit('load-outfit', outfit)"
        class="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 mt-auto"
      >
        <font-awesome-icon :icon="['fas', 'eye']" class="mr-2" />
        <span>查看详情</span>
      </button>
    </div>

    <!-- 编辑表单 - 独立模态框 -->
    <teleport to="body">
      <div
        v-if="isEditing"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="cancelEdit"
      >
        <div
          class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div
            class="p-6 bg-gradient-to-br from-indigo-50/80 via-white/90 to-purple-50/80 backdrop-blur-sm rounded-2xl"
          >
            <div class="flex justify-between items-center mb-4 pb-2 border-b border-indigo-100/50">
              <h3 class="text-lg font-bold text-indigo-900 flex items-center">
                <div
                  class="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-2 shadow-sm"
                >
                  <font-awesome-icon :icon="['fas', 'edit']" class="text-indigo-600 text-xs" />
                </div>
                编辑搭配信息
              </h3>
              <button
                @click="cancelEdit"
                class="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-500/10 transition-all duration-300 shadow-sm border border-indigo-100/50"
              >
                <font-awesome-icon :icon="['fas', 'times']" class="text-sm" />
              </button>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                  <div
                    class="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-2 shadow-sm"
                  >
                    <font-awesome-icon :icon="['fas', 'tag']" class="text-indigo-600 text-xs" />
                  </div>
                  搭配名称
                </label>
                <div class="relative">
                  <input
                    v-model="editOutfit.name"
                    type="text"
                    class="w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-indigo-100/50 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm shadow-sm transition-all duration-300"
                    :class="{ 'border-red-300 focus:ring-red-500/20 focus:border-red-400': validationErrors.name }"
                    placeholder="输入搭配名称"
                  />
                </div>
                <!-- 验证错误信息 -->
                <p v-if="validationErrors.name" class="mt-1 text-xs text-red-500 font-medium flex items-center">
                  <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-1 text-xs" />
                  {{ validationErrors.name }}
                </p>
              </div>
              <div>
                <!-- 场景选择 -->
                <label class="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                  <div
                    class="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-2 shadow-sm"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'map-marker-alt']"
                      class="text-indigo-600 text-xs"
                    />
                  </div>
                  适用场景
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="scene in sceneOptions"
                    :key="scene.value"
                    @click="selectScene(scene.value)"
                    class="py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center shadow-sm"
                    :class="
                      editOutfit.scenes.includes(scene.value)
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md transform scale-[1.02]'
                        : 'bg-white/70 backdrop-blur-sm text-indigo-700 hover:bg-indigo-100 border border-indigo-100/50'
                    "
                  >
                    <span>{{ scene.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 季节选择 -->
              <div>
                <label class="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                  <div
                    class="w-5 h-5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 flex items-center justify-center mr-2 shadow-sm"
                  >
                    <font-awesome-icon :icon="['fas', 'leaf']" class="text-green-600 text-xs" />
                  </div>
                  适用季节
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="season in seasonOptions"
                    :key="season.value"
                    @click="selectSeason(season.value)"
                    class="py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center shadow-sm"
                    :class="
                      editOutfit.seasons.includes(season.value)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md transform scale-[1.02]'
                        : 'bg-white/70 backdrop-blur-sm text-green-700 hover:bg-green-100 border border-green-100/50'
                    "
                  >
                    <span>{{ season.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 风格选择 -->
              <div>
                <label class="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
                  <div
                    class="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 flex items-center justify-center mr-2 shadow-sm"
                  >
                    <font-awesome-icon :icon="['fas', 'palette']" class="text-purple-600 text-xs" />
                  </div>
                  搭配风格
                </label>
                <div class="grid grid-cols-3 gap-1.5">
                  <button
                    v-for="style in styleOptions"
                    :key="style.value"
                    @click="selectStyle(style.value)"
                    class="py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center shadow-sm"
                    :class="
                      editOutfit.styles.includes(style.value)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-[1.02]'
                        : 'bg-white/70 backdrop-blur-sm text-purple-700 hover:bg-purple-100 border border-purple-100/50'
                    "
                  >
                    <span>{{ style.label }}</span>
                  </button>
                </div>
              </div>
              <div class="flex gap-2 pt-2">
                <button
                  @click="saveEdit"
                  class="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <font-awesome-icon :icon="['fas', 'save']" class="mr-1 text-xs" />
                  保存
                </button>
                <button
                  @click="cancelEdit"
                  class="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 图片预览模态框 -->
    <teleport to="body">
      <div
        v-if="previewImage.show"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        @click.self="previewImage.show = false"
      >
        <div class="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
             @click.stop>
          <!-- 关闭按钮 -->
          <button
            @click="previewImage.show = false"
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
            aria-label="关闭预览"
          >
            <font-awesome-icon :icon="['fas', 'times']" class="text-lg" />
          </button>

          <!-- 图片信息 -->
          <div class="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm z-10">
            <div class="font-medium">{{ previewImage.name }}</div>
            <div class="text-white/80">{{ previewImage.type }}</div>
          </div>

          <!-- 图片预览 -->
          <div class="flex-1 flex items-center justify-center w-full">
            <img
              :src="previewImage.url"
              :alt="previewImage.name"
              class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
  /**
   * OutfitCard 组件 - 服装搭配卡片组件
   * 
   * 功能说明：
   * 1. 展示搭配基本信息（名称、场景、季节、风格）
   * 2. 实现衣物堆叠预览效果，支持鼠标悬停交互
   * 3. 提供编辑、删除、复制搭配功能
   * 4. 支持衣物图片点击预览功能
   * 5. 表单验证和错误处理
   * 6. 加载状态和键盘导航支持
   * 
   * Props:
   * @param {Object} outfit - 搭配数据对象
   *   @property {string} id - 搭配ID
   *   @property {string} name - 搭配名称
   *   @property {string} scene - 适用场景（逗号分隔字符串）
   *   @property {string} season - 适用季节
   *   @property {string} style - 搭配风格
   *   @property {Object} metadata - 搭配元数据
   *     @property {Array} items - 衣物列表
   * 
   * Emits:
   * @event {Function} load-outfit - 加载搭配详情
   * @event {Function} delete-outfit - 删除搭配
   * @event {Function} edit-outfit - 编辑搭配
   */
  import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
  import { useEnumsStore } from '@/stores/modules/enumsStore';

  // Props定义
  const props = defineProps({
    outfit: {
      type: Object,
      required: true,
    },
  });

  // 事件定义
  const emit = defineEmits(['load-outfit', 'delete-outfit', 'edit-outfit']);

  // 状态管理
  const enumsStore = useEnumsStore();

  // 加载状态
  const isLoading = ref(false);
  
  // 错误状态
  const error = ref(null);

  // 组件加载时获取枚举值
  onMounted(() => {
    enumsStore.fetchAllEnums();
  });

  // 场景选项映射 - 从enumsStore获取
  const sceneOptions = computed(() => enumsStore.getOptions('scenes') || []);
  // 季节选项映射 - 从enumsStore获取
  const seasonOptions = computed(() => enumsStore.getOptions('seasons') || []);
  // 风格选项映射 - 从enumsStore获取
  const styleOptions = computed(() => enumsStore.getOptions('styles') || []);

  // 获取场景标签
  function getSceneLabel(value) {
    const scene = sceneOptions.value.find(option => option.id === value);
    return scene ? scene.name : value;
  }

  // 获取季节标签
  function getSeasonLabel(value) {
    const season = seasonOptions.value.find(option => option.id === value);
    return season ? season.name : value;
  }

  // 获取风格标签
  function getStyleLabel(value) {
    const style = styleOptions.value.find(option => option.id === value);
    return style ? style.name : value;
  }

  // 通用选择逻辑函数
  function toggleSelection(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1); // 如果已选中，则取消选择
    } else {
      array.push(value); // 添加到选择数组
    }
  }

  // 选择场景
  function selectScene(value) {
    toggleSelection(editOutfit.scenes, value);
  }

  // 选择季节
  function selectSeason(value) {
    toggleSelection(editOutfit.seasons, value);
  }

  // 选择风格
  function selectStyle(value) {
    toggleSelection(editOutfit.styles, value);
  }
  const hoveredIndex = ref(-1);

  // 过滤出有图片的衣物并限制最多4个
  const filteredItems = computed(() => {
    return (props.outfit?.metadata?.items || [])
      .filter(item => item.mainImageUrl)
      .slice(0, 4);
  });

  // 获取单个衣物的样式
  function getItemStyle(index) {
    const totalItems = filteredItems.value.length;
    const maxRotation = 15;
    const maxOffset = 15;
    
    if (totalItems === 0) return {};
    
    const rotation = (index - (totalItems - 1) / 2) * (maxRotation / totalItems);
    const offset = (index - (totalItems - 1) / 2) * (maxOffset / totalItems);

    return {
      transform: `translateX(${offset}px) rotate(${rotation}deg)`,
      zIndex: 10 + index,
      opacity: hoveredIndex.value === -1 || hoveredIndex.value === index ? 1 : 0.7,
    };
  }





  // 图片预览
  const previewImage = ref({
    show: false,
    url: '',
    name: '',
    type: '',
  });

  // 打开图片预览
  function openImagePreview(item) {
    previewImage.value = {
      show: true,
      url: item.mainImageUrl,
      name: item.name,
      type: item.type,
    };
  }





  // 编辑状态
  const isEditing = ref(false);
  const editOutfit = reactive({
    id: '',
    name: '',
    scenes: [], // 改为数组，支持多选
    seasons: [], // 改为数组，支持多选
    styles: [], // 改为数组，支持多选
  });

  // 表单验证
  const validationErrors = reactive({
    name: '',
  });

  // 验证表单
  function validateForm() {
    validationErrors.name = !editOutfit.name.trim() ? '请输入搭配名称' : '';
    return !validationErrors.name;
  }

  // 切换编辑模式
  function toggleEditMode() {
    if (isEditing.value) {
      isEditing.value = false;
    } else {
      // 进入编辑模式，初始化编辑数据
      editOutfit.id = props.outfit.id;
      editOutfit.name = props.outfit.name;
      // 将字符串转换为数组，支持多选
      editOutfit.scenes = props.outfit.scene ? props.outfit.scene.split(',') : [];
      editOutfit.seasons = props.outfit.season ? [props.outfit.season] : [];
      editOutfit.styles = props.outfit.style ? [props.outfit.style] : [];
      // 清空验证错误
      validationErrors.name = '';
      isEditing.value = true;
    }
  }

  // 保存编辑
  function saveEdit() {
    if (!validateForm()) {
      return;
    }

    emit('edit-outfit', {
      id: editOutfit.id,
      name: editOutfit.name,
      // 将数组转换为字符串，兼容后端
      scene: editOutfit.scenes.length > 0 ? editOutfit.scenes.join(',') : '',
      season: editOutfit.seasons.length > 0 ? editOutfit.seasons[0] : '',
      style: editOutfit.styles.length > 0 ? editOutfit.styles[0] : '',
    });
    isEditing.value = false;
  }

  // 取消编辑
  function cancelEdit() {
    isEditing.value = false;
  }

  // 键盘事件监听
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      if (isEditing.value) {
        cancelEdit();
      } else if (previewImage.value.show) {
        previewImage.value.show = false;
      }
    }
  }

  // 组件挂载时添加键盘事件监听
  onMounted(() => {
    enumsStore.fetchAllEnums();
    document.addEventListener('keydown', handleKeydown);
  });

  // 组件卸载时移除键盘事件监听
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });

  // 处理删除操作
  async function handleDelete() {
    try {
      // 确认删除
      if (!confirm(`确定要删除搭配 "${props.outfit.name}" 吗？此操作不可恢复。`)) {
        return;
      }

      isLoading.value = true;
      error.value = null;

      // 发出删除事件
      emit('delete-outfit', props.outfit.id);
    } catch (err) {
      error.value = '删除失败，请重试';
      console.error('删除搭配时出错:', err);
    } finally {
      isLoading.value = false;
    }
  }
</script>

<style scoped>
  /* 自定义动画 */
  @keyframes pulse-slow {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animation-delay-1000 {
    animation-delay: 1s;
  }

  /* 图片预览模态框 */
  :deep(.modal-backdrop) {
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
