<template>
  <!-- 编辑衣物模态框 -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeOnBackdrop"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
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
        <div class="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-gray-50">
          <!-- 图片上传区域 -->
          <div class="mb-8 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <label class="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <font-awesome-icon :icon="['fas', 'image']" class="text-primary mr-2" />
              衣物图片
            </label>
            <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div class="relative group">
                <div
                  class="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary/30"
                >
                  <img
                    v-if="form.image"
                    :src="form.image"
                    :alt="form.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div v-else class="text-center p-4">
                    <font-awesome-icon
                      :icon="['fas', 'image']"
                      class="text-gray-400 text-3xl mb-2"
                    />
                    <p class="text-xs text-gray-500">暂无图片</p>
                  </div>
                </div>
                <button
                  v-if="form.image && !readOnly"
                  @click="form.image = ''"
                  class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors duration-300 hover:scale-110"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
                </button>
              </div>
              <div class="flex-1 text-center sm:text-left">
                <button
                  v-if="!readOnly"
                  @click="triggerFileInput"
                  class="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] inline-flex items-center"
                >
                  <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" class="mr-2" />
                  上传图片
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  :disabled="readOnly"
                  class="hidden"
                  @change="handleImageUpload"
                />
                <p class="text-xs text-gray-500 mt-2">支持 JPG, PNG 格式，建议尺寸 300×400</p>
              </div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="space-y-8">
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
                    <option v-for="category in categories" :key="category.value" :value="category.value">
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

              <!-- 季节选择 -->
              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <font-awesome-icon :icon="['fas', 'calendar-alt']" class="text-primary mr-2" />
                  适用季节
                </label>
                <div
                  class="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-4 shadow-sm"
                >
                  <div class="grid grid-cols-2 gap-3">
                    <label
                      class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        v-model="form.seasons"
                        value="春季"
                        :disabled="readOnly"
                        :class="[
                          readOnly ? 'cursor-not-allowed' : '',
                          'rounded text-primary focus:ring-primary/30 border-gray-300',
                        ]"
                      />
                      <span class="text-sm flex items-center">
                        <font-awesome-icon
                          :icon="['fas', 'seedling']"
                          class="text-green-500 mr-1.5 text-xs"
                        />
                        春季
                      </span>
                    </label>
                    <label
                      class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        v-model="form.seasons"
                        value="夏季"
                        :disabled="readOnly"
                        :class="[
                          readOnly ? 'cursor-not-allowed' : '',
                          'rounded text-primary focus:ring-primary/30 border-gray-300',
                        ]"
                      />
                      <span class="text-sm flex items-center">
                        <font-awesome-icon
                          :icon="['fas', 'sun']"
                          class="text-yellow-500 mr-1.5 text-xs"
                        />
                        夏季
                      </span>
                    </label>
                    <label
                      class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        v-model="form.seasons"
                        value="秋季"
                        :disabled="readOnly"
                        :class="[
                          readOnly ? 'cursor-not-allowed' : '',
                          'rounded text-primary focus:ring-primary/30 border-gray-300',
                        ]"
                      />
                      <span class="text-sm flex items-center">
                        <font-awesome-icon
                          :icon="['fas', 'leaf']"
                          class="text-orange-500 mr-1.5 text-xs"
                        />
                        秋季
                      </span>
                    </label>
                    <label
                      class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        v-model="form.seasons"
                        value="冬季"
                        :disabled="readOnly"
                        :class="[
                          readOnly ? 'cursor-not-allowed' : '',
                          'rounded text-primary focus:ring-primary/30 border-gray-300',
                        ]"
                      />
                      <span class="text-sm flex items-center">
                        <font-awesome-icon
                          :icon="['fas', 'snowflake']"
                          class="text-blue-500 mr-1.5 text-xs"
                        />
                        冬季
                      </span>
                    </label>
                  </div>
                  <div class="mt-3 pt-3 border-t border-gray-200">
                    <label
                      class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        v-model="allSeasons"
                        :disabled="readOnly"
                        :class="[
                          readOnly ? 'cursor-not-allowed' : '',
                          'rounded text-primary focus:ring-primary/30 border-gray-300',
                        ]"
                      />
                      <span class="text-sm flex items-center font-medium">
                        <font-awesome-icon
                          :icon="['fas', 'globe-asia']"
                          class="text-purple-500 mr-1.5 text-xs"
                        />
                        四季通用
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 基本信息 - 第四行 -->
            <div class="grid grid-cols-1 gap-5">
              <!-- 收藏 -->
              <div
                class="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100"
              >
                <input v-model="form.favorite" type="checkbox" id="favorite" class="sr-only" />
                <div
                  class="mr-2 w-5 h-5 flex items-center justify-center rounded border-2 border-gray-300 transition-colors duration-200"
                  :class="{
                    'bg-pink-500 border-pink-500': form.favorite,
                    'border-gray-300': !form.favorite,
                  }"
                >
                  <font-awesome-icon
                    v-if="form.favorite"
                    :icon="['fas', 'heart']"
                    class="text-white text-xs"
                  />
                </div>
                <label
                  for="favorite"
                  class="block text-sm text-gray-700 flex items-center cursor-pointer"
                >
                  <font-awesome-icon :icon="['fas', 'heart']" class="text-pink-500 mr-2" />
                  添加到收藏
                </label>
              </div>

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

