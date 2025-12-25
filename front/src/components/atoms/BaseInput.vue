<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="input-container" :class="{ 'has-error': hasError }">
      <div v-if="prefixIcon || $slots.prefix" class="input-prefix">
        <slot name="prefix">
          <span v-if="prefixIcon" class="prefix-icon">{{ prefixIcon }}</span>
        </slot>
      </div>

      <input
        :id="inputId"
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        :maxlength="maxLength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <div v-if="$slots.suffix || showPasswordToggle || showClear" class="input-suffix">
        <button
          v-if="showPasswordToggle && type === 'password'"
          type="button"
          class="suffix-button"
          @click="togglePassword"
        >
          {{ showPassword ? '👁️' : '👁️‍🗨️' }}
        </button>

        <button
          v-if="showClear && modelValue"
          type="button"
          class="suffix-button"
          @click="clearInput"
        >
          ✕
        </button>

        <slot name="suffix"></slot>
      </div>
    </div>

    <div v-if="hasError && error" class="input-error">
      {{ error }}
    </div>

    <div v-if="showCount && maxLength" class="input-count">
      {{ modelValue?.length || 0 }}/{{ maxLength }}
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, nextTick } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    prefixIcon: {
      type: String,
      default: '',
    },
    maxLength: {
      type: [String, Number],
      default: null,
    },
    showPasswordToggle: {
      type: Boolean,
      default: false,
    },
    showClear: {
      type: Boolean,
      default: false,
    },
    showCount: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value),
    },
    rounded: {
      type: String,
      default: 'md',
      validator: value => ['none', 'sm', 'md', 'lg'].includes(value),
    },
  });

  const emit = defineEmits(['update:modelValue', 'input', 'focus', 'blur', 'keydown', 'clear']);

  const inputRef = ref(null);
  const showPassword = ref(false);
  const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

  const hasError = computed(() => !!props.error);

  const inputType = computed(() => {
    if (props.type === 'password') {
      return showPassword.value ? 'text' : 'password';
    }
    return props.type;
  });

  const inputClasses = computed(() => {
    const baseClasses = [
      'w-full border transition-colors',
      'focus:outline-none focus:ring-2',
      getSizeClasses(),
      getRoundedClasses(),
      getStateClasses(),
    ];
    return baseClasses.join(' ');
  });

  function getSizeClasses() {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-3 text-base',
    };
    return sizes[props.size];
  }

  function getRoundedClasses() {
    const roundedMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
    };
    return roundedMap[props.rounded];
  }

  function getStateClasses() {
    if (hasError.value) {
      return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    }
    if (props.disabled) {
      return 'border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed';
    }
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  }

  function handleInput(event) {
    const value = event.target.value;
    emit('update:modelValue', value);
    emit('input', value);
  }

  function handleFocus(event) {
    emit('focus', event);
  }

  function handleBlur(event) {
    emit('blur', event);
  }

  function handleKeydown(event) {
    emit('keydown', event);
  }

  function togglePassword() {
    showPassword.value = !showPassword.value;
  }

  function clearInput() {
    emit('update:modelValue', '');
    emit('input', '');
    emit('clear');
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });
  }

  function focus() {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
      }
    });
  }

  defineExpose({
    focus,
  });
</script>

<style scoped>
  .input-wrapper {
    @apply space-y-1;
  }

  .input-label {
    @apply block text-sm font-medium text-gray-700;
  }

  .input-container {
    @apply relative flex items-center;
  }

  .input-prefix,
  .input-suffix {
    @apply absolute flex items-center pointer-events-none;
  }

  .input-prefix {
    @apply left-3;
  }

  .input-suffix {
    @apply right-3;
  }

  .prefix-icon,
  .suffix-button {
    @apply text-gray-400;
  }

  .suffix-button {
    @apply pointer-events-auto hover:text-gray-600 transition-colors;
  }

  .input-container input {
    @apply pr-10;
  }

  .input-container.has-prefix input {
    @apply pl-10;
  }

  .input-error {
    @apply text-sm text-red-600;
  }

  .input-count {
    @apply text-xs text-gray-500 text-right;
  }
</style>
