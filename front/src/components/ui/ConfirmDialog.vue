<template>
  <!-- 确认弹窗组件 -->
  <teleport to="body">
    <transition name="dialog-fade">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- 遮罩层 -->
        <div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        ></div>
        
        <!-- 弹窗主体 -->
        <div 
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10 transform transition-all duration-300"
          :class="{
            'scale-95 opacity-0': !visible,
            'scale-100 opacity-100': visible
          }"
        >
          <!-- 弹窗头部 -->
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
          </div>
          
          <!-- 弹窗内容 -->
          <div class="p-6">
            <p class="text-gray-600">{{ content }}</p>
          </div>
          
          <!-- 弹窗底部（按钮区） -->
          <div class="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button
              @click="handleCancel"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="[
                'px-4 py-2 rounded-lg font-medium text-white transition-colors',
                confirmType === 'danger' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-primary hover:bg-primary/90'
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineOptions } from 'vue';

// 组件名称
defineOptions({
  name: 'ConfirmDialog'
});

// Props 定义
const props = defineProps({
  // 是否显示弹窗（双向绑定）
  visible: {
    type: Boolean,
    default: false
  },
  // 弹窗标题
  title: {
    type: String,
    default: '确认操作'
  },
  // 弹窗内容
  content: {
    type: String,
    default: '您确定要执行此操作吗？'
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: '确认'
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确认按钮类型（danger/primary）
  confirmType: {
    type: String,
    default: 'primary',
    validator: (value) => ['danger', 'primary'].includes(value)
  },
  // 是否点击遮罩层关闭
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
});

// 事件定义
const emit = defineEmits([
  'update:visible', // 双向绑定更新事件
  'confirm',       // 确认事件
  'cancel'         // 取消事件
]);

// 内部状态（解决双向绑定延迟问题）
const isVisible = ref(props.visible);

// 监听外部 visible 变化
watch(
  () => props.visible,
  (val) => {
    isVisible.value = val;
  },
  { immediate: true }
);

// 监听内部状态变化，同步到外部
watch(
  () => isVisible.value,
  (val) => {
    emit('update:visible', val);
  }
);

// 处理遮罩层点击
const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleCancel();
  }
};

// 处理取消
const handleCancel = () => {
  isVisible.value = false;
  emit('cancel');
};

// 处理确认
const handleConfirm = () => {
  isVisible.value = false;
  emit('confirm');
};
</script>

<style scoped>
/* 弹窗淡入淡出动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

/* 按钮焦点样式优化 */
button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}
</style>