<script>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useClothingStore } from '@/stores';
  import { useEnumsStore } from '@/stores';
  import { showToast } from '../../utils/toast';

  export default {
    name: 'ClothingItemEditor',
    props: {
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
    },
    emits: ['close', 'saved'],
    setup(props, { emit }) {
      const clothingStore = useClothingStore();
      const enumsStore = useEnumsStore();
      const fileInput = ref(null);

      // 分类数据
      const categories = computed(() => enumsStore.categoryLabels || []);

      // 在组件挂载时获取枚举数据
      onMounted(async () => {
        try {
          console.log('组件挂载，开始获取枚举数据...');
          await enumsStore.fetchAllEnums();
          console.log('枚举数据加载完成，当前分类数据:', categories.value);
        } catch (error) {
          console.error('获取枚举数据失败:', error);
        }
      });
      
      // 监听分类数据变化
      watch(categories, (newCategories) => {
        console.log('分类数据已更新:', newCategories);
      }, { deep: true });

      // 表单数据
      const form = ref({
        id: '',
        name: '',
        brand: '',
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
              const matchedCategory = categories.value.find(
                c => c.id === itemCopy.category
              );
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
        { immediate: true }
      );

      // 重置表单
      function resetForm() {
        form.value = {
          id: '',
          name: '',
          brand: '',
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

      // 触发文件选择
      function triggerFileInput() {
        fileInput.value.click();
      }

      // 处理图片上传
      function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          // 验证文件大小（限制2MB）
          if (file.size > 2 * 1024 * 1024) {
            showToast('图片大小不能超过2MB', 'error');
            return;
          }

          // 验证文件类型
          if (!file.type.startsWith('image/')) {
            showToast('请选择图片文件', 'error');
            return;
          }

          const reader = new FileReader();
          reader.onload = e => {
            const dataUrl = e.target.result;

            // 任何DataURL都使用占位符，避免验证失败
            if (dataUrl.startsWith('data:')) {
              form.value.image = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
              showToast('已使用占位符图片', 'info');
            } else if (dataUrl.length > 200) {
              // 任何长URL都使用占位符
              form.value.image = 'https://via.placeholder.com/300x400/6366f1/ffffff?text=Image';
              showToast('图片链接过长，已使用占位符', 'info');
            } else {
              form.value.image = dataUrl;
            }
          };
          reader.readAsDataURL(file);
        }
      }

      // 保存衣物前验证
      async function saveItem() {
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
            const season = enumsStore.seasons.find(s => s.label === primarySeason);
            if (season && season.value) {
              submitData.season = season.value;
            }
          }

          // 准备完整的提交数据
          const finalSubmitData = {
            ...submitData,
            // 确保所有字段都以独立字段形式传递
            // 移除可能存在的metadata对象
            metadata: undefined
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

      // 全选季节
      const allSeasons = computed({
        get() {
          if (!form.value.seasons || !Array.isArray(form.value.seasons)) return false;
          return (
            form.value.seasons.length === 4 &&
            form.value.seasons.includes('春季') &&
            form.value.seasons.includes('夏季') &&
            form.value.seasons.includes('秋季') &&
            form.value.seasons.includes('冬季')
          );
        },
        set(value) {
          if (value) {
            form.value.seasons = ['春季', '夏季', '秋季', '冬季'];
          } else {
            form.value.seasons = [];
          }
        },
      });

      // 更新分类名称
      function updateCategoryName() {
        if (form.value.category) {
          const selectedCategory = categories.value.find(c => c.value === form.value.category);
          if (selectedCategory) {
            form.value.categoryName = selectedCategory.label;
          }
        } else {
          form.value.categoryName = '';
        }
      }

      return {
        form,
        categories,
        isFormValid,
        fileInput,
        triggerFileInput,
        handleImageUpload,
        saveItem,
        closeOnBackdrop,
        allSeasons,
        updateCategoryName,
        enumsStore,
      };
    },
  };
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
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

// 更新分类名称 function updateCategoryName() { if (form.value.categoryId) { const selectedCategory
= categories.value.find(c => c.id === form.value.categoryId); if (selectedCategory) {
form.value.categoryName = selectedCategory.name; } } else { form.value.categoryName = ''; } } //
全选季节 const allSeasons = computed({ get() { if (!form.value.seasons ||
!Array.isArray(form.value.seasons)) return false; return ( form.value.seasons.length === 4 &&
form.value.seasons.includes('春季') && form.value.seasons.includes('夏季') &&
form.value.seasons.includes('秋季') && form.value.seasons.includes('冬季') ); }, set(value) { if
(value) { form.value.seasons = ['春季', '夏季', '秋季', '冬季']; } else { form.value.seasons = []; }
}, });
