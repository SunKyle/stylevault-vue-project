<template>
  <!-- 图片上传组件 -->
  <!-- 用于上传、预览和管理衣物图片 -->
  <div class="mb-6 bg-neutral-50 rounded-xl p-6 border border-neutral-200">
    <label class="block text-sm font-medium text-neutral-700 mb-3 flex items-center">
      <font-awesome-icon :icon="['fas', 'image']" class="text-primary mr-2" />
      衣物图片
    </label>
    <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <div class="relative group">
        <div
          class="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary/30"
        >
          <img
            v-if="localImage"
            :src="localImage"
            :alt="altText"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="text-center p-4">
            <font-awesome-icon :icon="['fas', 'image']" class="text-gray-400 text-3xl mb-2" />
            <p class="text-xs text-gray-500">暂无图片</p>
          </div>
        </div>
        <button
          v-if="localImage && !readOnly"
          @click="clearImage"
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
</template>

<script setup>
  /**
   * 图片上传组件
   *
   * 用于上传、预览和管理衣物图片，支持图片预览、清空和上传验证
   *
   * @component
   * @example
   * <ImageUpload
   *   :image="form.image"
   *   :read-only="false"
   *   @update:image="updateImage"
   * />
   */
  import { ref, watch } from 'vue';
  import { showToast } from '@/utils/toast';

  const props = defineProps({
    image: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    altText: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:image']);

  const localImage = ref(props.image);
  const fileInput = ref(null);

  // 当props.image变化时，更新localImage
  watch(
    () => props.image,
    newImage => {
      localImage.value = newImage;
    }
  );

  // 当localImage变化时，更新props
  watch(localImage, newImage => {
    emit('update:image', newImage);
  });

  // 触发文件选择
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  // 清空图片
  const clearImage = () => {
    localImage.value = '';
  };

  // 处理图片上传
  const handleImageUpload = event => {
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

        // 显示实际的图片预览，不在上传时替换为占位符
        // 占位符替换将在表单提交时进行
        localImage.value = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };
</script>
