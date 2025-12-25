<template>
  <button :class="buttonClasses" :disabled="disabled || loading" @click="handleClick">
    <span v-if="loading" class="spinner mr-2"></span>
    <span v-if="icon && iconPosition === 'left'" class="icon mr-2">{{ icon }}</span>
    <slot></slot>
    <span v-if="icon && iconPosition === 'right'" class="icon ml-2">{{ icon }}</span>
  </button>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value),
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['xs', 'sm', 'md', 'lg'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: value => ['left', 'right'].includes(value),
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: String,
      default: 'md',
      validator: value => ['none', 'sm', 'md', 'lg', 'full'].includes(value),
    },
  });

  const emit = defineEmits(['click']);

  const buttonClasses = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      props.fullWidth ? 'w-full' : '',
      getVariantClasses(),
      getSizeClasses(),
      getRoundedClasses(),
    ];
    return baseClasses.join(' ');
  });

  function getVariantClasses() {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const disabledVariants = {
      primary: 'bg-blue-300 text-white cursor-not-allowed',
      secondary: 'bg-gray-300 text-gray-500 cursor-not-allowed',
      outline: 'border-gray-200 text-gray-400 cursor-not-allowed',
      ghost: 'text-gray-400 cursor-not-allowed',
      danger: 'bg-red-300 text-white cursor-not-allowed',
    };

    return props.disabled || props.loading
      ? disabledVariants[props.variant]
      : variants[props.variant];
  }

  function getSizeClasses() {
    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return sizes[props.size];
  }

  function getRoundedClasses() {
    const roundedMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };
    return roundedMap[props.rounded];
  }

  function handleClick(event) {
    if (!props.disabled && !props.loading) {
      emit('click', event);
    }
  }
</script>

<style scoped>
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
