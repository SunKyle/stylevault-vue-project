<template>
  <div
    class="bg-gradient-to-br from-indigo-500/15 via-white to-purple-500/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-indigo-100/80 flex flex-col transform hover:-translate-y-1.5"
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
              <!-- 统一的信息展示组件 -->
              <InfoChip
                v-if="outfit?.scene"
                :icon="['fas', 'map-marker-alt']"
                label="场景"
                :values="outfit.scene.split(',')"
                :get-label="getSceneLabel"
                color-scheme="indigo"
              />

              <InfoChip
                v-if="outfit?.season"
                :icon="['fas', 'leaf']"
                label="季节"
                :values="[outfit.season]"
                :get-label="getSeasonLabel"
                color-scheme="green"
              />

              <InfoChip
                v-if="outfit?.style"
                :icon="['fas', 'palette']"
                label="风格"
                :values="[outfit.style]"
                :get-label="getStyleLabel"
                color-scheme="purple"
              />
            </div>
          </div>
        </div>

        <!-- 衣物预览区 - 堆叠效果 -->
        <div
          class="flex-1 flex items-center justify-center relative"
          @mouseleave="resetStack"
          style="height: 220px"
        >
          <div v-if="(outfit?.items?.length || 0) === 0" class="text-center text-indigo-400">
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
              <template v-for="(item, idx) in (outfit?.items || []).slice(0, 4)" :key="idx">
                <div
                  v-if="item.img"
                  class="absolute w-28 h-36 bg-gradient-to-br from-white to-indigo-50/50 rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-out cursor-pointer border-2 border-white/80 backdrop-blur-sm"
                  :class="{ 'ring-2 ring-indigo-400/30 ring-offset-1': hoveredIndex === idx }"
                  :style="getItemStyle(idx)"
                  @mouseenter="hoveredIndex = idx"
                  @click="openImagePreview(item)"
                >
                  <img
                    :src="item.img"
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
              v-if="(outfit?.items?.length || 0) > 4"
              class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-lg z-10"
            >
              +{{ (outfit?.items?.length || 0) - 4 }}
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
          {{ outfit?.items?.length || 0 }}件衣物
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
            @click="$emit('delete-outfit', outfit.id)"
            class="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg border border-indigo-100/50"
            title="删除搭配"
          >
            <font-awesome-icon :icon="['fas', 'trash']" class="text-xs" />
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
                    placeholder="输入搭配名称"
                  />
                </div>
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
                  <span class="line-clamp-1">
                    {{ outfit.scene || '未设置场景' }}
                  </span>
                </label>
              </div>
              <!-- 衣物数量信息 -->
              <div class="flex items-center space-x-1 mt-2">
                <div
                  class="flex items-center text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full"
                >
                  <div
                    class="w-4 h-4 rounded-full bg-indigo-500/10 flex items-center justify-center mr-1.5 shadow-sm"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'layer-group']"
                      class="text-indigo-600 text-xs"
                    />
                  </div>
                  <span>{{ outfit.clothingItems?.length || 0 }} 件衣物</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useEnumsStore } from '@/stores/enums';
  import InfoChip from './InfoChip.vue';

  // Props定义
  const props = defineProps({
    outfit: {
      type: Object,
      required: true,
    },
  });



  // 状态管理
  // const expanded = ref(false); // 暂时未使用，因为toggleExpand函数已注释

  const enumsStore = useEnumsStore();

  // 组件加载时获取枚举值
  onMounted(() => {
    enumsStore.fetchAllEnums();
  });

  // 场景选项映射
  const sceneOptions = computed(() => enumsStore.getOptions('occasions'));

  // 季节选项映射
  const seasonOptions = computed(() => enumsStore.getOptions('seasons'));

  // 风格选项映射
  const styleOptions = computed(() => enumsStore.getOptions('styles'));

  // 通用工具函数 - 获取标签
  const getLabel = (options, value) => {
    if (!options || !Array.isArray(options) || !value) return value;
    const item = options.find(opt => opt.id === value);
    return item ? item.name : value;
  };

  const getSceneLabel = value => getLabel(sceneOptions.value, value);
  const getSeasonLabel = value => getLabel(seasonOptions.value, value);
  const getStyleLabel = value => getLabel(styleOptions.value, value);


  const hoveredIndex = ref(-1);

  // 切换展开状态 - 暂时未使用
  // function toggleExpand() {
  //   expanded.value = !expanded.value;
  // }

  // 获取堆叠样式
  function getItemStyle(index) {
    const items = props.outfit?.items || [];
    const totalItems = Math.min(items.length, 4);
    if (totalItems === 0) return {};

    const centerIndex = (totalItems - 1) / 2;
    const offset = index - centerIndex;

    return {
      transform: `translateX(${offset * 15}px) rotate(${offset * 4}deg)`,
      zIndex: 10 + index,
      opacity: hoveredIndex.value === -1 || hoveredIndex.value === index ? 1 : 0.7,
    };
  }

  // 重置堆叠效果
  function resetStack() {
    hoveredIndex.value = -1;
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
      url: item.img,
      name: item.name,
      type: item.type,
    };
  }

  // 关闭图片预览 - 暂时未使用
  // function closeImagePreview() {
  //   previewImage.value.show = false;
  // }

  // 编辑状态
  const isEditing = ref(false);
  const editOutfit = reactive({
    id: '',
    name: '',
    scenes: [], // 改为数组，支持多选
    seasons: [], // 改为数组，支持多选
    styles: [], // 改为数组，支持多选
  });

  // 编辑相关方法
  const editMethods = {
    toggleEditMode: () => {
      if (isEditing.value) {
        editMethods.cancelEdit();
      } else {
        editOutfit.id = props.outfit.id;
        editOutfit.name = props.outfit.name;
        editOutfit.scenes = props.outfit.scene ? props.outfit.scene.split(',') : [];
        editOutfit.seasons = props.outfit.season ? [props.outfit.season] : [];
        editOutfit.styles = props.outfit.style ? [props.outfit.style] : [];
        isEditing.value = true;
      }
    },



    cancelEdit: () => {
      isEditing.value = false;
    },
  };

  // 保持向后兼容
  const toggleEditMode = editMethods.toggleEditMode;

  const cancelEdit = editMethods.cancelEdit;
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

  /* 响应式设计 */
  @media (max-width: 640px) {
    .outfit-card {
      @apply rounded-lg shadow-md;
    }

    .outfit-info {
      @apply p-3;
    }

    .clothing-preview {
      @apply grid-cols-2 gap-2;
    }

    .outfit-actions {
      @apply flex-col space-y-2;
    }
  }

  @media (max-width: 768px) {
    .clothing-stack {
      @apply grid-cols-2 gap-4;
    }

    .outfit-meta {
      @apply flex-col space-y-2;
    }
  }

  @media (min-width: 1024px) {
    .outfit-card:hover {
      @apply transform scale-105;
    }
  }

  /* 移动端优化 */
  @media (hover: none) {
    .outfit-card:active {
      @apply transform scale-95;
    }
  }
</style>
