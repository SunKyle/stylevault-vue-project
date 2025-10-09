<template>
  <div
    :class="[
      'flex items-center px-2 py-1 backdrop-blur-sm rounded-lg border shadow-sm',
      colorClasses[colorScheme],
    ]"
  >
    <div
      :class="[
        'w-4 h-4 rounded-full flex items-center justify-center mr-1.5',
        iconBgClasses[colorScheme],
      ]"
    >
      <font-awesome-icon :icon="icon" :class="iconClasses[colorScheme]" />
    </div>
    <span :class="labelClasses[colorScheme]">{{ label }}:</span>
    <div class="flex flex-wrap gap-1 ml-1">
      <template v-for="(value, index) in values" :key="index">
        <span
          v-if="getLabel && getLabel(value)"
          :class="[
            'text-xs font-medium bg-white/80 px-1.5 py-0.5 rounded-full border',
            chipClasses[colorScheme],
          ]"
        >
          {{ getLabel(value) }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
      default: () => [],
    },
    getLabel: {
      type: Function,
      default: null,
    },
    colorScheme: {
      type: String,
      default: 'indigo',
      validator: value => ['indigo', 'green', 'purple'].includes(value),
    },
  });

  const colorClasses = {
    indigo: 'bg-indigo-50/80 border-indigo-100/50',
    green: 'bg-green-50/80 border-green-100/50',
    purple: 'bg-purple-50/80 border-purple-100/50',
  };

  const iconBgClasses = {
    indigo: 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20',
    green: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
    purple: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
  };

  const iconClasses = {
    indigo: 'text-indigo-600 text-xs',
    green: 'text-green-600 text-xs',
    purple: 'text-purple-600 text-xs',
  };

  const labelClasses = {
    indigo: 'text-xs text-indigo-700 font-medium',
    green: 'text-xs text-green-700 font-medium',
    purple: 'text-xs text-purple-700 font-medium',
  };

  const chipClasses = {
    indigo: 'text-indigo-600 border-indigo-100/50',
    green: 'text-green-600 border-green-100/50',
    purple: 'text-purple-600 border-purple-100/50',
  };
</script>
