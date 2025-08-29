<template>
  <div
    class="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg overflow-hidden border border-indigo-100 h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100"
  >
    <div
      class="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-5 border-b border-indigo-100 backdrop-blur-sm"
    >
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg flex items-center text-indigo-900">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mr-2 shadow-sm animate-pulse-slow"
          >
            <font-awesome-icon icon="lightbulb" class="text-white text-sm" />
          </div>
          搭配灵感
        </h3>
        <div class="flex items-center gap-2">
          <span
            class="bg-white/80 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full font-medium text-sm shadow-sm border border-indigo-100"
          >
            {{ selectedClothes.length }}件衣物
          </span>
        </div>
      </div>
    </div>

    <div class="flex-1 p-5 flex flex-col">
      <!-- 搭配预览区 -->
      <div
        class="bg-gradient-to-br from-indigo-100/30 via-white/50 to-purple-100/30 rounded-2xl p-5 h-64 md:h-72 flex flex-col items-center justify-center mb-5 border border-indigo-100/50 relative overflow-hidden shadow-inner backdrop-blur-sm outfit-preview-area"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- 装饰元素 -->
        <div
          class="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-xl animate-pulse-slow"
        ></div>
        <div
          class="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-purple-200/20 to-indigo-200/20 rounded-full blur-lg animate-pulse-slow animation-delay-1000"
        ></div>
        <div
          class="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-indigo-300/30 animate-ping"
        ></div>
        <div
          class="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-purple-300/30 animate-ping animation-delay-700"
        ></div>

        <!-- 空状态 -->
        <div v-if="selectedClothes.length === 0" class="text-center relative z-10">
          <div
            class="w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-md border border-white/50"
          >
            <font-awesome-icon icon="tshirt" class="text-primary text-3xl" />
          </div>
          <p class="text-neutral-600 font-medium">从右侧添加衣物进行搭配</p>
        </div>

        <!-- 有衣物时的预览 -->
        <div
          v-else
          class="w-full h-full flex flex-wrap justify-center items-center gap-3 md:gap-4 relative z-10"
        >
          <div
            v-for="(item, idx) in selectedClothes.slice(0, 8)"
            :key="idx"
            class="relative group transform transition-all duration-500 hover:z-10 outfit-item"
            :class="idx >= 6 ? 'opacity-70 scale-95' : ''"
            :style="{
              transform: `translateY(${((idx % 3) - 1) * 10}px) rotate(${
                (idx % 2 === 0 ? -1 : 1) * (idx % 3)
              }deg)`,
              '--index': idx,
            }"
            :data-index="idx"
            @click="openImagePreview(item)"
          >
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <img
              :src="item.img"
              :alt="item.name"
              class="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-lg border-2 border-white relative z-10 transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div
              v-if="idx === 7 && selectedClothes.length > 8"
              class="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center text-white text-xs font-bold z-20"
            >
              +{{ selectedClothes.length - 8 }}
            </div>
            <div
              class="absolute inset-x-0 -bottom-7 bg-black/80 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none text-center truncate z-20 whitespace-nowrap shadow-lg"
            >
              {{ item.name }}
            </div>
            <!-- 删除按钮 -->
            <button
              class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 hover:bg-red-600 transform hover:scale-110"
              @click.stop="removeItem(idx)"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
            </button>
          </div>
        </div>

        <!-- 拖放提示 -->
        <div
          v-if="isDragOver"
          class="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20 animate-pulse"
        >
          <div class="text-center p-6 bg-white/90 backdrop-blur rounded-xl shadow-lg">
            <font-awesome-icon :icon="['fas', 'tshirt']" class="text-primary text-3xl mb-3" />
            <p class="text-primary font-medium">拖放到此处添加到搭配</p>
          </div>
        </div>

        <!-- 图片预览模态框 -->
        <teleport to="body">
          <div
            v-if="previewImage.show"
            class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            @click="closeImagePreview"
          >
            <div class="relative max-w-4xl max-h-[90vh] animate-fade-in" @click.stop>
              <img
                :src="previewImage.url"
                :alt="previewImage.name"
                class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl"
              >
                <h3 class="text-white text-xl font-bold mb-1">{{ previewImage.name }}</h3>
                <p class="text-white/80">{{ previewImage.type }}</p>
              </div>
              <button
                class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                @click="closeImagePreview"
              >
                <font-awesome-icon :icon="['fas', 'times']" />
              </button>
            </div>
          </div>
        </teleport>
      </div>

      <!-- 搭配信息表单 -->
      <div
        class="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 rounded-2xl p-5 mb-5 border border-indigo-100 shadow-sm backdrop-blur-sm"
      >
        <h4 class="text-sm font-semibold text-indigo-800 mb-4 flex items-center">
          <div
            class="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center mr-2 shadow-sm"
          >
            <font-awesome-icon :icon="['fas', 'tag']" class="text-indigo-600 text-xs" />
          </div>
          搭配信息
        </h4>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-indigo-700 mb-1.5">
              搭配名称
              <span class="text-red-500 font-bold ml-1">*</span>
            </label>
            <div class="relative">
              <input
                :value="outfitName"
                @input="$emit('update:outfitName', $event.target.value)"
                type="text"
                class="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-400 text-sm bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
                placeholder="为你的搭配起个名字"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <font-awesome-icon :icon="['fas', 'pen']" class="text-indigo-400 text-xs" />
              </div>
            </div>
          </div>

          <!-- 使用场景：从输入框改为多选按钮组，调整为一行显示3个 -->
          <div>
            <label class="block text-xs font-medium text-indigo-700 mb-1.5">使用场景</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="scene in sceneOptions"
                :key="scene.value"
                @click="toggleScene(scene.value)"
                class="py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center"
                :class="
                  outfitScene && Array.isArray(outfitScene) && outfitScene.includes(scene.value)
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100'
                "
              >
                <span>{{ scene.label }}</span>
              </button>
            </div>
          </div>

          <!-- 季节选择：从单选改为多选 -->
          <div>
            <label class="block text-xs font-medium text-indigo-700 mb-1.5">适用季节</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="season in seasonOptions"
                :key="season.value"
                @click="toggleSeason(season.value)"
                class="py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center"
                :class="
                  outfitSeason && Array.isArray(outfitSeason) && outfitSeason.includes(season.value)
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                "
              >
                <span>{{ season.label }}</span>
              </button>
            </div>
          </div>

          <!-- 风格选择：从单选改为多选 -->
          <div>
            <label class="block text-xs font-medium text-indigo-700 mb-1.5">搭配风格</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="style in styleOptions"
                :key="style.value"
                @click="toggleStyle(style.value)"
                class="py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center"
                :class="
                  outfitStyle && Array.isArray(outfitStyle) && outfitStyle.includes(style.value)
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100'
                "
              >
                <span>{{ style.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 衣物列表 -->
      <div class="flex-1 flex flex-col">
        <div class="mb-3 flex justify-between items-center">
          <span class="text-sm font-semibold text-indigo-800">
            衣物清单 ({{ selectedClothes.length }})
          </span>
          <button
            v-if="selectedClothes.length > 0"
            class="text-xs text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
            @click="$emit('reset-clothes')"
          >
            <font-awesome-icon :icon="['fas', 'trash-alt']" class="mr-1" />
            清空全部
          </button>
        </div>

        <div
          class="h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent space-y-2.5"
        >
          <div
            v-if="selectedClothes.length === 0"
            class="text-center text-indigo-400 py-6 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 backdrop-blur-sm"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2" />
            <p class="text-sm">尚未选择衣物</p>
          </div>
          <div
            v-else
            v-for="(item, idx) in selectedClothes"
            :key="idx"
            class="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-3 group hover:bg-indigo-50 transition-all duration-300 transform hover:translate-x-1 border border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-md"
          >
            <div class="relative">
              <div
                class="absolute -inset-1 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <img
                :src="item.img"
                :alt="item.name"
                class="w-12 h-12 rounded-lg object-cover shadow-sm relative z-10"
                loading="lazy"
              />
              <div
                class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm z-20"
              >
                <span class="text-white text-xs font-bold">{{ idx + 1 }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-indigo-900 truncate">{{ item.name }}</p>
              <p class="text-xs text-indigo-600 truncate">{{ item.type }}</p>
            </div>
            <button
              class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
              @click="$emit('remove-cloth', idx)"
            >
              <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="mt-5 flex gap-3">
          <button
            class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group/button"
            @click="handleSaveOutfit"
            :disabled="selectedClothes.length === 0 || !outfitName.trim()"
          >
            <!-- 按钮装饰效果 -->
            <div
              class="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/20 to-indigo-500/0 transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"
            ></div>

            <font-awesome-icon
              :icon="['fas', 'heart']"
              class="mr-2 transition-transform duration-300 group-hover/button:scale-110"
            />
            <span
              class="transition-transform duration-300 group-hover/button:scale-105 font-medium"
            >
              保存搭配
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, defineModel, watch } from 'vue';
  import { showToast } from '../../utils/toast';
  import { scenesMockData, seasonsMockData, stylesMockData } from '../../mock/data';

  // 定义模型
  const outfitName = defineModel('outfitName', { type: String, default: '' });
  const outfitScene = defineModel('outfitScene', { type: Array, default: () => [] });
  const outfitSeason = defineModel('outfitSeason', { type: Array, default: () => [] });
  const outfitStyle = defineModel('outfitStyle', { type: Array, default: () => [] });

  // 使用场景选项
  const sceneOptions = scenesMockData;

  // 季节选项
  const seasonOptions = seasonsMockData;

  // 风格选项
  const styleOptions = stylesMockData;

  // 场景、季节和风格的多选处理函数
  function toggleScene(value) {
    if (!Array.isArray(outfitScene.value)) {
      outfitScene.value = [];
    }
    const index = outfitScene.value.indexOf(value);
    if (index > -1) {
      outfitScene.value.splice(index, 1);
    } else {
      outfitScene.value.push(value);
    }
  }

  function toggleSeason(value) {
    if (!Array.isArray(outfitSeason.value)) {
      outfitSeason.value = [];
    }
    const index = outfitSeason.value.indexOf(value);
    if (index > -1) {
      outfitSeason.value.splice(index, 1);
    } else {
      outfitSeason.value.push(value);
    }
  }

  function toggleStyle(value) {
    if (!Array.isArray(outfitStyle.value)) {
      outfitStyle.value = [];
    }
    const index = outfitStyle.value.indexOf(value);
    if (index > -1) {
      outfitStyle.value.splice(index, 1);
    } else {
      outfitStyle.value.push(value);
    }
  }

  // 图片预览状态
  const previewImage = ref({
    show: false,
    url: '',
    name: '',
    type: '',
  });

  // 拖放状态
  const isDragOver = ref(false);

  // 打开图片预览
  function openImagePreview(item) {
    previewImage.value = {
      show: true,
      url: item.img,
      name: item.name,
      type: item.type,
    };
  }

  // 关闭图片预览
  function closeImagePreview() {
    previewImage.value.show = false;
  }

  // 处理拖拽悬停
  function handleDragOver(event) {
    // 阻止默认行为以允许放置
    event.preventDefault();
    isDragOver.value = true;
    event.currentTarget.classList.add('drag-over');
  }

  // 处理拖拽离开
  function handleDragLeave(event) {
    // 只有当鼠标真正离开预览区域时才隐藏提示
    // 检查相关目标是否是预览区域的子元素
    if (!event.currentTarget.contains(event.relatedTarget)) {
      isDragOver.value = false;
      event.currentTarget.classList.remove('drag-over');
    }
  }

  // 处理拖放
  function handleDrop(event) {
    // 阻止默认行为
    event.preventDefault();

    isDragOver.value = false;
    event.currentTarget.classList.remove('drag-over');

    try {
      // 获取拖拽的数据
      const itemData = JSON.parse(event.dataTransfer.getData('text/plain'));

      // 触发添加衣物事件
      emit('add-cloth', itemData);

      // 添加成功反馈
      showToast('已添加到搭配', 'success');
    } catch (error) {
      console.error('处理拖放数据失败:', error);
      showToast('添加失败，请重试', 'error');
    }
  }

  // 定义emit
  const emit = defineEmits(['remove-cloth', 'reset-clothes', 'save-outfit', 'add-cloth']);

  // 处理保存搭配
  function handleSaveOutfit() {
    if (!outfitName.value?.trim()) {
      alert('请输入搭配名称');
      return;
    }

    emit('save-outfit', {
      name: outfitName.value,
      scenes: outfitScene.value,
      seasons: outfitSeason.value,
      styles: outfitStyle.value,
    });
  }

  // 移除衣物
  function removeItem(index) {
    emit('remove-cloth', index);
    showToast('已从搭配中移除', 'info');
  }

  defineProps({
    selectedClothes: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style scoped>
  /* 自定义滚动条样式 */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  /* 搭配预览动画 */
  @keyframes outfit-float {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(2deg);
    }
  }

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

  .outfit-item {
    animation: outfit-float 4s ease-in-out infinite;
    animation-delay: calc(var(--index) * 0.2s);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .outfit-item:nth-child(odd) {
    animation-direction: alternate;
  }

  .outfit-item:hover {
    z-index: 30 !important;
    transform: scale(1.1) !important;
  }

  /* 图片预览动画 */
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  /* 拖放区域样式 */
  .outfit-preview-area {
    position: relative;
    transition: all 0.3s ease;
  }

  .outfit-preview-area.drag-over {
    background-color: rgba(99, 102, 241, 0.1);
    border: 2px dashed #6366f1;
    border-radius: 1rem;
    transform: scale(1.02);
  }
</style>
